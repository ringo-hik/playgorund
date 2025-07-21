const vscode = require('vscode');

class ChatOpsTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            // Root level - return Reports directly
            return [
                new ChatOpsTreeItem(
                    'Reports', 
                    'Report Management', 
                    vscode.TreeItemCollapsibleState.Expanded,
                    'reports'
                )
            ];
        }

        if (element.contextValue === 'reports') {
            // Reports category level
            return [
                new ChatOpsTreeItem(
                    '주간보고 생성하기', 
                    'Generate Weekly Report', 
                    vscode.TreeItemCollapsibleState.Expanded,
                    'weeklyReportGroup'
                )
            ];
        }

        if (element.contextValue === 'weeklyReportGroup') {
            // Weekly report sub-items
            return [
                new ChatOpsTreeItem(
                    '주간보고 생성하기', 
                    'Click to generate weekly report', 
                    vscode.TreeItemCollapsibleState.None,
                    'weeklyReportItem',
                    {
                        command: 'swdpChatOps.generateWeeklyReport',
                        title: 'Generate Weekly Report'
                    }
                ),
                new ChatOpsTreeItem(
                    '피드백 입력', 
                    'Provide feedback on the generated report', 
                    vscode.TreeItemCollapsibleState.None,
                    'feedbackItem',
                    {
                        command: 'swdpChatOps.provideFeedback',
                        title: 'Provide Feedback'
                    }
                ),
                new ChatOpsTreeItem(
                    '리포트 저장', 
                    'Save the current report to workspace', 
                    vscode.TreeItemCollapsibleState.None,
                    'saveItem',
                    {
                        command: 'swdpChatOps.saveReport',
                        title: 'Save Report'
                    }
                )
            ];
        }

        return [];
    }
}

class ChatOpsTreeItem extends vscode.TreeItem {
    constructor(label, tooltip, collapsibleState, contextValue, command = null) {
        super(label, collapsibleState);
        
        this.tooltip = tooltip;
        this.contextValue = contextValue;
        
        if (command) {
            this.command = command;
        }

        // Set icons based on context
        switch (contextValue) {
            case 'reports':
                this.iconPath = new vscode.ThemeIcon('folder');
                break;
            case 'weeklyReportGroup':
                this.iconPath = new vscode.ThemeIcon('file-text');
                break;
            case 'weeklyReportItem':
                this.iconPath = new vscode.ThemeIcon('play');
                break;
            case 'feedbackItem':
                this.iconPath = new vscode.ThemeIcon('comment');
                break;
            case 'saveItem':
                this.iconPath = new vscode.ThemeIcon('save');
                break;
            default:
                this.iconPath = new vscode.ThemeIcon('circle');
        }
    }
}

module.exports = {
    ChatOpsTreeProvider,
    ChatOpsTreeItem
};