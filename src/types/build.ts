export interface BuildRequest {
  projectId: string;
  branch: string;
  buildType: 'dev' | 'rel' | 'commit';
  config: BuildConfig;
}

export interface BuildConfig {
  compiler: string;
  target: string;
  testSuite: string[];
  staticAnalysis: boolean;
  customDefines: string[];
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: string;
  details?: string;
  errorMessage?: string;
}

export interface TestSuite {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: string;
  tests: TestResult[];
}

export interface ArtifactInfo {
  name: string;
  path: string;
  size: string;
  type: 'binary' | 'report' | 'log' | 'config' | 'other';
  createdAt: string;
  downloadUrl?: string;
  checksum?: string;
}

export interface PerformanceMetrics {
  buildTime: string;
  compileTime: string;
  testTime: string;
  memoryUsage: {
    peak: string;
    average: string;
  };
  cpuUsage: {
    peak: string;
    average: string;
  };
  diskUsage: string;
  cacheHitRate?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source?: string;
}

export interface BuildStatus {
  id: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  progress: number;
  startTime?: string;
  endTime?: string;
  duration?: string;
  logs?: LogEntry[];
  rawLogs?: string[];
  artifacts?: ArtifactInfo[];
  testSuites?: TestSuite[];
  performanceMetrics?: PerformanceMetrics;
  errorMessage?: string;
}

export interface BuildResult {
  id: string;
  projectId: string;
  buildType: 'dev' | 'rel' | 'commit';
  status: BuildStatus;
  branch: string;
  commitHash?: string;
  config: BuildConfig;
  createdAt: string;
}

export interface Branch {
  name: string;
  lastCommit: string;
  lastCommitMessage: string;
  lastCommitTime: string;
}

// PUMBA 관련 타입
export interface PumbaConfig {
  compiler: string;
  buildType: string;
  tests: {
    unitTest: boolean;
    simulator: boolean;
    staticAnalysis: boolean;
  };
  customDefines: string[];
}

export interface PumbaResult {
  id: string;
  status: BuildStatus;
  config: PumbaConfig;
  createdAt: string;
}