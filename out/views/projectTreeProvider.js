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
exports.ProjectTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const projectManager_1 = require("../services/projectManager");
const iconUtils_1 = require("../utils/iconUtils");
class ProjectTreeProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    projectManager;
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
            return this.getRootItems();
        }
        return [];
    }
    getRootItems() {
        const items = [];
        // 프로젝트 선택 버튼
        const selectProjectItem = new TreeItem('Select Project', vscode.TreeItemCollapsibleState.None, 'selectProject');
        selectProjectItem.iconPath = (0, iconUtils_1.createIcon)('search', new vscode.ThemeColor('charts.blue'));
        selectProjectItem.tooltip = 'Click to select a project from SWDP';
        selectProjectItem.command = {
            command: 'buildAgent.selectProject',
            title: 'Select Project'
        };
        items.push(selectProjectItem);
        // 안내 메시지
        const infoItem = new TreeItem('No project selected', vscode.TreeItemCollapsibleState.None, 'info');
        infoItem.iconPath = (0, iconUtils_1.getContextIcon)('info');
        infoItem.tooltip = 'Please select a project to start building';
        items.push(infoItem);
        // 도움말 항목
        const helpItem = new TreeItem('Getting Started', vscode.TreeItemCollapsibleState.None, 'help');
        helpItem.iconPath = (0, iconUtils_1.getContextIcon)('help');
        helpItem.tooltip = 'Learn how to use Build Agent';
        helpItem.command = {
            command: 'buildAgent.showHelp',
            title: 'Show Help'
        };
        items.push(helpItem);
        return items;
    }
}
exports.ProjectTreeProvider = ProjectTreeProvider;
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
//# sourceMappingURL=projectTreeProvider.js.map