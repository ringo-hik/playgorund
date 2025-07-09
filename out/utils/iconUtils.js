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
exports.LucideIcons = void 0;
exports.createIcon = createIcon;
exports.getStatusIcon = getStatusIcon;
exports.getBuildTypeIcon = getBuildTypeIcon;
exports.getContextIcon = getContextIcon;
exports.getProgressIcon = getProgressIcon;
exports.getFileTypeIcon = getFileTypeIcon;
exports.getTestTypeIcon = getTestTypeIcon;
const vscode = __importStar(require("vscode"));
// Lucide 아이콘 매핑 (VS Code ThemeIcon 형태로 변환)
exports.LucideIcons = {
    // 빌드 관련
    build: 'hammer',
    compile: 'cpu',
    test: 'flask-conical',
    deploy: 'rocket',
    // 프로젝트 관련
    project: 'folder',
    repository: 'git-branch',
    branch: 'git-branch',
    commit: 'git-commit-horizontal',
    // 상태 관련
    pending: 'clock',
    running: 'loader',
    success: 'check-circle',
    failed: 'x-circle',
    warning: 'alert-triangle',
    // 설정 관련
    settings: 'settings',
    config: 'sliders',
    edit: 'edit',
    gear: 'cog',
    // 액션 관련
    play: 'play',
    pause: 'pause',
    stop: 'square',
    refresh: 'refresh-cw',
    search: 'search',
    // 파일 관련
    file: 'file',
    folder: 'folder',
    upload: 'upload',
    download: 'download',
    // 네트워크 관련
    cloud: 'cloud',
    server: 'server',
    database: 'database',
    // 도구 관련
    tools: 'wrench',
    terminal: 'terminal',
    code: 'code',
    // 정보 관련
    info: 'info',
    help: 'help-circle',
    eye: 'eye',
    // 기타
    history: 'history',
    link: 'link',
    external: 'external-link',
    archive: 'archive'
};
// 아이콘 생성 유틸리티 함수
function createIcon(iconName, color) {
    const lucideIcon = exports.LucideIcons[iconName];
    return new vscode.ThemeIcon(lucideIcon, color);
}
// 상태별 아이콘 생성
function getStatusIcon(status) {
    switch (status) {
        case 'pending':
            return createIcon('pending', new vscode.ThemeColor('charts.yellow'));
        case 'running':
            return createIcon('running', new vscode.ThemeColor('charts.blue'));
        case 'success':
            return createIcon('success', new vscode.ThemeColor('charts.green'));
        case 'failed':
            return createIcon('failed', new vscode.ThemeColor('charts.red'));
        case 'warning':
            return createIcon('warning', new vscode.ThemeColor('charts.orange'));
        default:
            return createIcon('info');
    }
}
// 빌드 타입별 아이콘 생성
function getBuildTypeIcon(buildType) {
    switch (buildType) {
        case 'dev':
            return createIcon('code', new vscode.ThemeColor('charts.blue'));
        case 'rel':
        case 'release':
            return createIcon('deploy', new vscode.ThemeColor('charts.purple'));
        case 'commit':
            return createIcon('commit', new vscode.ThemeColor('charts.green'));
        default:
            return createIcon('build');
    }
}
// 컨텍스트별 아이콘 생성
function getContextIcon(context) {
    switch (context) {
        case 'project':
            return createIcon('project', new vscode.ThemeColor('charts.blue'));
        case 'settings':
            return createIcon('settings', new vscode.ThemeColor('charts.gray'));
        case 'config':
            return createIcon('config', new vscode.ThemeColor('charts.orange'));
        case 'buildResult':
            return createIcon('eye', new vscode.ThemeColor('charts.green'));
        case 'history':
            return createIcon('history', new vscode.ThemeColor('charts.gray'));
        case 'help':
            return createIcon('help', new vscode.ThemeColor('charts.blue'));
        default:
            return createIcon('info');
    }
}
// 진행률 기반 아이콘 생성
function getProgressIcon(progress) {
    if (progress === 0) {
        return createIcon('pending', new vscode.ThemeColor('charts.yellow'));
    }
    else if (progress < 100) {
        return createIcon('running', new vscode.ThemeColor('charts.blue'));
    }
    else {
        return createIcon('success', new vscode.ThemeColor('charts.green'));
    }
}
// 파일 타입별 아이콘 생성
function getFileTypeIcon(fileType) {
    switch (fileType) {
        case 'log':
            return createIcon('file', new vscode.ThemeColor('charts.gray'));
        case 'config':
            return createIcon('settings', new vscode.ThemeColor('charts.orange'));
        case 'binary':
            return createIcon('archive', new vscode.ThemeColor('charts.purple'));
        case 'report':
            return createIcon('file', new vscode.ThemeColor('charts.green'));
        default:
            return createIcon('file');
    }
}
// 테스트 타입별 아이콘 생성
function getTestTypeIcon(testType) {
    switch (testType) {
        case 'unit':
            return createIcon('test', new vscode.ThemeColor('charts.green'));
        case 'integration':
            return createIcon('test', new vscode.ThemeColor('charts.blue'));
        case 'simulation':
            return createIcon('test', new vscode.ThemeColor('charts.purple'));
        case 'performance':
            return createIcon('test', new vscode.ThemeColor('charts.orange'));
        default:
            return createIcon('test');
    }
}
//# sourceMappingURL=iconUtils.js.map