"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const vscode = __importStar(require("vscode"));
const mockSwdpClient_1 = require("./mockSwdpClient");
class ProjectManager {
    static instance;
    swdpClient;
    currentProject = null;
    projectSettings = null;
    settingsFile = '.vscode/swdp-project.json';
    constructor() {
        this.swdpClient = new mockSwdpClient_1.MockSwdpClient();
    }
    static getInstance() {
        if (!ProjectManager.instance) {
            ProjectManager.instance = new ProjectManager();
        }
        return ProjectManager.instance;
    }
    // 프로젝트 선택 UI 표시
    async selectProject() {
        try {
            const projects = await this.swdpClient.getProjects();
            if (projects.length === 0) {
                vscode.window.showWarningMessage('No projects available');
                return undefined;
            }
            const quickPick = vscode.window.createQuickPick();
            quickPick.title = 'Select SWDP Project';
            quickPick.placeholder = 'Search and select a project...';
            quickPick.matchOnDescription = true;
            quickPick.matchOnDetail = true;
            // QuickPick 아이템 생성
            quickPick.items = projects.map(project => ({
                label: `$(repo) ${project.name}`,
                description: project.repository,
                detail: `Last build: ${project.lastBuildTime ? new Date(project.lastBuildTime).toLocaleString() : 'Never'} | Branch: ${project.defaultBranch}`,
                project
            }));
            quickPick.busy = false;
            return new Promise((resolve) => {
                quickPick.onDidChangeSelection(([item]) => {
                    if (item) {
                        quickPick.hide();
                        resolve(item.project);
                    }
                });
                quickPick.onDidHide(() => {
                    resolve(undefined);
                });
                quickPick.show();
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to load projects: ${error}`);
            return undefined;
        }
    }
    // 프로젝트 설정 및 저장
    async setProject(project) {
        try {
            this.currentProject = project;
            // SWDP API에서 프로젝트 설정 로드
            const projectConfig = await this.swdpClient.getProjectConfig(project.id);
            if (!projectConfig) {
                vscode.window.showErrorMessage('Failed to load project configuration');
                return false;
            }
            // 프로젝트 설정 생성
            this.projectSettings = {
                projectId: project.id,
                projectName: project.name,
                defaultBranch: project.defaultBranch,
                buildConfigs: {
                    dev: { ...projectConfig.devBuildConfig },
                    rel: { ...projectConfig.relBuildConfig },
                    commit: { ...projectConfig.commitBuildConfig }
                },
                customOptions: {
                    parallelJobs: 4,
                    timeout: 1800,
                    notifications: true
                }
            };
            // 설정 파일 저장
            await this.saveProjectSettings();
            // Context 설정
            vscode.commands.executeCommand('setContext', 'buildAgent:hasProject', true);
            vscode.window.showInformationMessage(`Project "${project.name}" selected successfully`);
            return true;
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to set project: ${error}`);
            return false;
        }
    }
    // 프로젝트 설정 로드
    async loadProjectSettings() {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                return false;
            }
            const settingsUri = vscode.Uri.joinPath(workspaceFolder.uri, this.settingsFile);
            try {
                const content = await vscode.workspace.fs.readFile(settingsUri);
                const settings = JSON.parse(content.toString());
                // 설정 검증
                if (settings.projectId && settings.projectName) {
                    this.projectSettings = settings;
                    // 프로젝트 정보 로드
                    this.currentProject = await this.swdpClient.getProject(settings.projectId);
                    if (this.currentProject) {
                        vscode.commands.executeCommand('setContext', 'buildAgent:hasProject', true);
                        return true;
                    }
                }
            }
            catch (error) {
                // 설정 파일이 없거나 잘못된 형식
                console.log('No valid project settings found');
            }
            vscode.commands.executeCommand('setContext', 'buildAgent:hasProject', false);
            return false;
        }
        catch (error) {
            console.error('Failed to load project settings:', error);
            return false;
        }
    }
    // 프로젝트 설정 저장
    async saveProjectSettings() {
        if (!this.projectSettings) {
            return;
        }
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }
        const settingsUri = vscode.Uri.joinPath(workspaceFolder.uri, this.settingsFile);
        const content = JSON.stringify(this.projectSettings, null, 2);
        await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(content));
    }
    // 빌드 설정 수정
    async editBuildConfig(buildType) {
        if (!this.projectSettings) {
            vscode.window.showWarningMessage('No project selected');
            return;
        }
        const config = this.projectSettings.buildConfigs[buildType];
        const updatedConfig = await this.showBuildConfigEditor(config, buildType);
        if (updatedConfig) {
            this.projectSettings.buildConfigs[buildType] = updatedConfig;
            await this.saveProjectSettings();
            vscode.window.showInformationMessage(`${buildType.toUpperCase()} build configuration updated`);
        }
    }
    // 빌드 설정 편집 UI
    async showBuildConfigEditor(config, buildType) {
        const options = [
            {
                label: `$(gear) Compiler: ${config.compiler}`,
                description: 'Change compiler version',
                action: 'compiler'
            },
            {
                label: `$(target) Target: ${config.target}`,
                description: 'Change build target',
                action: 'target'
            },
            {
                label: `$(beaker) Tests: ${config.testSuite.join(', ')}`,
                description: 'Select test suites',
                action: 'tests'
            },
            {
                label: `$(search) Static Analysis: ${config.staticAnalysis ? 'Enabled' : 'Disabled'}`,
                description: 'Toggle static analysis',
                action: 'static'
            },
            {
                label: `$(code) Defines: ${config.customDefines.join(', ')}`,
                description: 'Custom compiler defines',
                action: 'defines'
            }
        ];
        const selection = await vscode.window.showQuickPick(options, {
            title: `Edit ${buildType.toUpperCase()} Build Configuration`,
            placeHolder: 'Select setting to modify'
        });
        if (!selection) {
            return undefined;
        }
        const newConfig = { ...config };
        switch (selection.action) {
            case 'compiler':
                const compilerOptions = ['gcc9', 'gcc10', 'gcc11', 'clang12', 'clang13'];
                const selectedCompiler = await vscode.window.showQuickPick(compilerOptions, {
                    title: 'Select Compiler',
                    placeHolder: 'Choose compiler version'
                });
                if (selectedCompiler) {
                    newConfig.compiler = selectedCompiler;
                }
                break;
            case 'target':
                const targetOptions = ['debug', 'release', 'profile'];
                const selectedTarget = await vscode.window.showQuickPick(targetOptions, {
                    title: 'Select Build Target',
                    placeHolder: 'Choose build target'
                });
                if (selectedTarget) {
                    newConfig.target = selectedTarget;
                }
                break;
            case 'tests':
                const testOptions = ['unit', 'integration', 'simulation', 'performance'];
                const selectedTests = await vscode.window.showQuickPick(testOptions, {
                    title: 'Select Test Suites',
                    placeHolder: 'Choose test suites to run',
                    canPickMany: true
                });
                if (selectedTests) {
                    newConfig.testSuite = selectedTests;
                }
                break;
            case 'static':
                newConfig.staticAnalysis = !newConfig.staticAnalysis;
                break;
            case 'defines':
                const definesInput = await vscode.window.showInputBox({
                    title: 'Custom Defines',
                    value: newConfig.customDefines.join(', '),
                    prompt: 'Enter custom compiler defines (comma-separated)'
                });
                if (definesInput !== undefined) {
                    newConfig.customDefines = definesInput.split(',').map(d => d.trim()).filter(d => d);
                }
                break;
        }
        return newConfig;
    }
    // Getter 메서드들
    getCurrentProject() {
        return this.currentProject;
    }
    getProjectSettings() {
        return this.projectSettings;
    }
    getBuildConfig(buildType) {
        return this.projectSettings?.buildConfigs[buildType] || null;
    }
    getSwdpClient() {
        return this.swdpClient;
    }
}
exports.ProjectManager = ProjectManager;
//# sourceMappingURL=projectManager.js.map