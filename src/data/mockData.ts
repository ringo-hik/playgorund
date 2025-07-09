import { Project, ProjectConfig, BuildConfig } from '../types/project';
import { BuildResult, BuildStatus, Branch, TestSuite, TestResult, ArtifactInfo, PerformanceMetrics, LogEntry } from '../types/build';

// Mock 빌드 설정
const mockBuildConfig: BuildConfig = {
  compiler: 'gcc10',
  target: 'debug',
  testSuite: ['unit', 'integration'],
  staticAnalysis: true,
  customDefines: ['DEBUG', 'MOCK_BUILD']
};

const mockRelBuildConfig: BuildConfig = {
  compiler: 'gcc10',
  target: 'release',
  testSuite: ['unit', 'integration', 'simulation'],
  staticAnalysis: true,
  customDefines: ['RELEASE', 'OPTIMIZED']
};

const mockCommitBuildConfig: BuildConfig = {
  compiler: 'gcc10',
  target: 'debug',
  testSuite: ['unit'],
  staticAnalysis: false,
  customDefines: ['COMMIT_BUILD']
};

// Mock 프로젝트 설정
const mockProjectConfig: ProjectConfig = {
  devBuildConfig: mockBuildConfig,
  relBuildConfig: mockRelBuildConfig,
  commitBuildConfig: mockCommitBuildConfig,
  defaultCompiler: 'gcc10',
  defaultTarget: 'debug',
  availableTests: ['unit', 'integration', 'simulation', 'performance']
};

// Mock 프로젝트 목록
export const mockProjects: Project[] = [
  {
    id: 'ABC_CORE_PROJECT',
    name: 'ABC_CORE_PROJECT',
    repository: 'git@internal:abc/core.git',
    defaultBranch: 'main',
    description: 'Core system for ABC platform',
    lastBuildTime: '2024-01-15T10:30:00Z',
    buildConfig: mockProjectConfig
  },
  {
    id: 'ABC_UI_PROJECT',
    name: 'ABC_UI_PROJECT',
    repository: 'git@internal:abc/ui.git',
    defaultBranch: 'develop',
    description: 'Frontend interface for ABC platform',
    lastBuildTime: '2024-01-15T09:45:00Z',
    buildConfig: mockProjectConfig
  },
  {
    id: 'ABC_API_PROJECT',
    name: 'ABC_API_PROJECT',
    repository: 'git@internal:abc/api-gateway.git',
    defaultBranch: 'main',
    description: 'API gateway and routing service',
    lastBuildTime: '2024-01-15T11:20:00Z',
    buildConfig: mockProjectConfig
  },
  {
    id: 'ABC_TEST_PROJECT',
    name: 'ABC_TEST_PROJECT',
    repository: 'git@internal:abc/test-framework.git',
    defaultBranch: 'master',
    description: 'Test framework for ABC platform',
    lastBuildTime: '2024-01-14T16:30:00Z',
    buildConfig: mockProjectConfig
  },
  {
    id: 'ABC_SECURITY_PROJECT',
    name: 'ABC_SECURITY_PROJECT',
    repository: 'git@internal:abc/security.git',
    defaultBranch: 'main',
    description: 'Security and cryptography utilities',
    lastBuildTime: '2024-01-15T08:15:00Z',
    buildConfig: mockProjectConfig
  },
  {
    id: 'ABC_NETWORK_PROJECT',
    name: 'ABC_NETWORK_PROJECT',
    repository: 'git@internal:abc/network.git',
    defaultBranch: 'develop',
    description: 'Network communication stack',
    lastBuildTime: '2024-01-15T12:00:00Z',
    buildConfig: mockProjectConfig
  }
];

// Mock 브랜치 목록
export const mockBranches: Branch[] = [
  {
    name: 'main',
    lastCommit: 'abc123def456',
    lastCommitMessage: 'Fix memory leak in connection handler',
    lastCommitTime: '2024-01-15T10:30:00Z'
  },
  {
    name: 'develop',
    lastCommit: 'def456ghi789',
    lastCommitMessage: 'Add new authentication module',
    lastCommitTime: '2024-01-15T09:45:00Z'
  },
  {
    name: 'feature/new-ui',
    lastCommit: 'ghi789jkl012',
    lastCommitMessage: 'Update UI components',
    lastCommitTime: '2024-01-15T11:20:00Z'
  },
  {
    name: 'release/v1.0',
    lastCommit: 'jkl012mno345',
    lastCommitMessage: 'Prepare release v1.0',
    lastCommitTime: '2024-01-14T16:30:00Z'
  }
];

// Mock 테스트 결과
const mockSuccessTestSuites: TestSuite[] = [
  {
    name: 'Unit Tests',
    totalTests: 45,
    passedTests: 45,
    failedTests: 0,
    skippedTests: 0,
    duration: '2m 15s',
    tests: [
      { name: 'CoreModule::testInitialization', status: 'passed', duration: '0.12s' },
      { name: 'CoreModule::testConfiguration', status: 'passed', duration: '0.08s' },
      { name: 'NetworkModule::testConnection', status: 'passed', duration: '0.25s' },
      { name: 'SecurityModule::testEncryption', status: 'passed', duration: '0.18s' },
      { name: 'DatabaseModule::testQuery', status: 'passed', duration: '0.32s' }
    ]
  },
  {
    name: 'Integration Tests',
    totalTests: 12,
    passedTests: 12,
    failedTests: 0,
    skippedTests: 0,
    duration: '5m 30s',
    tests: [
      { name: 'API::testEndpointIntegration', status: 'passed', duration: '1.2s' },
      { name: 'Database::testTransactionFlow', status: 'passed', duration: '2.1s' },
      { name: 'Security::testAuthenticationFlow', status: 'passed', duration: '1.8s' }
    ]
  }
];

const mockFailedTestSuites: TestSuite[] = [
  {
    name: 'Unit Tests',
    totalTests: 25,
    passedTests: 20,
    failedTests: 3,
    skippedTests: 2,
    duration: '1m 45s',
    tests: [
      { name: 'CoreModule::testInitialization', status: 'passed', duration: '0.12s' },
      { name: 'CoreModule::testConfiguration', status: 'failed', duration: '0.08s', errorMessage: 'Configuration validation failed' },
      { name: 'NetworkModule::testConnection', status: 'failed', duration: '0.25s', errorMessage: 'Connection timeout' },
      { name: 'SecurityModule::testEncryption', status: 'passed', duration: '0.18s' },
      { name: 'DatabaseModule::testQuery', status: 'skipped', duration: '0s', details: 'Database not available' }
    ]
  }
];

// Mock 아티팩트 정보
const mockSuccessArtifacts: ArtifactInfo[] = [
  {
    name: 'app.bin',
    path: '/build/output/app.bin',
    size: '2.4 MB',
    type: 'binary',
    createdAt: '2024-01-15T10:14:30Z',
    downloadUrl: 'https://build-server/artifacts/app.bin',
    checksum: 'sha256:a1b2c3d4e5f6...'
  },
  {
    name: 'symbols.map',
    path: '/build/output/symbols.map',
    size: '156 KB',
    type: 'other',
    createdAt: '2024-01-15T10:14:32Z',
    downloadUrl: 'https://build-server/artifacts/symbols.map',
    checksum: 'sha256:f6e5d4c3b2a1...'
  },
  {
    name: 'test-report.xml',
    path: '/build/reports/test-report.xml',
    size: '45 KB',
    type: 'report',
    createdAt: '2024-01-15T10:15:00Z',
    downloadUrl: 'https://build-server/artifacts/test-report.xml'
  },
  {
    name: 'coverage-report.html',
    path: '/build/reports/coverage-report.html',
    size: '128 KB',
    type: 'report',
    createdAt: '2024-01-15T10:15:05Z',
    downloadUrl: 'https://build-server/artifacts/coverage-report.html'
  }
];

// Mock 성능 메트릭
const mockPerformanceMetrics: PerformanceMetrics = {
  buildTime: '15m 30s',
  compileTime: '8m 45s',
  testTime: '6m 45s',
  memoryUsage: {
    peak: '1.2 GB',
    average: '850 MB'
  },
  cpuUsage: {
    peak: '95%',
    average: '68%'
  },
  diskUsage: '3.8 GB',
  cacheHitRate: '78%'
};

// Mock 로그 엔트리
const mockSuccessLogs: LogEntry[] = [
  { timestamp: '2024-01-15T10:00:00Z', level: 'info', message: 'Starting layer build...', source: 'BuildManager' },
  { timestamp: '2024-01-15T10:00:15Z', level: 'info', message: 'Initializing build environment', source: 'BuildManager' },
  { timestamp: '2024-01-15T10:00:30Z', level: 'info', message: 'Compiling source files...', source: 'Compiler' },
  { timestamp: '2024-01-15T10:05:45Z', level: 'info', message: 'Compilation completed successfully', source: 'Compiler' },
  { timestamp: '2024-01-15T10:06:00Z', level: 'info', message: 'Running unit tests...', source: 'TestRunner' },
  { timestamp: '2024-01-15T10:08:15Z', level: 'info', message: 'Unit tests completed: 45/45 passed', source: 'TestRunner' },
  { timestamp: '2024-01-15T10:08:30Z', level: 'info', message: 'Running integration tests...', source: 'TestRunner' },
  { timestamp: '2024-01-15T10:14:00Z', level: 'info', message: 'Integration tests completed: 12/12 passed', source: 'TestRunner' },
  { timestamp: '2024-01-15T10:14:15Z', level: 'info', message: 'Running static analysis...', source: 'StaticAnalyzer' },
  { timestamp: '2024-01-15T10:14:45Z', level: 'info', message: 'Static analysis passed', source: 'StaticAnalyzer' },
  { timestamp: '2024-01-15T10:15:00Z', level: 'info', message: 'Generating build artifacts...', source: 'ArtifactManager' },
  { timestamp: '2024-01-15T10:15:30Z', level: 'info', message: 'Build completed successfully', source: 'BuildManager' }
];

const mockFailedLogs: LogEntry[] = [
  { timestamp: '2024-01-15T09:00:00Z', level: 'info', message: 'Starting commit build...', source: 'BuildManager' },
  { timestamp: '2024-01-15T09:00:15Z', level: 'info', message: 'Initializing build environment', source: 'BuildManager' },
  { timestamp: '2024-01-15T09:00:30Z', level: 'info', message: 'Compiling source files...', source: 'Compiler' },
  { timestamp: '2024-01-15T09:03:45Z', level: 'error', message: 'Compilation error in main.cpp:42', source: 'Compiler' },
  { timestamp: '2024-01-15T09:03:46Z', level: 'error', message: 'undefined reference to `missing_function`', source: 'Compiler' },
  { timestamp: '2024-01-15T09:05:00Z', level: 'error', message: 'Build failed with compilation errors', source: 'BuildManager' }
];

// Mock 빌드 결과
export const mockBuildResults: { [key: string]: BuildResult[] } = {
  'ABC_CORE_PROJECT': [
    {
      id: 'build-001',
      projectId: 'ABC_CORE_PROJECT',
      buildType: 'dev',
      status: {
        id: 'build-001',
        status: 'success',
        progress: 100,
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:15:30Z',
        duration: '15m 30s',
        logs: mockSuccessLogs,
        
        artifacts: mockSuccessArtifacts,
        testSuites: mockSuccessTestSuites,
        performanceMetrics: mockPerformanceMetrics
      },
      branch: 'main',
      commitHash: 'abc123def456',
      config: mockBuildConfig,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'build-002',
      projectId: 'ABC_CORE_PROJECT',
      buildType: 'rel',
      status: {
        id: 'build-002',
        status: 'running',
        progress: 65,
        startTime: '2024-01-15T11:00:00Z',
        logs: [
          { timestamp: '2024-01-15T11:00:00Z', level: 'info', message: 'Starting release build...', source: 'BuildManager' },
          { timestamp: '2024-01-15T11:00:30Z', level: 'info', message: 'Compiling with optimizations...', source: 'Compiler' },
          { timestamp: '2024-01-15T11:08:00Z', level: 'info', message: 'Running test suite...', source: 'TestRunner' }
        ],
        
      },
      branch: 'release/v1.0',
      commitHash: 'jkl012mno345',
      config: mockRelBuildConfig,
      createdAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 'build-003',
      projectId: 'ABC_CORE_PROJECT',
      buildType: 'commit',
      status: {
        id: 'build-003',
        status: 'failed',
        progress: 30,
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T09:05:00Z',
        duration: '5m 12s',
        logs: mockFailedLogs,
        
        testSuites: mockFailedTestSuites,
        errorMessage: 'Compilation error in main.cpp:42'
      },
      branch: 'feature/new-ui',
      commitHash: 'ghi789jkl012',
      config: mockCommitBuildConfig,
      createdAt: '2024-01-15T09:00:00Z'
    }
  ],
  'ABC_TEST_PROJECT': [
    {
      id: 'build-004',
      projectId: 'ABC_TEST_PROJECT',
      buildType: 'dev',
      status: {
        id: 'build-004',
        status: 'success',
        progress: 100,
        startTime: '2024-01-15T14:00:00Z',
        endTime: '2024-01-15T14:25:12Z',
        duration: '25m 12s',
        logs: [
          { timestamp: '2024-01-15T14:00:00Z', level: 'info', message: 'Starting layer build...', source: 'BuildManager' },
          { timestamp: '2024-01-15T14:02:00Z', level: 'info', message: 'Compiling test framework...', source: 'Compiler' },
          { timestamp: '2024-01-15T14:10:00Z', level: 'info', message: 'Running unit tests: PASSED', source: 'TestRunner' },
          { timestamp: '2024-01-15T14:15:00Z', level: 'info', message: 'Running integration tests: PASSED', source: 'TestRunner' },
          { timestamp: '2024-01-15T14:20:00Z', level: 'info', message: 'Running simulation tests: PASSED', source: 'TestRunner' },
          { timestamp: '2024-01-15T14:22:00Z', level: 'info', message: 'Static analysis: PASSED', source: 'StaticAnalyzer' },
          { timestamp: '2024-01-15T14:24:00Z', level: 'info', message: 'Build artifacts generated', source: 'ArtifactManager' },
          { timestamp: '2024-01-15T14:25:12Z', level: 'info', message: 'Build completed successfully', source: 'BuildManager' }
        ],
        
        artifacts: [
          {
            name: 'test-framework.bin',
            path: '/build/output/test-framework.bin',
            size: '3.2 MB',
            type: 'binary',
            createdAt: '2024-01-15T14:24:30Z',
            downloadUrl: 'https://build-server/artifacts/test-framework.bin'
          },
          {
            name: 'test-results.xml',
            path: '/build/reports/test-results.xml',
            size: '89 KB',
            type: 'report',
            createdAt: '2024-01-15T14:25:00Z',
            downloadUrl: 'https://build-server/artifacts/test-results.xml'
          },
          {
            name: 'coverage-report.html',
            path: '/build/reports/coverage-report.html',
            size: '245 KB',
            type: 'report',
            createdAt: '2024-01-15T14:25:10Z',
            downloadUrl: 'https://build-server/artifacts/coverage-report.html'
          }
        ],
        testSuites: mockSuccessTestSuites,
        performanceMetrics: {
          buildTime: '25m 12s',
          compileTime: '12m 30s',
          testTime: '10m 15s',
          memoryUsage: {
            peak: '1.8 GB',
            average: '1.2 GB'
          },
          cpuUsage: {
            peak: '88%',
            average: '72%'
          },
          diskUsage: '4.5 GB',
          cacheHitRate: '82%'
        }
      },
      branch: 'master',
      commitHash: 'def456ghi789',
      config: mockBuildConfig,
      createdAt: '2024-01-15T14:00:00Z'
    }
  ]
};

// Mock 빌드 상태 생성 함수
export function createMockBuildStatus(
  status: 'pending' | 'running' | 'success' | 'failed',
  progress: number = 0
): BuildStatus {
  const now = new Date().toISOString();
  return {
    id: `build-${Date.now()}`,
    status,
    progress,
    startTime: now,
    endTime: status === 'success' || status === 'failed' ? now : undefined,
    duration: status === 'success' || status === 'failed' ? '12m 34s' : undefined,
    logs: [
      { timestamp: now, level: 'info', message: 'Starting build...', source: 'BuildManager' },
      { timestamp: now, level: 'info', message: 'Compiling source files...', source: 'Compiler' },
      ...(status === 'running' ? [{ timestamp: now, level: 'info' as const, message: 'Build in progress...', source: 'BuildManager' }] : []),
      ...(status === 'success' ? [{ timestamp: now, level: 'info' as const, message: 'Build completed successfully', source: 'BuildManager' }] : []),
      ...(status === 'failed' ? [{ timestamp: now, level: 'error' as const, message: 'Build failed with errors', source: 'BuildManager' }] : [])
    ],
    rawLogs: [
      'Starting build...',
      'Compiling source files...',
      ...(status === 'running' ? ['Build in progress...'] : []),
      ...(status === 'success' ? ['Build completed successfully'] : []),
      ...(status === 'failed' ? ['Build failed with errors'] : [])
    ],
    artifacts: status === 'success' ? [
      {
        name: 'app.bin',
        path: '/build/output/app.bin',
        size: '2.1 MB',
        type: 'binary',
        createdAt: now
      },
      {
        name: 'symbols.map',
        path: '/build/output/symbols.map',
        size: '128 KB',
        type: 'other',
        createdAt: now
      }
    ] : undefined,
    errorMessage: status === 'failed' ? 'Mock build error' : undefined
  };
}