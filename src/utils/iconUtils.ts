import * as vscode from 'vscode';

// Lucide 아이콘 매핑 (VS Code ThemeIcon 형태로 변환)
export const LucideIcons = {
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
export function createIcon(iconName: keyof typeof LucideIcons, color?: vscode.ThemeColor): vscode.ThemeIcon {
  const lucideIcon = LucideIcons[iconName];
  return new vscode.ThemeIcon(lucideIcon, color);
}

// 상태별 아이콘 생성
export function getStatusIcon(status: string): vscode.ThemeIcon {
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
export function getBuildTypeIcon(buildType: string): vscode.ThemeIcon {
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
export function getContextIcon(context: string): vscode.ThemeIcon {
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
export function getProgressIcon(progress: number): vscode.ThemeIcon {
  if (progress === 0) {
    return createIcon('pending', new vscode.ThemeColor('charts.yellow'));
  } else if (progress < 100) {
    return createIcon('running', new vscode.ThemeColor('charts.blue'));
  } else {
    return createIcon('success', new vscode.ThemeColor('charts.green'));
  }
}

// 파일 타입별 아이콘 생성
export function getFileTypeIcon(fileType: string): vscode.ThemeIcon {
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
export function getTestTypeIcon(testType: string): vscode.ThemeIcon {
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