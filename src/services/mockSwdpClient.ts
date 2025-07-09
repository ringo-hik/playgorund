import { Project, ProjectConfig, ProjectSettings } from '../types/project';
import { BuildRequest, BuildResult, BuildStatus, Branch } from '../types/build';
import { mockProjects, mockBranches, mockBuildResults, createMockBuildStatus } from '../data/mockData';

export class MockSwdpClient {
  private selectedProject: Project | null = null;
  private buildCounter = 1000;

  // 프로젝트 목록 조회
  async getProjects(): Promise<Project[]> {
    // 실제 API 호출 시뮬레이션
    await this.delay(500);
    return mockProjects;
  }

  // 특정 프로젝트 조회
  async getProject(projectId: string): Promise<Project | null> {
    await this.delay(300);
    return mockProjects.find(p => p.id === projectId) || null;
  }

  // 프로젝트 설정 조회
  async getProjectConfig(projectId: string): Promise<ProjectConfig | null> {
    await this.delay(400);
    const project = mockProjects.find(p => p.id === projectId);
    return project ? project.buildConfig : null;
  }

  // 브랜치 목록 조회
  async getBranches(projectId: string): Promise<Branch[]> {
    await this.delay(600);
    return mockBranches;
  }

  // 빌드 요청
  async createBuild(request: BuildRequest): Promise<BuildResult> {
    await this.delay(800);
    
    const buildId = `build-${this.buildCounter++}`;
    const status = createMockBuildStatus('pending', 0);
    status.id = buildId;

    const result: BuildResult = {
      id: buildId,
      projectId: request.projectId,
      buildType: request.buildType,
      status,
      branch: request.branch,
      commitHash: `commit-${Date.now().toString(36)}`,
      config: request.config,
      createdAt: new Date().toISOString()
    };

    // Mock 빌드 진행 시뮬레이션
    this.simulateBuildProgress(result);

    return result;
  }

  // 빌드 상태 조회
  async getBuildStatus(buildId: string): Promise<BuildStatus | null> {
    await this.delay(200);
    
    // Mock 빌드 결과에서 찾기
    for (const results of Object.values(mockBuildResults)) {
      const build = results.find(b => b.id === buildId);
      if (build) {
        return build.status;
      }
    }
    
    return null;
  }

  // 빌드 결과 목록 조회
  async getBuildResults(projectId: string): Promise<BuildResult[]> {
    await this.delay(400);
    return mockBuildResults[projectId] || [];
  }

  // 빌드 로그 조회
  async getBuildLogs(buildId: string): Promise<string[]> {
    await this.delay(300);
    
    for (const results of Object.values(mockBuildResults)) {
      const build = results.find(b => b.id === buildId);
      if (build && build.status.logs) {
        return build.status.logs.map(log => `[${log.level.toUpperCase()}] ${log.message}`);
      }
    }
    
    return ['No logs available'];
  }

  // 현재 선택된 프로젝트 설정
  setSelectedProject(project: Project | null): void {
    this.selectedProject = project;
  }

  // 현재 선택된 프로젝트 조회
  getSelectedProject(): Project | null {
    return this.selectedProject;
  }

  // 빌드 진행 시뮬레이션
  private simulateBuildProgress(build: BuildResult): void {
    const statuses: Array<'pending' | 'running' | 'success' | 'failed'> = ['pending', 'running'];
    
    // 성공/실패 랜덤 결정
    const willSucceed = Math.random() > 0.3; // 70% 성공률
    const finalStatus = willSucceed ? 'success' : 'failed';
    
    let currentStep = 0;
    const totalSteps = 5;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.floor((currentStep / totalSteps) * 100);
      const now = new Date().toISOString();
      
      if (currentStep === 1) {
        // 빌드 시작
        build.status.status = 'running';
        build.status.progress = 10;
        build.status.logs = [
          { timestamp: now, level: 'info', message: 'Starting build...', source: 'BuildManager' },
          { timestamp: now, level: 'info', message: 'Initializing build environment...', source: 'BuildManager' }
        ];
      } else if (currentStep === 2) {
        // 컴파일
        build.status.progress = 30;
        build.status.logs?.push({ timestamp: now, level: 'info', message: 'Compiling source files...', source: 'Compiler' });
      } else if (currentStep === 3) {
        // 테스트
        build.status.progress = 60;
        build.status.logs?.push({ timestamp: now, level: 'info', message: 'Running tests...', source: 'TestRunner' });
      } else if (currentStep === 4) {
        // 정적 분석
        build.status.progress = 85;
        build.status.logs?.push({ timestamp: now, level: 'info', message: 'Performing static analysis...', source: 'StaticAnalyzer' });
      } else if (currentStep >= totalSteps) {
        // 완료
        clearInterval(progressInterval);
        build.status.status = finalStatus;
        build.status.progress = 100;
        build.status.endTime = new Date().toISOString();
        build.status.duration = `${Math.floor(Math.random() * 15) + 5}m ${Math.floor(Math.random() * 60)}s`;
        
        if (finalStatus === 'success') {
          build.status.logs?.push({ timestamp: now, level: 'info', message: 'Build completed successfully', source: 'BuildManager' });
          build.status.artifacts = [
            {
              name: 'app.bin',
              path: '/build/output/app.bin',
              size: '2.1 MB',
              type: 'binary',
              createdAt: now,
              downloadUrl: 'https://build-server/artifacts/app.bin'
            },
            {
              name: 'symbols.map',
              path: '/build/output/symbols.map',
              size: '128 KB',
              type: 'other',
              createdAt: now,
              downloadUrl: 'https://build-server/artifacts/symbols.map'
            },
            {
              name: 'test-report.xml',
              path: '/build/reports/test-report.xml',
              size: '45 KB',
              type: 'report',
              createdAt: now,
              downloadUrl: 'https://build-server/artifacts/test-report.xml'
            }
          ];
        } else {
          build.status.logs?.push({ timestamp: now, level: 'error', message: 'Build failed with errors', source: 'BuildManager' });
          build.status.errorMessage = 'Mock compilation error';
        }
      }
    }, 2000); // 2초마다 진행
  }

  // 지연 시뮬레이션
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}