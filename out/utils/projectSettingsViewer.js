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
exports.ProjectSettingsViewer = void 0;
const vscode = __importStar(require("vscode"));
const projectManager_1 = require("../services/projectManager");
class ProjectSettingsViewer {
    static panels = new Map();
    static async showProjectSettingsInfo(project) {
        const panelKey = `project-settings-${project.id}`;
        // 기존 패널이 있으면 재사용
        let panel = this.panels.get(panelKey);
        if (panel) {
            panel.reveal();
            panel.webview.html = this.getProjectSettingsHtml(project);
            return;
        }
        // 새 패널 생성
        panel = vscode.window.createWebviewPanel('projectSettings', `Project Settings - ${project.name}`, vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this.panels.set(panelKey, panel);
        // 패널이 닫힐 때 정리
        panel.onDidDispose(() => {
            this.panels.delete(panelKey);
        });
        // 웹뷰 메시지 처리
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'updateSetting':
                    await this.updateProjectSetting(project, message.key, message.value);
                    panel.webview.html = this.getProjectSettingsHtml(project);
                    break;
                case 'saveBuildConfig':
                    await this.saveBuildConfig(project, message.buildType, message.config);
                    panel.webview.html = this.getProjectSettingsHtml(project);
                    vscode.window.showInformationMessage('Build configuration saved successfully');
                    break;
            }
        }, undefined);
        // HTML 설정
        panel.webview.html = this.getProjectSettingsHtml(project);
    }
    static getProjectSettingsHtml(project) {
        const projectManager = projectManager_1.ProjectManager.getInstance();
        const settings = projectManager.getProjectSettings();
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Settings</title>
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
            .section {
                margin: 20px 0;
                padding: 15px;
                background-color: var(--vscode-editor-selectionBackground);
                border-radius: 4px;
            }
            .section h2 {
                color: var(--vscode-textLink-foreground);
                margin-top: 0;
                border-bottom: 1px solid var(--vscode-textSeparator-foreground);
                padding-bottom: 5px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 150px 1fr 100px;
                gap: 10px;
                margin-bottom: 10px;
                align-items: center;
            }
            .info-label {
                font-weight: bold;
                color: var(--vscode-descriptionForeground);
            }
            .info-value {
                font-family: var(--vscode-editor-font-family);
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-input-border);
                padding: 5px 8px;
                border-radius: 2px;
            }
            .edit-button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 5px 10px;
                border-radius: 2px;
                cursor: pointer;
                font-size: 12px;
            }
            .edit-button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .build-config {
                margin: 15px 0;
                padding: 15px;
                background-color: var(--vscode-terminal-background);
                border-radius: 4px;
            }
            .build-config h3 {
                color: var(--vscode-textLink-foreground);
                margin-top: 0;
            }
            .config-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 8px 0;
            }
            .config-label {
                font-weight: bold;
                min-width: 120px;
            }
            .config-value {
                flex: 1;
                margin: 0 10px;
                font-family: var(--vscode-editor-font-family);
            }
            .save-button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 2px;
                cursor: pointer;
                margin-top: 10px;
            }
            .save-button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .test-checkboxes {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            .test-checkbox {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            input[type="checkbox"] {
                margin-right: 5px;
            }
            input[type="text"], input[type="number"] {
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                padding: 5px;
                border-radius: 2px;
            }
            .commit-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Project Settings - ${project.name}</h1>
            <p>Configure project settings and build configurations</p>
        </div>

        <div class="section">
            <h2>Project Information</h2>
            <div class="info-grid">
                <div class="info-label">Project ID:</div>
                <div class="info-value">${project.id}</div>
                <div></div>
                
                <div class="info-label">Repository:</div>
                <div class="info-value">${project.repository}</div>
                <button class="edit-button" onclick="editSetting('repository')">Edit</button>
                
                <div class="info-label">Default Branch:</div>
                <div class="info-value">${project.defaultBranch}</div>
                <button class="edit-button" onclick="editSetting('defaultBranch')">Edit</button>
                
                <div class="info-label">Description:</div>
                <div class="info-value">${project.description || 'No description'}</div>
                <button class="edit-button" onclick="editSetting('description')">Edit</button>
            </div>
        </div>

        <div class="section">
            <h2>Build Configurations</h2>
            
            <div class="build-config">
                <h3>Layer Build (Dev)</h3>
                <div class="config-item">
                    <span class="config-label">Compiler:</span>
                    <input type="text" class="config-value" id="dev-compiler" value="${settings?.buildConfigs.dev.compiler || 'gcc10'}" />
                </div>
                <div class="config-item">
                    <span class="config-label">Target:</span>
                    <select class="config-value" id="dev-target">
                        <option value="debug" ${settings?.buildConfigs.dev.target === 'debug' ? 'selected' : ''}>Debug</option>
                        <option value="release" ${settings?.buildConfigs.dev.target === 'release' ? 'selected' : ''}>Release</option>
                        <option value="profile" ${settings?.buildConfigs.dev.target === 'profile' ? 'selected' : ''}>Profile</option>
                    </select>
                </div>
                <div class="config-item">
                    <span class="config-label">Tests:</span>
                    <div class="test-checkboxes">
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.dev.testSuite.includes('unit') ? 'checked' : ''} data-test="unit" /> Unit
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.dev.testSuite.includes('integration') ? 'checked' : ''} data-test="integration" /> Integration
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.dev.testSuite.includes('simulation') ? 'checked' : ''} data-test="simulation" /> Simulation
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.dev.testSuite.includes('performance') ? 'checked' : ''} data-test="performance" /> Performance
                        </label>
                    </div>
                </div>
                <div class="config-item">
                    <span class="config-label">Static Analysis:</span>
                    <input type="checkbox" ${settings?.buildConfigs.dev.staticAnalysis ? 'checked' : ''} id="dev-static" />
                </div>
                <button class="save-button" onclick="saveBuildConfig('dev')">Save Layer Build Config</button>
            </div>

            <div class="build-config">
                <h3>Release Build</h3>
                <div class="config-item">
                    <span class="config-label">Compiler:</span>
                    <input type="text" class="config-value" id="rel-compiler" value="${settings?.buildConfigs.rel.compiler || 'gcc10'}" />
                </div>
                <div class="config-item">
                    <span class="config-label">Target:</span>
                    <select class="config-value" id="rel-target">
                        <option value="debug" ${settings?.buildConfigs.rel.target === 'debug' ? 'selected' : ''}>Debug</option>
                        <option value="release" ${settings?.buildConfigs.rel.target === 'release' ? 'selected' : ''}>Release</option>
                        <option value="profile" ${settings?.buildConfigs.rel.target === 'profile' ? 'selected' : ''}>Profile</option>
                    </select>
                </div>
                <div class="config-item">
                    <span class="config-label">Tests:</span>
                    <div class="test-checkboxes">
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.rel.testSuite.includes('unit') ? 'checked' : ''} data-test="unit" /> Unit
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.rel.testSuite.includes('integration') ? 'checked' : ''} data-test="integration" /> Integration
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.rel.testSuite.includes('simulation') ? 'checked' : ''} data-test="simulation" /> Simulation
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.rel.testSuite.includes('performance') ? 'checked' : ''} data-test="performance" /> Performance
                        </label>
                    </div>
                </div>
                <div class="config-item">
                    <span class="config-label">Static Analysis:</span>
                    <input type="checkbox" ${settings?.buildConfigs.rel.staticAnalysis ? 'checked' : ''} id="rel-static" />
                </div>
                <button class="save-button" onclick="saveBuildConfig('rel')">Save Release Build Config</button>
            </div>

            <div class="build-config">
                <h3>Commit Build</h3>
                <div class="config-item">
                    <span class="config-label">Compiler:</span>
                    <input type="text" class="config-value" id="commit-compiler" value="${settings?.buildConfigs.commit.compiler || 'gcc10'}" />
                </div>
                <div class="config-item">
                    <span class="config-label">Target:</span>
                    <select class="config-value" id="commit-target">
                        <option value="debug" ${settings?.buildConfigs.commit.target === 'debug' ? 'selected' : ''}>Debug</option>
                        <option value="release" ${settings?.buildConfigs.commit.target === 'release' ? 'selected' : ''}>Release</option>
                        <option value="profile" ${settings?.buildConfigs.commit.target === 'profile' ? 'selected' : ''}>Profile</option>
                    </select>
                </div>
                <div class="config-item">
                    <span class="config-label">Tests:</span>
                    <div class="test-checkboxes">
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.commit.testSuite.includes('unit') ? 'checked' : ''} data-test="unit" /> Unit
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.commit.testSuite.includes('integration') ? 'checked' : ''} data-test="integration" /> Integration
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.commit.testSuite.includes('simulation') ? 'checked' : ''} data-test="simulation" /> Simulation
                        </label>
                        <label class="test-checkbox">
                            <input type="checkbox" ${settings?.buildConfigs.commit.testSuite.includes('performance') ? 'checked' : ''} data-test="performance" /> Performance
                        </label>
                    </div>
                </div>
                <div class="config-item">
                    <span class="config-label">Static Analysis:</span>
                    <input type="checkbox" ${settings?.buildConfigs.commit.staticAnalysis ? 'checked' : ''} id="commit-static" />
                </div>
                <button class="save-button" onclick="saveBuildConfig('commit')">Save Commit Build Config</button>
            </div>
        </div>

        <div class="section">
            <h2>Advanced Settings</h2>
            <div class="info-grid">
                <div class="info-label">Parallel Jobs:</div>
                <input type="number" class="info-value" id="parallel-jobs" value="${settings?.customOptions.parallelJobs || 4}" min="1" max="16" />
                <div></div>
                
                <div class="info-label">Timeout (seconds):</div>
                <input type="number" class="info-value" id="timeout" value="${settings?.customOptions.timeout || 1800}" min="300" max="7200" />
                <div></div>
                
                <div class="info-label">Notifications:</div>
                <input type="checkbox" ${settings?.customOptions.notifications ? 'checked' : ''} id="notifications" />
                <div></div>
            </div>
            <button class="save-button" onclick="saveAdvancedSettings()">Save Advanced Settings</button>
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            function editSetting(key) {
                const newValue = prompt(\`Enter new value for \${key}:\`);
                if (newValue !== null) {
                    vscode.postMessage({
                        command: 'updateSetting',
                        key: key,
                        value: newValue
                    });
                }
            }

            function saveBuildConfig(buildType) {
                const compiler = document.getElementById(\`\${buildType}-compiler\`).value;
                const target = document.getElementById(\`\${buildType}-target\`).value;
                const staticAnalysis = document.getElementById(\`\${buildType}-static\`).checked;
                
                const testSuite = [];
                const checkboxes = document.querySelectorAll(\`[data-test]\`);
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        testSuite.push(checkbox.dataset.test);
                    }
                });

                const config = {
                    compiler,
                    target,
                    testSuite,
                    staticAnalysis,
                    customDefines: [] // 추후 구현
                };

                vscode.postMessage({
                    command: 'saveBuildConfig',
                    buildType: buildType,
                    config: config
                });
            }

            function saveAdvancedSettings() {
                const parallelJobs = parseInt(document.getElementById('parallel-jobs').value);
                const timeout = parseInt(document.getElementById('timeout').value);
                const notifications = document.getElementById('notifications').checked;

                vscode.postMessage({
                    command: 'updateSetting',
                    key: 'customOptions',
                    value: {
                        parallelJobs,
                        timeout,
                        notifications
                    }
                });
            }
        </script>
    </body>
    </html>
    `;
    }
    static async updateProjectSetting(project, key, value) {
        // 프로젝트 설정 업데이트 로직
        console.log(`Updating ${key} to ${value} for project ${project.id}`);
        // 실제 구현에서는 ProjectManager를 통해 설정 업데이트
    }
    static async saveBuildConfig(project, buildType, config) {
        // 빌드 설정 저장 로직
        console.log(`Saving build config for ${buildType}:`, config);
        // 실제 구현에서는 ProjectManager를 통해 설정 저장
    }
}
exports.ProjectSettingsViewer = ProjectSettingsViewer;
//# sourceMappingURL=projectSettingsViewer.js.map