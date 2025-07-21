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
        try {
            console.log('getChildren called with element:', element ? element.contextValue : 'root');
            
            if (!element) {
                // Root level - return Reports directly
                const rootItems = [
                    new ChatOpsTreeItem(
                        'Reports', 
                        'Report Management', 
                        vscode.TreeItemCollapsibleState.Expanded,
                        'reports'
                    )
                ];
                console.log('Returning root items:', rootItems.length);
                return Promise.resolve(rootItems);
            }

            if (element.contextValue === 'reports') {
                // Reports category level
                const reportItems = [
                    new ChatOpsTreeItem(
                        '주간보고 생성하기', 
                        'Generate Weekly Report', 
                        vscode.TreeItemCollapsibleState.Expanded,
                        'weeklyReportGroup'
                    )
                ];
                console.log('Returning report items:', reportItems.length);
                return Promise.resolve(reportItems);
            }

            if (element.contextValue === 'weeklyReportGroup') {
                // Weekly report sub-items
                const subItems = [
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
                console.log('Returning sub items:', subItems.length);
                return Promise.resolve(subItems);
            }

            console.log('No matching context, returning empty array');
            return Promise.resolve([]);
            
        } catch (error) {
            console.error('Error in getChildren:', error);
            return Promise.resolve([]);
        }
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