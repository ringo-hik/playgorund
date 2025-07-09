import * as vscode from 'vscode';
import { ProjectManager } from '../services/projectManager';
import { createIcon, getContextIcon } from '../utils/iconUtils';

export class ProjectTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private projectManager: ProjectManager;

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
      return this.getRootItems();
    }
    return [];
  }

  private getRootItems(): TreeItem[] {
    const items: TreeItem[] = [];

    // 프로젝트 선택 버튼
    const selectProjectItem = new TreeItem(
      'Select Project',
      vscode.TreeItemCollapsibleState.None,
      'selectProject'
    );
    selectProjectItem.iconPath = createIcon('search', new vscode.ThemeColor('charts.blue'));
    selectProjectItem.tooltip = 'Click to select a project from SWDP';
    selectProjectItem.command = {
      command: 'buildAgent.selectProject',
      title: 'Select Project'
    };
    items.push(selectProjectItem);

    // 안내 메시지
    const infoItem = new TreeItem(
      'No project selected',
      vscode.TreeItemCollapsibleState.None,
      'info'
    );
    infoItem.iconPath = getContextIcon('info');
    infoItem.tooltip = 'Please select a project to start building';
    items.push(infoItem);

    // 도움말 항목
    const helpItem = new TreeItem(
      'Getting Started',
      vscode.TreeItemCollapsibleState.None,
      'help'
    );
    helpItem.iconPath = getContextIcon('help');
    helpItem.tooltip = 'Learn how to use Build Agent';
    helpItem.command = {
      command: 'buildAgent.showHelp',
      title: 'Show Help'
    };
    items.push(helpItem);

    return items;
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue?: string
  ) {
    super(label, collapsibleState);
  }
}