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

    // Initialize services
    const apiService = new ApiService();
    const gitUtils = new GitUtils();
    
    // Create and register tree data provider
    const treeDataProvider = new ChatOpsTreeProvider();
    
    // Register tree view with data provider
    const treeView = vscode.window.createTreeView('swdpChatOps', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: true,
        canSelectMany: false
    });

    // Register commands
    const commands = [
        // Refresh command
        vscode.commands.registerCommand('swdpChatOps.refresh', () => {
            treeDataProvider.refresh();
        }),

        // Generate Weekly Report command
        vscode.commands.registerCommand('swdpChatOps.generateWeeklyReport', async () => {
            try {
                await generateWeeklyReport(apiService, gitUtils);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to generate weekly report: ${error.message}`);
            }
        }),

        // Provide Feedback command
        vscode.commands.registerCommand('swdpChatOps.provideFeedback', async () => {
            try {
                await provideFeedback(apiService, gitUtils);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to provide feedback: ${error.message}`);
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

    // Add tree view to context subscriptions
    context.subscriptions.push(treeView);
}

/**
 * Generate Weekly Report
 */
async function generateWeeklyReport(apiService, gitUtils) {
    vscode.window.showInformationMessage('Generating weekly report...');
    
    try {
        // Get user ID from git
        const userId = await gitUtils.getUserId();
        if (!userId) {
            vscode.window.showErrorMessage('Unable to extract user ID from git configuration');
            return;
        }

        // Call API to generate weekly report
        const response = await apiService.generateWeeklyReport('weekly_report', userId);
        
        if (response.success) {
            currentReportContent = response.data;
            
            // Show the report in a new editor
            const doc = await vscode.workspace.openTextDocument({
                content: currentReportContent,
                language: 'markdown'
            });
            
            const editor = await vscode.window.showTextDocument(doc, {
                preview: false,
                viewColumn: vscode.ViewColumn.One
            });

            vscode.window.showInformationMessage('Weekly report generated successfully!');
        } else {
            vscode.window.showErrorMessage(`Failed to generate report: ${response.errorMessage}`);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating weekly report: ${error.message}`);
    }
}

/**
 * Provide Feedback on current report
 */
async function provideFeedback(apiService, gitUtils) {
    if (!currentReportContent) {
        vscode.window.showWarningMessage('No report available. Please generate a report first.');
        return;
    }

    const feedback = await vscode.window.showInputBox({
        prompt: 'Enter your feedback for the weekly report',
        placeHolder: 'e.g., Please add more details about the project timeline...',
        ignoreFocusOut: true
    });

    if (!feedback) {
        return;
    }

    vscode.window.showInformationMessage('Processing feedback...');

    try {
        // Get user ID from git
        const userId = await gitUtils.getUserId();
        if (!userId) {
            vscode.window.showErrorMessage('Unable to extract user ID from git configuration');
            return;
        }

        // Send feedback with current report content as input
        const response = await apiService.provideFeedback('weekly_report', userId, feedback, currentReportContent);
        
        if (response.success) {
            currentReportContent = response.data;
            
            // Show the updated report
            const doc = await vscode.workspace.openTextDocument({
                content: currentReportContent,
                language: 'markdown'
            });
            
            await vscode.window.showTextDocument(doc, {
                preview: false,
                viewColumn: vscode.ViewColumn.One
            });

            vscode.window.showInformationMessage('Report updated based on your feedback!');
        } else {
            vscode.window.showErrorMessage(`Failed to process feedback: ${response.errorMessage}`);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error processing feedback: ${error.message}`);
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