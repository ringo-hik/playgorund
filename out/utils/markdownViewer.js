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
exports.MarkdownViewer = void 0;
const vscode = __importStar(require("vscode"));
class MarkdownViewer {
    static panels = new Map();
    static async showBuildDetails(buildResult) {
        const panelKey = `build-${buildResult.id}`;
        // 기존 패널이 있으면 재사용
        let panel = this.panels.get(panelKey);
        if (panel) {
            panel.reveal();
            panel.webview.html = this.getBuildDetailsHtml(buildResult);
            return;
        }
        // 새 패널 생성
        panel = vscode.window.createWebviewPanel('buildDetails', `Build Details - ${buildResult.id}`, vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this.panels.set(panelKey, panel);
        // 패널이 닫힐 때 정리
        panel.onDidDispose(() => {
            this.panels.delete(panelKey);
        });
        // HTML 설정
        panel.webview.html = this.getBuildDetailsHtml(buildResult);
    }
    static getBuildDetailsHtml(buildResult) {
        const status = buildResult.status;
        const statusColor = this.getStatusColor(status.status);
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Build Details</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            .header {
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
                background-color: ${statusColor};
                color: white;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 150px 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }
            .info-label {
                font-weight: bold;
                color: var(--vscode-descriptionForeground);
            }
            .section {
                margin: 20px 0;
            }
            .section h2 {
                color: var(--vscode-textLink-foreground);
                border-bottom: 1px solid var(--vscode-textSeparator-foreground);
                padding-bottom: 5px;
            }
            .config-table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }
            .config-table th,
            .config-table td {
                border: 1px solid var(--vscode-panel-border);
                padding: 8px;
                text-align: left;
            }
            .config-table th {
                background-color: var(--vscode-editor-selectionBackground);
                font-weight: bold;
            }
            .logs {
                background-color: var(--vscode-terminal-background);
                color: var(--vscode-terminal-foreground);
                padding: 15px;
                border-radius: 4px;
                font-family: var(--vscode-editor-font-family);
                font-size: var(--vscode-editor-font-size);
                overflow-x: auto;
                white-space: pre-wrap;
                max-height: 400px;
                overflow-y: auto;
            }
            .progress-bar {
                width: 100%;
                height: 20px;
                background-color: var(--vscode-progressBar-background);
                border-radius: 10px;
                overflow: hidden;
                margin: 10px 0;
            }
            .progress-fill {
                height: 100%;
                background-color: var(--vscode-progressBar-foreground);
                border-radius: 10px;
                transition: width 0.3s ease;
                width: ${status.progress}%;
            }
            .artifacts {
                list-style: none;
                padding: 0;
            }
            .artifact-item {
                padding: 10px;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                margin-bottom: 10px;
                background-color: var(--vscode-editor-selectionBackground);
            }
            .artifact-name {
                font-weight: bold;
                color: var(--vscode-textLink-foreground);
                margin-bottom: 5px;
            }
            .artifact-details {
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 10px;
            }
            .artifact-download {
                margin-top: 5px;
            }
            .artifact-download a {
                color: var(--vscode-textLink-foreground);
                text-decoration: none;
                font-size: 12px;
            }
            .artifact-download a:hover {
                text-decoration: underline;
            }
            .test-suite {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                margin-bottom: 15px;
                overflow: hidden;
            }
            .test-suite-header {
                background-color: var(--vscode-editor-selectionBackground);
                padding: 10px;
                font-weight: bold;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            .test-suite-summary {
                padding: 10px;
                background-color: var(--vscode-editor-background);
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
            }
            .test-results {
                max-height: 200px;
                overflow-y: auto;
            }
            .test-item {
                padding: 8px 10px;
                border-bottom: 1px solid var(--vscode-panel-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .test-item:last-child {
                border-bottom: none;
            }
            .test-status {
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .test-passed {
                background-color: #28a745;
                color: white;
            }
            .test-failed {
                background-color: #dc3545;
                color: white;
            }
            .test-skipped {
                background-color: #ffc107;
                color: black;
            }
            .error-message {
                background-color: var(--vscode-inputValidation-errorBackground);
                color: var(--vscode-inputValidation-errorForeground);
                padding: 10px;
                border-radius: 4px;
                margin: 10px 0;
            }
            .build-time-info {
                background-color: var(--vscode-editor-selectionBackground);
                padding: 15px;
                border-radius: 4px;
                margin: 10px 0;
            }
            .build-time-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            }
            .build-time-item {
                text-align: center;
            }
            .build-time-label {
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                margin-bottom: 5px;
            }
            .build-time-value {
                font-size: 16px;
                font-weight: bold;
                color: var(--vscode-textLink-foreground);
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Build Details: ${buildResult.id}</h1>
            <span class="status-badge">${status.status}</span>
        </div>

        <div class="section">
            <h2>Build Information</h2>
            <div class="info-grid">
                <div class="info-label">Project:</div>
                <div>${buildResult.projectId}</div>
                
                <div class="info-label">Build Type:</div>
                <div>${buildResult.buildType === 'dev' ? 'Layer Build' : buildResult.buildType.toUpperCase()}</div>
                
                <div class="info-label">Branch:</div>
                <div>${buildResult.branch}</div>
                
                <div class="info-label">Commit:</div>
                <div>${buildResult.commitHash || 'N/A'}</div>
                
                <div class="info-label">Started:</div>
                <div>${status.startTime ? new Date(status.startTime).toLocaleString() : 'N/A'}</div>
                
                <div class="info-label">Completed:</div>
                <div>${status.endTime ? new Date(status.endTime).toLocaleString() : 'In Progress'}</div>
                
                <div class="info-label">Progress:</div>
                <div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    ${status.progress}%
                </div>
            </div>
        </div>

        ${status.duration ? `
        <div class="section">
            <h2>Build Performance</h2>
            <div class="build-time-info">
                <div class="build-time-grid">
                    <div class="build-time-item">
                        <div class="build-time-label">Total Build Time</div>
                        <div class="build-time-value">${status.duration}</div>
                    </div>
                    ${status.performanceMetrics ? `
                    <div class="build-time-item">
                        <div class="build-time-label">Compile Time</div>
                        <div class="build-time-value">${status.performanceMetrics.compileTime}</div>
                    </div>
                    <div class="build-time-item">
                        <div class="build-time-label">Test Time</div>
                        <div class="build-time-value">${status.performanceMetrics.testTime}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
        ` : ''}

        ${status.testSuites && status.testSuites.length > 0 ? `
        <div class="section">
            <h2>Test Results</h2>
            ${status.testSuites.map(suite => `
                <div class="test-suite">
                    <div class="test-suite-header">
                        ${suite.name}
                    </div>
                    <div class="test-suite-summary">
                        Total: ${suite.totalTests} | Passed: ${suite.passedTests} | Failed: ${suite.failedTests} | Skipped: ${suite.skippedTests} | Duration: ${suite.duration}
                    </div>
                    <div class="test-results">
                        ${suite.tests.map(test => `
                            <div class="test-item">
                                <span>${test.name}</span>
                                <div>
                                    <span class="test-status test-${test.status}">${test.status}</span>
                                    <span style="margin-left: 10px; font-size: 12px; color: var(--vscode-descriptionForeground);">${test.duration}</span>
                                </div>
                            </div>
                            ${test.errorMessage ? `
                                <div style="padding: 5px 10px; background-color: var(--vscode-inputValidation-errorBackground); color: var(--vscode-inputValidation-errorForeground); font-size: 12px;">
                                    ${test.errorMessage}
                                </div>
                            ` : ''}
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>Build Configuration</h2>
            <table class="config-table">
                <tr>
                    <th>Setting</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Compiler</td>
                    <td>${buildResult.config.compiler}</td>
                </tr>
                <tr>
                    <td>Target</td>
                    <td>${buildResult.config.target}</td>
                </tr>
                <tr>
                    <td>Test Suite</td>
                    <td>${buildResult.config.testSuite.join(', ')}</td>
                </tr>
                <tr>
                    <td>Static Analysis</td>
                    <td>${buildResult.config.staticAnalysis ? 'Enabled' : 'Disabled'}</td>
                </tr>
                <tr>
                    <td>Custom Defines</td>
                    <td>${buildResult.config.customDefines.join(', ') || 'None'}</td>
                </tr>
            </table>
        </div>

        ${status.errorMessage ? `
        <div class="section">
            <h2>Error Details</h2>
            <div class="error-message">
                ${status.errorMessage}
            </div>
        </div>
        ` : ''}

        ${status.artifacts && status.artifacts.length > 0 ? `
        <div class="section">
            <h2>Build Artifacts</h2>
            <div class="artifacts">
                ${status.artifacts.map(artifact => `
                    <div class="artifact-item">
                        <div class="artifact-name">${artifact.name || artifact}</div>
                        ${typeof artifact === 'object' ? `
                            <div class="artifact-details">
                                <div><strong>Size:</strong> ${artifact.size}</div>
                                <div><strong>Type:</strong> ${artifact.type}</div>
                                <div><strong>Created:</strong> ${new Date(artifact.createdAt).toLocaleString()}</div>
                            </div>
                            ${artifact.downloadUrl ? `
                                <div class="artifact-download">
                                    <a href="#" onclick="alert('Download: ${artifact.downloadUrl}')">Download</a>
                                    ${artifact.checksum ? ` | <span style="font-size: 10px;">Checksum: ${artifact.checksum.substring(0, 16)}...</span>` : ''}
                                </div>
                            ` : ''}
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>Build Logs</h2>
            <div class="logs">
${status.logs ? status.logs.map(log => `[${new Date(log.timestamp).toLocaleTimeString()}] [${log.level.toUpperCase()}] ${log.source ? `[${log.source}] ` : ''}${log.message}`).join('\n') : (status.rawLogs || ['No logs available']).join('\n')}
            </div>
        </div>

        <div class="section">
            <h2>Related Links</h2>
            <div class="info-grid">
                <div class="info-label">SWDP Build:</div>
                <div><a href="#" onclick="alert('Open SWDP build page')">View in SWDP</a></div>
                
                <div class="info-label">Repository:</div>
                <div><a href="#" onclick="alert('Open repository')">View Repository</a></div>
                
                <div class="info-label">Build History:</div>
                <div><a href="#" onclick="alert('Open build history')">View All Builds</a></div>
            </div>
        </div>

        <hr style="margin: 30px 0; border: 1px solid var(--vscode-panel-border);">
        <div style="text-align: center; color: var(--vscode-descriptionForeground); font-size: 12px;">
            Generated on ${new Date().toLocaleString()}
        </div>
    </body>
    </html>
    `;
    }
    static getStatusColor(status) {
        switch (status) {
            case 'pending': return '#ffa500';
            case 'running': return '#0078d4';
            case 'success': return '#28a745';
            case 'failed': return '#dc3545';
            default: return '#6c757d';
        }
    }
    // 도움말 표시
    static async showHelp() {
        const panel = vscode.window.createWebviewPanel('buildAgentHelp', 'Build Agent Help', vscode.ViewColumn.Two, { enableScripts: true });
        panel.webview.html = this.getHelpHtml();
    }
    static getHelpHtml() {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Build Agent Help</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            h1, h2 { color: var(--vscode-textLink-foreground); }
            .section { margin: 20px 0; }
            .step { margin: 10px 0; padding: 10px; background-color: var(--vscode-editor-selectionBackground); border-radius: 4px; }
            code { background-color: var(--vscode-textCodeBlock-background); padding: 2px 4px; border-radius: 2px; }
        </style>
    </head>
    <body>
        <h1>Build Agent Help</h1>
        
        <div class="section">
            <h2>Getting Started</h2>
            <div class="step">
                <strong>Step 1:</strong> Click "Select Project" to choose a project from SWDP
            </div>
            <div class="step">
                <strong>Step 2:</strong> Configure build settings for each build type (Dev/Rel/Commit)
            </div>
            <div class="step">
                <strong>Step 3:</strong> Click "Start Build" to begin the build process
            </div>
            <div class="step">
                <strong>Step 4:</strong> Monitor build progress and view detailed results
            </div>
        </div>

        <div class="section">
            <h2>Features</h2>
            <ul>
                <li><strong>Project Selection:</strong> Search and select projects from SWDP</li>
                <li><strong>Build Configuration:</strong> Customize compiler, target, and test settings</li>
                <li><strong>Multiple Build Types:</strong> Dev, Release, and Commit builds</li>
                <li><strong>Real-time Status:</strong> Monitor build progress and status</li>
                <li><strong>Detailed Results:</strong> View comprehensive build reports</li>
                <li><strong>PUMBA Integration:</strong> Remote build support for local development</li>
            </ul>
        </div>

        <div class="section">
            <h2>Commands</h2>
            <ul>
                <li><code>buildAgent.selectProject</code> - Select a project</li>
                <li><code>buildAgent.devBuild</code> - Start development build</li>
                <li><code>buildAgent.relBuild</code> - Start release build</li>
                <li><code>buildAgent.commitBuild</code> - Start commit build</li>
                <li><code>buildAgent.pumbaBuild</code> - Start PUMBA remote build</li>
            </ul>
        </div>
    </body>
    </html>
    `;
    }
}
exports.MarkdownViewer = MarkdownViewer;
//# sourceMappingURL=markdownViewer.js.map