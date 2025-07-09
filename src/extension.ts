import * as vscode from 'vscode';
import { ProjectManager } from './services/projectManager';
import { SwdpTreeProvider } from './views/swdpTreeProvider';
import { ProjectTreeProvider } from './views/projectTreeProvider';
import { PumbaTreeProvider } from './views/pumbaTreeProvider';
import { MarkdownViewer } from './utils/markdownViewer';
import { BuildType } from './types/project';
import { BuildResult } from './types/build';

export async function activate(context: vscode.ExtensionContext) {
  console.log('Build Agent extension is now active!');

  // 서비스 및 프로바이더 초기화
  const projectManager = ProjectManager.getInstance();
  const swdpTreeProvider = new SwdpTreeProvider();
  const projectTreeProvider = new ProjectTreeProvider();
  const pumbaTreeProvider = new PumbaTreeProvider();

  // TreeView 등록
  const swdpTreeView = vscode.window.createTreeView('swdpView', {
    treeDataProvider: swdpTreeProvider,
    showCollapseAll: true
  });

  const projectTreeView = vscode.window.createTreeView('projectView', {
    treeDataProvider: projectTreeProvider,
    showCollapseAll: false
  });

  const pumbaTreeView = vscode.window.createTreeView('pumbaView', {
    treeDataProvider: pumbaTreeProvider,
    showCollapseAll: true
  });

  // 확장 시작 시 프로젝트 설정 로드
  await projectManager.loadProjectSettings();

  // 명령어 등록
  const commands = [
    // 프로젝트 관리 명령어
    vscode.commands.registerCommand('buildAgent.selectProject', async () => {
      const selectedProject = await projectManager.selectProject();
      if (selectedProject) {
        const success = await projectManager.setProject(selectedProject);
        if (success) {
          swdpTreeProvider.refresh();
          projectTreeProvider.refresh();
        }
      }
    }),

    vscode.commands.registerCommand('buildAgent.changeProject', async () => {
      const selectedProject = await projectManager.selectProject();
      if (selectedProject) {
        const success = await projectManager.setProject(selectedProject);
        if (success) {
          swdpTreeProvider.refresh();
        }
      }
    }),

    vscode.commands.registerCommand('buildAgent.editProjectSettings', async () => {
      vscode.window.showInformationMessage('Project settings editor will be implemented');
    }),

    // 빌드 설정 명령어
    vscode.commands.registerCommand('buildAgent.editBuildConfig', async (buildType: BuildType) => {
      await projectManager.editBuildConfig(buildType);
      swdpTreeProvider.refresh();
    }),

    // 빌드 실행 명령어
    vscode.commands.registerCommand('buildAgent.devBuild', async () => {
      await startBuild('dev', projectManager, swdpTreeProvider);
    }),

    vscode.commands.registerCommand('buildAgent.relBuild', async () => {
      await startBuild('rel', projectManager, swdpTreeProvider);
    }),

    vscode.commands.registerCommand('buildAgent.commitBuild', async () => {
      await startBuild('commit', projectManager, swdpTreeProvider);
    }),

    // PUMBA 빌드 명령어
    vscode.commands.registerCommand('buildAgent.pumbaBuild', async () => {
      await startPumbaBuild();
    }),

    // 기타 명령어
    vscode.commands.registerCommand('buildAgent.showBuildDetails', async (buildResult: BuildResult) => {
      await MarkdownViewer.showBuildDetails(buildResult);
    }),

    vscode.commands.registerCommand('buildAgent.showHelp', async () => {
      await MarkdownViewer.showHelp();
    }),

    vscode.commands.registerCommand('buildAgent.refreshView', async () => {
      swdpTreeProvider.refresh();
      projectTreeProvider.refresh();
      pumbaTreeProvider.refresh();
    })
  ];

  // 구독 등록
  context.subscriptions.push(
    swdpTreeView,
    projectTreeView,
    pumbaTreeView,
    ...commands
  );

  // 상태바 항목 (선택적)
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = '$(tools) Build Agent';
  statusBarItem.tooltip = 'Build Agent Status';
  statusBarItem.command = 'buildAgent.refreshView';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 출력 채널 생성
  const outputChannel = vscode.window.createOutputChannel('Build Agent');
  context.subscriptions.push(outputChannel);

  console.log('Build Agent extension activated successfully!');
}

// 빌드 실행 함수
async function startBuild(buildType: BuildType, projectManager: ProjectManager, treeProvider: SwdpTreeProvider) {
  const project = projectManager.getCurrentProject();
  const buildConfig = projectManager.getBuildConfig(buildType);

  if (!project || !buildConfig) {
    vscode.window.showErrorMessage('No project selected or build configuration not found');
    return;
  }

  try {
    // 빌드 요청 생성
    const buildRequest = {
      projectId: project.id,
      branch: project.defaultBranch,
      buildType,
      config: buildConfig
    };

    // 빌드 시작 알림
    vscode.window.showInformationMessage(`Starting ${buildType.toUpperCase()} build for ${project.name}`);

    // 빌드 요청
    const buildResult = await projectManager.getSwdpClient().createBuild(buildRequest);

    // TreeView 업데이트
    treeProvider.updateBuildResult(buildResult);

    // 진행률 표시
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `Building ${project.name} (${buildType.toUpperCase()})`,
      cancellable: false
    }, async (progress) => {
      // 빌드 상태 폴링
      const pollingInterval = setInterval(async () => {
        try {
          const status = await projectManager.getSwdpClient().getBuildStatus(buildResult.id);
          if (status) {
            progress.report({ 
              increment: status.progress - buildResult.status.progress,
              message: `${status.progress}% - ${status.status}`
            });
            
            treeProvider.updateBuildStatus(buildResult.id, status);
            
            if (status.status === 'success' || status.status === 'failed') {
              clearInterval(pollingInterval);
              
              // 최종 알림
              if (status.status === 'success') {
                vscode.window.showInformationMessage(
                  `Build completed successfully in ${status.duration}`,
                  'View Details'
                ).then(selection => {
                  if (selection === 'View Details') {
                    MarkdownViewer.showBuildDetails(buildResult);
                  }
                });
              } else {
                vscode.window.showErrorMessage(
                  `Build failed: ${status.errorMessage}`,
                  'View Details'
                ).then(selection => {
                  if (selection === 'View Details') {
                    MarkdownViewer.showBuildDetails(buildResult);
                  }
                });
              }
            }
          }
        } catch (error) {
          console.error('Error polling build status:', error);
          clearInterval(pollingInterval);
        }
      }, 3000); // 3초마다 상태 확인

      // 최대 30분 후 폴링 중지
      setTimeout(() => {
        clearInterval(pollingInterval);
      }, 30 * 60 * 1000);
    });

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to start build: ${error}`);
  }
}

// PUMBA 빌드 실행 함수
async function startPumbaBuild() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'PUMBA Remote Build',
    cancellable: false
  }, async (progress) => {
    progress.report({ increment: 0, message: 'Preparing workspace...' });
    
    // Mock PUMBA 빌드 진행
    await new Promise(resolve => setTimeout(resolve, 1000));
    progress.report({ increment: 25, message: 'Compressing files...' });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    progress.report({ increment: 50, message: 'Uploading to build server...' });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    progress.report({ increment: 75, message: 'Building remotely...' });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    progress.report({ increment: 100, message: 'Build completed!' });
    
    vscode.window.showInformationMessage('PUMBA build completed successfully!');
  });
}

export function deactivate() {
  console.log('Build Agent extension deactivated');
}