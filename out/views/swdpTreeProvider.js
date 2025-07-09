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
exports.SwdpTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const projectManager_1 = require("../services/projectManager");
const iconUtils_1 = require("../utils/iconUtils");
class SwdpTreeProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    projectManager;
    buildResults = new Map();
    constructor() {
        this.projectManager = projectManager_1.ProjectManager.getInstance();
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // 루트 노드들
            return this.getRootItems();
        }
        // 자식 노드들
        return this.getChildItems(element);
    }
    async getRootItems() {
        const items = [];
        const project = this.projectManager.getCurrentProject();
        if (!project) {
            return [new TreeItem('No project selected', vscode.TreeItemCollapsibleState.None, 'info')];
        }
        // 프로젝트 정보 섹션
        const projectItem = new TreeItem(`Project: ${project.name}`, vscode.TreeItemCollapsibleState.Expanded, 'project');
        projectItem.iconPath = (0, iconUtils_1.getContextIcon)('project');
        projectItem.tooltip = `${project.description || 'No description'}\nRepository: ${project.repository}`;
        items.push(projectItem);
        // 빌드 타입 섹션들
        const buildTypes = [
            { type: 'dev', label: 'Layer Build' },
            { type: 'rel', label: 'Rel Build' },
            { type: 'commit', label: 'Commit Build' }
        ];
        for (const buildType of buildTypes) {
            const buildItem = new TreeItem(buildType.label, vscode.TreeItemCollapsibleState.Expanded, 'buildType');
            buildItem.iconPath = (0, iconUtils_1.getBuildTypeIcon)(buildType.type);
            buildItem.contextValue = `buildType:${buildType.type}`;
            buildItem.buildType = buildType.type;
            items.push(buildItem);
        }
        return items;
    }
    async getChildItems(element) {
        const items = [];
        if (element.contextValue === 'project') {
            // 프로젝트 정보 하위 항목
            const project = this.projectManager.getCurrentProject();
            if (project) {
                const settingsInfoItem = new TreeItem('Project Settings Info', vscode.TreeItemCollapsibleState.None, 'projectSettingsInfo');
                settingsInfoItem.iconPath = (0, iconUtils_1.getContextIcon)('settings');
                settingsInfoItem.command = {
                    command: 'buildAgent.showProjectSettingsInfo',
                    title: 'Show Project Settings Info'
                };
                items.push(settingsInfoItem);
            }
        }
        else if (element.contextValue?.startsWith('buildType:')) {
            // 빌드 타입 하위 항목
            const buildType = element.buildType;
            const config = this.projectManager.getBuildConfig(buildType);
            if (config) {
                // 브랜치 정보
                const branchItem = new TreeItem(`Branch: ${this.projectManager.getCurrentProject()?.defaultBranch || 'main'}`, vscode.TreeItemCollapsibleState.None, 'info');
                branchItem.iconPath = (0, iconUtils_1.createIcon)('branch', new vscode.ThemeColor('charts.green'));
                items.push(branchItem);
                // 빌드 설정 정보
                const configItem = new TreeItem(`Config: ${config.compiler} (${config.target})`, vscode.TreeItemCollapsibleState.None, 'buildConfig');
                configItem.iconPath = (0, iconUtils_1.getContextIcon)('config');
                configItem.tooltip = `Compiler: ${config.compiler}\nTarget: ${config.target}\nTests: ${config.testSuite.join(', ')}\nStatic Analysis: ${config.staticAnalysis ? 'Enabled' : 'Disabled'}`;
                configItem.command = {
                    command: 'buildAgent.editBuildConfig',
                    title: 'Edit Build Config',
                    arguments: [buildType]
                };
                configItem.contextValue = 'buildConfig';
                items.push(configItem);
                // 테스트 정보 (체크박스 형태)
                const testSectionItem = new TreeItem('Test Configuration', vscode.TreeItemCollapsibleState.Expanded, 'testSection');
                testSectionItem.iconPath = (0, iconUtils_1.createIcon)('test', new vscode.ThemeColor('charts.blue'));
                testSectionItem.buildType = buildType;
                items.push(testSectionItem);
                // 빌드 실행 버튼
                const buildLabel = buildType === 'dev' ? 'Layer' : buildType.toUpperCase();
                const buildItem = new TreeItem(`Start ${buildLabel} Build`, vscode.TreeItemCollapsibleState.None, 'buildAction');
                buildItem.iconPath = (0, iconUtils_1.createIcon)('play', new vscode.ThemeColor('charts.green'));
                buildItem.command = {
                    command: `buildAgent.${buildType}Build`,
                    title: `Start ${buildType} Build`,
                    arguments: [buildType]
                };
                items.push(buildItem);
                // 최근 빌드 결과 (있는 경우)
                const recentBuild = await this.getRecentBuild(buildType);
                if (recentBuild) {
                    const resultItem = new TreeItem(`Last Build: ${this.getStatusText(recentBuild.status.status)}`, vscode.TreeItemCollapsibleState.None, 'buildResult');
                    resultItem.iconPath = (0, iconUtils_1.getStatusIcon)(recentBuild.status.status);
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
        }
        else if (element.contextValue === 'testSection') {
            // 테스트 섹션 하위 항목 (체크박스 형태)
            const config = this.projectManager.getBuildConfig(element.buildType || 'dev');
            if (config) {
                const availableTests = ['unit', 'integration', 'simulation', 'performance'];
                availableTests.forEach(testType => {
                    const isChecked = config.testSuite.includes(testType);
                    const testItem = new TreeItem(`${testType.charAt(0).toUpperCase() + testType.slice(1)} Test`, vscode.TreeItemCollapsibleState.None, 'testItem');
                    testItem.iconPath = isChecked ?
                        (0, iconUtils_1.createIcon)('success', new vscode.ThemeColor('charts.green')) :
                        (0, iconUtils_1.createIcon)('info', new vscode.ThemeColor('charts.gray'));
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
    async getRecentBuild(buildType) {
        const project = this.projectManager.getCurrentProject();
        if (!project) {
            return null;
        }
        try {
            const builds = await this.projectManager.getSwdpClient().getBuildResults(project.id);
            const recentBuild = builds.find(b => b.buildType === buildType);
            return recentBuild || null;
        }
        catch (error) {
            console.error('Failed to get recent build:', error);
            return null;
        }
    }
    getStatusText(status) {
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
    updateBuildResult(buildResult) {
        this.buildResults.set(buildResult.id, buildResult);
        this.refresh();
    }
    // 빌드 상태 업데이트
    updateBuildStatus(buildId, status) {
        const build = this.buildResults.get(buildId);
        if (build) {
            build.status = status;
            this.refresh();
        }
    }
}
exports.SwdpTreeProvider = SwdpTreeProvider;
class TreeItem extends vscode.TreeItem {
    label;
    collapsibleState;
    buildType;
    constructor(label, collapsibleState, contextValue, buildType) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.contextValue = contextValue;
        this.buildType = buildType;
    }
}
//# sourceMappingURL=swdpTreeProvider.js.map