const vscode = require('vscode');
const { ChatOpsTreeProvider } = require('./chatOpsTreeProvider');
const { ApiService } = require('./apiService');
const { GitUtils } = require('./gitUtils');
const path = require('path');
const fs = require('fs');

let currentReportContent = '';

/**
 * This method is called when your extension is activated
 */
function activate(context) {
    console.log('SWDP ChatOps Extension is now active!');

    try {
        // Initialize services
        const apiService = new ApiService();
        const gitUtils = new GitUtils();
        
        // Create tree data provider
        const treeDataProvider = new ChatOpsTreeProvider();
        console.log('Tree data provider created');
        
        // Register tree data provider explicitly
        const disposableProvider = vscode.window.registerTreeDataProvider('swdpChatOps', treeDataProvider);
        context.subscriptions.push(disposableProvider);
        console.log('Tree data provider registered');
        
        // Create tree view
        const treeView = vscode.window.createTreeView('swdpChatOps', {
            treeDataProvider: treeDataProvider,
            showCollapseAll: true,
            canSelectMany: false
        });
        context.subscriptions.push(treeView);
        console.log('Tree view created');

    // Register commands
    const commands = [
        // Refresh command
        vscode.commands.registerCommand('swdpChatOps.refresh', () => {
            treeDataProvider.refresh();
        }),

        // Process Weekly Report command
        vscode.commands.registerCommand('swdpChatOps.processWeeklyReport', async () => {
            try {
                await processWeeklyReport(apiService, gitUtils);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to process weekly report: ${error.message}`);
            }
        }),

        // Save Report command
        vscode.commands.registerCommand('swdpChatOps.saveReport', async () => {
            try {
                await saveReport();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to save report: ${error.message}`);
            }
        })
    ];

        // Add all commands to context subscriptions
        commands.forEach(command => {
            context.subscriptions.push(command);
        });
        
        console.log('All commands registered successfully');
        
    } catch (error) {
        console.error('Error activating extension:', error);
        vscode.window.showErrorMessage(`Failed to activate SWDP ChatOps Extension: ${error.message}`);
    }
}

/**
 * Process Weekly Report (Generate or Apply Feedback)
 */
async function processWeeklyReport(apiService, gitUtils) {
    try {
        // Get user ID from git
        const userId = await gitUtils.getUserId();
        if (!userId) {
            vscode.window.showErrorMessage('Unable to extract user ID from git configuration');
            return;
        }

        let response;
        
        if (currentReportContent) {
            // Ask if user wants to provide feedback or generate new report
            const action = await vscode.window.showQuickPick([
                { label: 'Generate New Report', description: 'Create a fresh weekly report' },
                { label: 'Provide Feedback', description: 'Modify the existing report' }
            ], {
                placeHolder: 'Choose an action'
            });

            if (!action) return;

            if (action.label === 'Provide Feedback') {
                const feedback = await vscode.window.showInputBox({
                    prompt: 'Enter your feedback for the weekly report',
                    placeHolder: 'e.g., Please add more details about the project timeline...',
                    ignoreFocusOut: true
                });

                if (!feedback) return;

                vscode.window.showInformationMessage('Processing feedback...');
                response = await apiService.processWeeklyReport(userId, feedback, currentReportContent);
            } else {
                vscode.window.showInformationMessage('Generating new weekly report...');
                currentReportContent = '';
                response = await apiService.processWeeklyReport(userId);
            }
        } else {
            vscode.window.showInformationMessage('Generating weekly report...');
            response = await apiService.processWeeklyReport(userId);
        }
        
        if (response.success) {
            currentReportContent = response.data;
            
            // Show the report in a new editor
            const doc = await vscode.workspace.openTextDocument({
                content: currentReportContent,
                language: 'markdown'
            });
            
            await vscode.window.showTextDocument(doc, {
                preview: false,
                viewColumn: vscode.ViewColumn.One
            });

            vscode.window.showInformationMessage('Weekly report processed successfully!');
        } else {
            vscode.window.showErrorMessage(`Failed to process report: ${response.errorMessage}`);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error processing weekly report: ${error.message}`);
    }
}

/**
 * Save Report to workspace
 */
async function saveReport() {
    if (!currentReportContent) {
        vscode.window.showWarningMessage('No report available to save. Please generate a report first.');
        return;
    }

    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        // Create directory if it doesn't exist
        const reportDir = path.join(workspaceFolder.uri.fsPath, 'swdp_chatops', 'weekly_report');
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        // Generate filename with current date
        const now = new Date();
        const dateString = now.toISOString().slice(2, 10).replace(/-/g, '');
        const filename = `weekly_report_${dateString}.md`;
        const filePath = path.join(reportDir, filename);

        // Write file
        fs.writeFileSync(filePath, currentReportContent, 'utf8');

        // Open the saved file
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc, {
            preview: false,
            viewColumn: vscode.ViewColumn.One
        });

        vscode.window.showInformationMessage(`Report saved as: ${filename}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to save report: ${error.message}`);
    }
}

/**
 * This method is called when your extension is deactivated
 */
function deactivate() {
    console.log('SWDP ChatOps Extension deactivated');
}

module.exports = {
    activate,
    deactivate
};