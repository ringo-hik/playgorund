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
exports.PumbaTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const iconUtils_1 = require("../utils/iconUtils");
class PumbaTreeProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor() { }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            return this.getRootItems();
        }
        return this.getChildItems(element);
    }
    getRootItems() {
        const items = [];
        // PUMBA 설정 항목
        const configItem = new TreeItem('PUMBA Configuration', vscode.TreeItemCollapsibleState.Expanded, 'pumbaConfig');
        configItem.iconPath = (0, iconUtils_1.getContextIcon)('config');
        configItem.tooltip = 'Configure PUMBA build settings';
        items.push(configItem);
        // 빌드 실행 항목
        const buildItem = new TreeItem('Remote Build', vscode.TreeItemCollapsibleState.Expanded, 'pumbaBuild');
        buildItem.iconPath = (0, iconUtils_1.createIcon)('cloud', new vscode.ThemeColor('charts.blue'));
        buildItem.tooltip = 'Start remote build with current workspace';
        items.push(buildItem);
        // 빌드 히스토리 항목
        const historyItem = new TreeItem('Build History', vscode.TreeItemCollapsibleState.Collapsed, 'pumbaHistory');
        historyItem.iconPath = (0, iconUtils_1.getContextIcon)('history');
        historyItem.tooltip = 'View recent PUMBA build results';
        items.push(historyItem);
        return items;
    }
    getChildItems(element) {
        const items = [];
        switch (element.contextValue) {
            case 'pumbaConfig':
                items.push(new TreeItem('Compiler: gcc10', vscode.TreeItemCollapsibleState.None, 'configItem'));
                items.push(new TreeItem('Build Type: debug', vscode.TreeItemCollapsibleState.None, 'configItem'));
                items.push(new TreeItem('Tests: unit, integration', vscode.TreeItemCollapsibleState.None, 'configItem'));
                const editConfigItem = new TreeItem('Edit Configuration', vscode.TreeItemCollapsibleState.None, 'editConfig');
                editConfigItem.iconPath = (0, iconUtils_1.createIcon)('edit', new vscode.ThemeColor('charts.orange'));
                editConfigItem.command = {
                    command: 'buildAgent.editPumbaConfig',
                    title: 'Edit PUMBA Configuration'
                };
                items.push(editConfigItem);
                break;
            case 'pumbaBuild':
                const startBuildItem = new TreeItem('Start Build', vscode.TreeItemCollapsibleState.None, 'startBuild');
                startBuildItem.iconPath = (0, iconUtils_1.createIcon)('play', new vscode.ThemeColor('charts.green'));
                startBuildItem.command = {
                    command: 'buildAgent.pumbaBuild',
                    title: 'Start PUMBA Build'
                };
                items.push(startBuildItem);
                items.push(new TreeItem('Workspace: Current', vscode.TreeItemCollapsibleState.None, 'info'));
                items.push(new TreeItem('Status: Ready', vscode.TreeItemCollapsibleState.None, 'info'));
                break;
            case 'pumbaHistory':
                items.push(new TreeItem('Build #123 - Success (2h ago)', vscode.TreeItemCollapsibleState.None, 'historyItem'));
                items.push(new TreeItem('Build #122 - Failed (4h ago)', vscode.TreeItemCollapsibleState.None, 'historyItem'));
                items.push(new TreeItem('Build #121 - Success (1d ago)', vscode.TreeItemCollapsibleState.None, 'historyItem'));
                break;
        }
        return items;
    }
}
exports.PumbaTreeProvider = PumbaTreeProvider;
class TreeItem extends vscode.TreeItem {
    label;
    collapsibleState;
    contextValue;
    constructor(label, collapsibleState, contextValue) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.contextValue = contextValue;
    }
}
//# sourceMappingURL=pumbaTreeProvider.js.map