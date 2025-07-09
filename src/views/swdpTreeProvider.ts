import * as vscode from 'vscode';
import { ProjectManager } from '../services/projectManager';
import { Project, BuildType } from '../types/project';
import { BuildResult } from '../types/build';
import { createIcon, getStatusIcon, getBuildTypeIcon, getContextIcon } from '../utils/iconUtils';

export class SwdpTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private projectManager: ProjectManager;
  private buildResults: Map<string, BuildResult> = new Map();

  constructor() {
    this.projectManager = ProjectManager.getInstance();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      // 루트 노드들
      return this.getRootItems();
    }

    // 자식 노드들
    return this.getChildItems(element);
  }

  private async getRootItems(): Promise<TreeItem[]> {
    const items: TreeItem[] = [];
    const project = this.projectManager.getCurrentProject();

    if (!project) {
      return [new TreeItem('No project selected', vscode.TreeItemCollapsibleState.None, 'info')];
    }

    // 프로젝트 정보 섹션
    const projectItem = new TreeItem(
      `Project: ${project.name}`,
      vscode.TreeItemCollapsibleState.Expanded,
      'project'
    );
    projectItem.iconPath = getContextIcon('project');
    projectItem.tooltip = `${project.description || 'No description'}\nRepository: ${project.repository}`;
    items.push(projectItem);

    // 빌드 타입 섹션들
    const buildTypes: { type: BuildType; label: string }[] = [
      { type: 'dev', label: 'Layer Build' },
      { type: 'rel', label: 'Rel Build' },
      { type: 'commit', label: 'Commit Build' }
    ];

    for (const buildType of buildTypes) {
      const buildItem = new TreeItem(
        buildType.label,
        vscode.TreeItemCollapsibleState.Expanded,
        'buildType'
      );
      buildItem.iconPath = getBuildTypeIcon(buildType.type);
      buildItem.contextValue = `buildType:${buildType.type}`;
      buildItem.buildType = buildType.type;
      items.push(buildItem);
    }

    return items;
  }

  private async getChildItems(element: TreeItem): Promise<TreeItem[]> {
    const items: TreeItem[] = [];

    if (element.contextValue === 'project') {
      // 프로젝트 정보 하위 항목
      const project = this.projectManager.getCurrentProject();
      if (project) {
        const settingsInfoItem = new TreeItem(
          'Project Settings Info',
          vscode.TreeItemCollapsibleState.None,
          'projectSettingsInfo'
        );
        settingsInfoItem.iconPath = getContextIcon('settings');
        settingsInfoItem.command = {
          command: 'buildAgent.showProjectSettingsInfo',
          title: 'Show Project Settings Info'
        };
        items.push(settingsInfoItem);
      }
    } else if (element.contextValue?.startsWith('buildType:')) {
      // 빌드 타입 하위 항목
      const buildType = element.buildType!;
      const config = this.projectManager.getBuildConfig(buildType);
      
      if (config) {
        // 브랜치 정보
        const branchItem = new TreeItem(
          `Branch: ${this.projectManager.getCurrentProject()?.defaultBranch || 'main'}`,
          vscode.TreeItemCollapsibleState.None,
          'info'
        );
        branchItem.iconPath = createIcon('branch', new vscode.ThemeColor('charts.green'));
        items.push(branchItem);

        // 빌드 설정 정보
        const configItem = new TreeItem(
          `Config: ${config.compiler} (${config.target})`,
          vscode.TreeItemCollapsibleState.None,
          'buildConfig'
        );
        configItem.iconPath = getContextIcon('config');
        configItem.tooltip = `Compiler: ${config.compiler}\nTarget: ${config.target}\nTests: ${config.testSuite.join(', ')}\nStatic Analysis: ${config.staticAnalysis ? 'Enabled' : 'Disabled'}`;
        configItem.command = {
          command: 'buildAgent.editBuildConfig',
          title: 'Edit Build Config',
          arguments: [buildType]
        };
        configItem.contextValue = 'buildConfig';
        items.push(configItem);

        // 테스트 정보 (체크박스 형태)
        const testSectionItem = new TreeItem(
          'Test Configuration',
          vscode.TreeItemCollapsibleState.Expanded,
          'testSection'
        );
        testSectionItem.iconPath = createIcon('test', new vscode.ThemeColor('charts.blue'));
        testSectionItem.buildType = buildType;
        items.push(testSectionItem);

        // 빌드 실행 버튼
        const buildLabel = buildType === 'dev' ? 'Layer' : buildType.toUpperCase();
        const buildItem = new TreeItem(
          `Start ${buildLabel} Build`,
          vscode.TreeItemCollapsibleState.None,
          'buildAction'
        );
        buildItem.iconPath = createIcon('play', new vscode.ThemeColor('charts.green'));
        buildItem.command = {
          command: `buildAgent.${buildType}Build`,
          title: `Start ${buildType} Build`,
          arguments: [buildType]
        };
        items.push(buildItem);

        // 최근 빌드 결과 (있는 경우)
        const recentBuild = await this.getRecentBuild(buildType);
        if (recentBuild) {
          const resultItem = new TreeItem(
            `Last Build: ${this.getStatusText(recentBuild.status.status)}`,
            vscode.TreeItemCollapsibleState.None,
            'buildResult'
          );
          resultItem.iconPath = getStatusIcon(recentBuild.status.status);
          resultItem.tooltip = `Status: ${recentBuild.status.status}\nDuration: ${recentBuild.status.duration || 'N/A'}\nStarted: ${recentBuild.status.startTime}`;
          resultItem.command = {
            command: 'buildAgent.showBuildDetails',
            title: 'Show Build Details',
            arguments: [recentBuild]
          };
          resultItem.contextValue = 'buildResult';
          items.push(resultItem);
        }
      }
    } else if (element.contextValue === 'testSection') {
      // 테스트 섹션 하위 항목 (체크박스 형태)
      const config = this.projectManager.getBuildConfig(element.buildType || 'dev');
      if (config) {
        const availableTests = ['unit', 'integration', 'simulation', 'performance'];
        
        availableTests.forEach(testType => {
          const isChecked = config.testSuite.includes(testType);
          const testItem = new TreeItem(
            `${testType.charAt(0).toUpperCase() + testType.slice(1)} Test`,
            vscode.TreeItemCollapsibleState.None,
            'testItem'
          );
          testItem.iconPath = isChecked ?
            createIcon('success', new vscode.ThemeColor('charts.green')) :
            createIcon('info', new vscode.ThemeColor('charts.gray'));
          testItem.command = {
            command: 'buildAgent.toggleTest',
            title: 'Toggle Test',
            arguments: [element.buildType || 'dev', testType]
          };
          items.push(testItem);
        });
      }
    }

    return items;
  }

  private async getRecentBuild(buildType: BuildType): Promise<BuildResult | null> {
    const project = this.projectManager.getCurrentProject();
    if (!project) {
      return null;
    }

    try {
      const builds = await this.projectManager.getSwdpClient().getBuildResults(project.id);
      const recentBuild = builds.find(b => b.buildType === buildType);
      return recentBuild || null;
    } catch (error) {
      console.error('Failed to get recent build:', error);
      return null;
    }
  }

  private getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'running': return 'Running';
      case 'success': return 'Success';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  }

  // 이 메서드는 제거되었습니다. iconUtils.ts의 getStatusIcon을 사용합니다.

  // 빌드 결과 업데이트
  updateBuildResult(buildResult: BuildResult): void {
    this.buildResults.set(buildResult.id, buildResult);
    this.refresh();
  }

  // 빌드 상태 업데이트
  updateBuildStatus(buildId: string, status: any): void {
    const build = this.buildResults.get(buildId);
    if (build) {
      build.status = status;
      this.refresh();
    }
  }
}

class TreeItem extends vscode.TreeItem {
  public buildType?: BuildType;
  
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    contextValue?: string,
    buildType?: BuildType
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;
    this.buildType = buildType;
  }
}