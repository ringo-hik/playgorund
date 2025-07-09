export interface Project {
  id: string;
  name: string;
  repository: string;
  defaultBranch: string;
  description?: string;
  lastBuildTime?: string;
  buildConfig: ProjectConfig;
}

export interface ProjectConfig {
  devBuildConfig: BuildConfig;
  relBuildConfig: BuildConfig;
  commitBuildConfig: BuildConfig;
  defaultCompiler: string;
  defaultTarget: string;
  availableTests: string[];
}

export interface ProjectSettings {
  projectId: string;
  projectName: string;
  defaultBranch: string;
  buildConfigs: {
    dev: BuildConfig;
    rel: BuildConfig;
    commit: BuildConfig;
  };
  customOptions: {
    parallelJobs: number;
    timeout: number;
    notifications: boolean;
  };
}

export interface BuildConfig {
  compiler: string;
  target: string;
  testSuite: string[];
  staticAnalysis: boolean;
  customDefines: string[];
}

export type BuildType = 'dev' | 'rel' | 'commit';