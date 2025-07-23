/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vscode = __webpack_require__(1);
const { ChatOpsTreeProvider } = __webpack_require__(2);
const { ApiService } = __webpack_require__(4);
const { GitUtils } = __webpack_require__(7);
const path = __webpack_require__(9);
const fs = __webpack_require__(10);
const logger = __webpack_require__(3);

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

/***/ }),
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vscode = __webpack_require__(1);
const logger = __webpack_require__(3);

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
            logger.log('getChildren called with element:', element ? element.contextValue : 'root');
            
            if (!element) {
                // Root level - return items directly with reduced hierarchy
                const rootItems = [
                    new ChatOpsTreeItem(
                        'Process Weekly Report', 
                        'Generate new report or apply feedback', 
                        vscode.TreeItemCollapsibleState.None,
                        'weeklyReportItem',
                        {
                            command: 'swdpChatOps.processWeeklyReport',
                            title: 'Process Weekly Report'
                        }
                    )
                ];
                logger.log('Returning root items:', rootItems.length);
                return Promise.resolve(rootItems);
            }

            logger.log('No matching context, returning empty array');
            return Promise.resolve([]);
            
        } catch (error) {
            logger.error('Error in getChildren:', error);
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
            case 'weeklyReportItem':
                this.iconPath = new vscode.ThemeIcon('play');
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

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vscode = __webpack_require__(1);

class Logger {
    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('SWDP ChatOps');
    }

    log(message) {
        this.outputChannel.appendLine(`[INFO] ${message}`);
    }

    error(message, error) {
        this.outputChannel.appendLine(`[ERROR] ${message}`);
        if (error) {
            this.outputChannel.appendLine(error.stack || error.toString());
        }
    }

    show() {
        this.outputChannel.show();
    }
}

module.exports = new Logger();

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const https = __webpack_require__(5);
const http = __webpack_require__(6);
const logger = __webpack_require__(3);

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:443/devportal';
        this.timeout = 30000;
    }

    async httpRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const isHttps = parsedUrl.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const requestOptions = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (isHttps ? 443 : 80),
                path: parsedUrl.pathname + parsedUrl.search,
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SWDP-ChatOps-Extension/1.0.0',
                    ...options.headers
                },
                timeout: this.timeout
            };

            const req = client.request(requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = {
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            data: data ? JSON.parse(data) : null
                        };
                        resolve(result);
                    } catch (error) {
                        resolve({
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            data: data
                        });
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (options.data) {
                req.write(JSON.stringify(options.data));
            }

            req.end();
        });
    }


    /**
     * Process Weekly Report Request (Generate or Apply Feedback)
     * @param {string} userId - User ID extracted from git email
     * @param {string} [feedback] - User feedback text (optional)
     * @param {string} [currentReport] - Current report content to be modified (optional)
     * @returns {Promise<Object>} API response
     */
    async processWeeklyReport(userId, feedback = null, currentReport = null) {
        try {
            let userQuery;
            
            if (feedback && currentReport) {
                userQuery = `<<DOCUMENT_START>>\n${currentReport}\n<<DOCUMENT_END>>\n\nREVISION_REQUEST: ${feedback}\n\nPlease revise the above document based on the revision request.`;
            } else {
                userQuery = "Generate a comprehensive weekly report based on the data from the last 8 days starting from today.";
            }
            
            const response = await this.httpRequest(`${this.baseURL}/api/v1/extension/weekly-report`, {
                method: 'POST',
                data: {
                    userId: userId,
                    userQuery: userQuery,
                    persona: 'weekly_report',
                    category: 'Extension'
                }
            });
            
            const operation = feedback ? 'feedback processing' : 'report generation';
            return {
                success: response.status === 200,
                data: response.data,
                message: `Weekly report ${operation} completed successfully`
            };

        } catch (error) {
            return this.handleError('processWeeklyReport', error);
        }
    }


    /**
     * Check authentication token
     * @param {string} token - Authentication token
     * @returns {Promise<Object>} API response
     */
    async checkAuth(token) {
        try {
            const response = await this.httpRequest(`${this.baseURL}/devportal/rest/api/auth/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return {
                success: response.status === 200 && response.data?.authenticated === true,
                data: response.data,
                message: 'Token verification successful'
            };

        } catch (error) {
            return this.handleError('checkAuth', error);
        }
    }

    /**
     * Handle API errors consistently
     * @param {string} operation - Operation name for logging
     * @param {Error} error - Error object
     * @returns {Object} Standardized error response
     */
    handleError(operation, error) {
        logger.error(`API Error in ${operation}:`, error);

        let errorMessage = 'Unknown error occurred';
        let errorDetails = {};

        if (error.status) {
            // Server responded with error status
            errorMessage = this.getStatusMessage(error.status);
            errorDetails = {
                status: error.status,
                statusText: error.statusText,
                data: error.data
            };
        } else if (error.message) {
            // Network error or other error
            errorMessage = error.message;
            errorDetails = {
                message: error.message
            };
        } else {
            // Fallback
            errorMessage = 'Request failed';
            errorDetails = {
                error: error.toString()
            };
        }

        return {
            success: false,
            errorMessage: errorMessage,
            errorDetails: errorDetails,
            operation: operation
        };
    }

    /**
     * Get user-friendly status messages
     * @param {number} status - HTTP status code
     * @returns {string} User-friendly message
     */
    getStatusMessage(status) {
        const statusMessages = {
            400: 'Invalid request format',
            401: 'Authentication required',
            403: 'Access denied',
            404: 'Service not found',
            408: 'Request timeout',
            429: 'Too many requests',
            500: 'Internal server error',
            502: 'Gateway error',
            503: 'Service unavailable',
            504: 'Gateway timeout'
        };

        return statusMessages[status] || `HTTP error ${status}`;
    }

}

module.exports = {
    ApiService
};

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vscode = __webpack_require__(1);
const { exec } = __webpack_require__(8);
const path = __webpack_require__(9);
const logger = __webpack_require__(3);

class GitUtils {
    constructor() {
        this.workspaceRoot = null;
        this.initializeWorkspace();
    }

    initializeWorkspace() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            this.workspaceRoot = workspaceFolders[0].uri.fsPath;
        }
    }

    /**
     * Extract userId from git email configuration
     * Returns the part before @ in the email address
     */
    async getUserId() {
        try {
            if (!this.workspaceRoot) {
                throw new Error('No workspace folder found');
            }

            // First, try to get email from git config in the current repository
            const email = await this.getGitEmail();
            
            if (!email) {
                throw new Error('No git email found');
            }

            // Extract userId from email (part before @)
            const userId = email.split('@')[0];
            
            if (!userId) {
                throw new Error('Invalid email format');
            }

            logger.log(`Extracted userId: ${userId} from email: ${email}`);
            return userId;

        } catch (error) {
            logger.error('Error extracting userId from git:', error);
            throw error;
        }
    }

    /**
     * Get git email from configuration
     */
    async getGitEmail() {
        try {
            // Try local git config first
            const localEmail = await this.executeGitCommand('config user.email');
            if (localEmail) {
                return localEmail.trim();
            }

            // Fallback to global git config
            const globalEmail = await this.executeGitCommand('config --global user.email');
            if (globalEmail) {
                return globalEmail.trim();
            }

            // Last resort: read from .git/config file directly
            const configEmail = await this.readGitConfigEmail();
            if (configEmail) {
                return configEmail.trim();
            }

            throw new Error('No git email configuration found');

        } catch (error) {
            logger.error('Error getting git email:', error);
            throw error;
        }
    }

    /**
     * Execute git command in the workspace directory
     */
    async executeGitCommand(command) {
        return new Promise((resolve, reject) => {
            const fullCommand = `git ${command}`;
            const options = {
                cwd: this.workspaceRoot,
                timeout: 5000
            };

            exec(fullCommand, options, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`Git command error: ${error}`);
                    resolve(null); // Don't reject, just return null to try other methods
                    return;
                }

                if (stderr && stderr.trim()) {
                    logger.log(`Git command warning: ${stderr}`);
                }

                resolve(stdout ? stdout.toString() : null);
            });
        });
    }

    /**
     * Read email directly from .git/config file
     */
    async readGitConfigEmail() {
        try {
            if (!this.workspaceRoot) {
                return null;
            }

            const gitConfigPath = path.join(this.workspaceRoot, '.git', 'config');
            
            if (!fs.existsSync(gitConfigPath)) {
                return null;
            }

            const configContent = fs.readFileSync(gitConfigPath, 'utf8');
            
            // Parse the config file to find email
            const lines = configContent.split('\n');
            let inUserSection = false;
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                
                if (trimmedLine === '[user]') {
                    inUserSection = true;
                    continue;
                }
                
                if (trimmedLine.startsWith('[') && trimmedLine !== '[user]') {
                    inUserSection = false;
                    continue;
                }
                
                if (inUserSection && trimmedLine.startsWith('email = ')) {
                    return trimmedLine.substring(8); // Remove 'email = ' prefix
                }
            }

            return null;

        } catch (error) {
            logger.error('Error reading git config file:', error);
            return null;
        }
    }

    /**
     * Get git user name for additional context
     */
    async getUserName() {
        try {
            const localName = await this.executeGitCommand('config user.name');
            if (localName) {
                return localName.trim();
            }

            const globalName = await this.executeGitCommand('config --global user.name');
            if (globalName) {
                return globalName.trim();
            }

            return 'Unknown User';

        } catch (error) {
            logger.error('Error getting git user name:', error);
            return 'Unknown User';
        }
    }

    /**
     * Get current branch name
     */
    async getCurrentBranch() {
        try {
            const branch = await this.executeGitCommand('branch --show-current');
            return branch ? branch.trim() : 'main';
        } catch (error) {
            logger.error('Error getting current branch:', error);
            return 'main';
        }
    }

    /**
     * Check if current directory is a git repository
     */
    async isGitRepository() {
        try {
            const result = await this.executeGitCommand('rev-parse --is-inside-work-tree');
            return result && result.trim() === 'true';
        } catch (error) {
            return false;
        }
    }

    /**
     * Get repository information for context
     */
    async getRepositoryInfo() {
        try {
            const isRepo = await this.isGitRepository();
            if (!isRepo) {
                return null;
            }

            const userId = await this.getUserId();
            const userName = await this.getUserName();
            const branch = await this.getCurrentBranch();
            const email = await this.getGitEmail();

            return {
                userId,
                userName,
                branch,
                email,
                workspaceRoot: this.workspaceRoot
            };

        } catch (error) {
            logger.error('Error getting repository info:', error);
            return null;
        }
    }
}

module.exports = {
    GitUtils
};

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map