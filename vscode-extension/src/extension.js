const vscode = require('vscode');
const { ChatOpsTreeProvider } = require('./chatOpsTreeProvider');
const { ApiService } = require('./apiService');
const { GitUtils } = require('./gitUtils');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

let currentReportContent = '';

// Rotating loading messages
const loadingMessages = [
    'GPT\uc5d0\uac8c \ubb3c\uc5b4\ubcf4\ub294 \uc911...',
    'GEMINI\uc5d0\uac8c \ubb3c\uc5b4\ubcf4\ub294 \uc911...',
    'CLAUDE\uac00 \ub300\ud544 \uc911...',
    '\ub370\uc774\ud130\ub97c \ubd84\uc11d \uc911...',
    '\ubcf4\uace0\uc11c\ub97c \uc791\uc131 \uc911...',
    'AI\uac00 \uc5f4\uc2ec\ud788 \uc77c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4...'
];

/**
 * This method is called when your extension is activated
 */
async function activate(context) {
    logger.log('SWDP ChatOps Extension is now active!');
    console.log('SWDP ChatOps Extension is now active!');
    
    try {
        // Initialize services
        const apiService = new ApiService();
        const gitUtils = new GitUtils();
        
        // Auto-check authentication on startup
        await autoCheckAuth(apiService);
        
        // Create tree data provider
        const treeDataProvider = new ChatOpsTreeProvider();
        logger.log('Tree data provider created');
        
        // Register tree data provider explicitly
        const disposableProvider = vscode.window.registerTreeDataProvider('swdpChatOps', treeDataProvider);
        context.subscriptions.push(disposableProvider);
        logger.log('Tree data provider registered');
        
        // Create tree view
        const treeView = vscode.window.createTreeView('swdpChatOps', {
            treeDataProvider: treeDataProvider,
            showCollapseAll: true,
            canSelectMany: false
        });
        context.subscriptions.push(treeView);
        logger.log('Tree view created');

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
        }),


        // Open Settings command
        vscode.commands.registerCommand('swdpChatOps.openSettings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'swdpChatOps');
        })
    ];

        // Add all commands to context subscriptions
        commands.forEach(command => {
            context.subscriptions.push(command);
        });
        
        logger.log('All commands registered successfully');
        console.log('All commands registered successfully');
        
        logger.log(`Registered ${commands.length} commands successfully`);
        
    } catch (error) {
        logger.error('Error activating extension:', error);
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

        // Check for recent MD files
        const recentMdFile = await findRecentMdFile();
        let response;
        
        if (recentMdFile) {
            // Show feedback input for recent MD file
            const feedback = await vscode.window.showInputBox({
                prompt: `오늘자 보고서가 있습니다 (${recentMdFile.name}). 피드백을 입력하세요`,
                placeHolder: '예: 프로젝트 타임라인에 더 많은 세부사항을 추가해주세요...',
                ignoreFocusOut: true
            });

            if (!feedback) return;

            // Show rotating loading messages
            const progressBar = showRotatingProgress();
            try {
                response = await apiService.processWeeklyReport(userId, feedback, recentMdFile.content);
            } finally {
                progressBar.dispose();
            }
        } else {
            // Generate fresh weekly report automatically
            const progressBar = showRotatingProgress();
            try {
                response = await apiService.processWeeklyReport(userId);
            } finally {
                progressBar.dispose();
            }
        }
        
        if (response.success) {
            currentReportContent = response.data;
            
            // Automatically save the report
            try {
                await saveReport();
                vscode.window.showInformationMessage('주간 보고서가 성공적으로 처리되고 저장되었습니다!');
            } catch (saveError) {
                vscode.window.showErrorMessage(`보고서는 생성되었지만 저장에 실패했습니다: ${saveError.message}`);
            }
        } else {
            vscode.window.showErrorMessage(`보고서 처리 실패: ${response.errorMessage}`);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`주간 보고서 처리 중 오류: ${error.message}`);
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

        // Generate filename with current date and time
        const now = new Date();
        const dateString = now.toISOString().slice(2, 10).replace(/-/g, '');
        const timeString = now.toISOString().slice(11, 16).replace(/:/g, '');
        const filename = `weekly_report_${dateString}_${timeString}.md`;
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
 * Auto Check Authentication (Silent)
 */
async function autoCheckAuth(apiService) {
    try {
        let token = vscode.workspace.getConfiguration('swdpChatOps').get('authToken');
        if (!token) {
            logger.log('No auth token found, skipping auto-check');
            return;
        }

        const response = await apiService.checkAuth(token);
        if (response.success) {
            logger.log('Authentication successful');
        } else {
            logger.error('Authentication failed:', response.errorMessage);
        }
    } catch (error) {
        logger.error('Error in auto-check authentication:', error);
    }
}

/**
 * Check Authentication (Interactive)
 */
async function checkAuth(apiService) {
    try {
        let token = vscode.workspace.getConfiguration('swdpChatOps').get('authToken');
        if (!token) {
            token = await vscode.window.showInputBox({
                prompt: 'Enter your authentication token',
                placeHolder: 'Paste your token here',
                ignoreFocusOut: true
            });

            if (token) {
                await vscode.workspace.getConfiguration('swdpChatOps').update('authToken', token, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('Authentication token saved.');
            } else {
                vscode.window.showWarningMessage('Authentication token is required.');
                return;
            }
        }

        vscode.window.showInformationMessage('Checking authentication token...');
        const response = await apiService.checkAuth(token);

        if (response.success) {
            vscode.window.showInformationMessage('Authentication successful!');
        } else {
            const retry = await vscode.window.showErrorMessage(
                `Authentication failed: ${response.errorMessage}`,
                'Retry with New Token',
                'Cancel'
            );
            
            if (retry === 'Retry with New Token') {
                // Clear current token and retry
                await vscode.workspace.getConfiguration('swdpChatOps').update('authToken', '', vscode.ConfigurationTarget.Global);
                await checkAuth(apiService);
            }
        }
    } catch (error) {
        logger.error('Error checking authentication:', error);
        vscode.window.showErrorMessage(`Error checking authentication: ${error.message}`);
    }
}

/**
 * Show rotating progress messages
 */
function showRotatingProgress() {
    let messageIndex = 0;
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = loadingMessages[messageIndex];
    statusBarItem.show();

    const interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        statusBarItem.text = loadingMessages[messageIndex];
    }, 2000);

    return {
        dispose: () => {
            clearInterval(interval);
            statusBarItem.dispose();
        }
    };
}

/**
 * Find recent MD file from today
 */
async function findRecentMdFile() {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return null;
        }

        const reportDir = path.join(workspaceFolder.uri.fsPath, 'swdp_chatops', 'weekly_report');
        if (!fs.existsSync(reportDir)) {
            return null;
        }

        const today = new Date();
        const todayString = today.toISOString().slice(2, 10).replace(/-/g, '');
        
        const files = fs.readdirSync(reportDir)
            .filter(file => file.endsWith('.md') && file.includes(todayString))
            .sort((a, b) => {
                const statA = fs.statSync(path.join(reportDir, a));
                const statB = fs.statSync(path.join(reportDir, b));
                return statB.mtime.getTime() - statA.mtime.getTime();
            });

        if (files.length > 0) {
            const latestFile = files[0];
            const filePath = path.join(reportDir, latestFile);
            const content = fs.readFileSync(filePath, 'utf8');
            return {
                name: latestFile,
                path: filePath,
                content: content
            };
        }

        return null;
    } catch (error) {
        logger.error('Error finding recent MD file:', error);
        return null;
    }
}

/**
 * This method is called when your extension is deactivated
 */
function deactivate() {
    logger.log('SWDP ChatOps Extension deactivated');
}

module.exports = {
    activate,
    deactivate
};