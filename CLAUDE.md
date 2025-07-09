# 🔧 VS Code Extension "Build Agent" - Project Context

## 📋 프로젝트 개요

### 핵심 목표
**내부망 개발환경에서 SWDP(DevOps 공식 빌드)와 PUMBA(로컬 원격 빌드) 시스템을 VS Code에 통합하여 개발자 생산성 향상**

### 주요 해결 과제
- 기존 분산된 빌드 시스템(SIMBA 윈도우 앱, SWDP 웹) 통합
- VS Code 중심의 개발 워크플로우 구축
- 복잡한 빌드 설정 관리 자동화

### 사용자 대상
- 내부망 VS Code 사용 소프트웨어 개발자
- SWDP DevOps 파이프라인 사용자
- 로컬 빌드(PUMBA) 필요 개발자

## 🏗️ 시스템 아키텍처

### 전체 구조
```
VS Code Extension (Build Agent)
├── Activity Bar: "Build Agent" (wrench icon)
├── SWDP Build View (공식 빌드)
│   ├── Project Manager (프로젝트 선택/관리)
│   ├── Dev Build (개발 빌드)
│   ├── Rel Build (릴리즈 빌드)
│   └── Commit Build (커밋 빌드)
├── PUMBA Build View (로컬 원격 빌드)
│   ├── 설정 관리 (JSON 기반)
│   ├── ZIP 압축 및 전송
│   └── 빌드 상태 모니터링
└── 확장 모듈 (향후)
    ├── JIRA Integration
    └── Bitbucket Integration
```

### 기술 스택
- **언어**: TypeScript 5.0+
- **플랫폼**: VS Code Extension API 1.90+
- **통신**: node-fetch 3.3+ (REST API)
- **UI**: VS Code TreeView + 내장 QuickPick/InputBox
- **빌드**: TypeScript Compiler (tsc)

### 백엔드 시스템 연동
- **SWDP Core**: Java Spring 2.0 기반 RESTful API
- **PUMBA**: SWDP API 경유 SIMBA 기능 대체
- **Bamboo**: 실제 빌드 실행 서버 (SWDP/PUMBA 경유)

## 🎯 핵심 기능

### 1. SWDP Build 관리
**프로젝트 선택 플로우**:
1. `GET /api/projects` - 프로젝트 목록 조회
2. QuickPick 검색 가능 프로젝트 선택
3. `GET /api/projects/{id}/config` - 프로젝트 기본 설정 로드
4. `.vscode/swdp-project.json` 설정 저장
5. TreeView 갱신 및 빌드 옵션 활성화

**빌드 실행 플로우**:
1. `GET /api/projects/{id}/branches` - 브랜치 목록 조회
2. 사용자 빌드 설정 확인/수정
3. `POST /api/builds` - 빌드 요청 (설정 포함)
4. `GET /api/builds/{id}/status` - 상태 확인 (폴링)
5. 빌드 완료 시 결과 표시

### 2. PUMBA Remote Build
**처리 흐름**:
1. 설정 로드 (`.vscode/pumba-config.json`)
2. 워크스페이스 ZIP 생성
3. `POST /api/pumba/build` - ZIP + 설정 전송
4. 로그 스트리밍 (OutputChannel)
5. 결과 처리 및 표시

### 3. 설정 관리 시스템
**SWDP 프로젝트 설정**: `.vscode/swdp-project.json`
- 프로젝트 정보 (ID, 이름, 기본 브랜치)
- 빌드 타입별 설정 (dev/rel/commit)
- 커스텀 옵션 (병렬 작업, 타임아웃, 알림)

**PUMBA 설정**: `.vscode/pumba-config.json`
- 컴파일러 설정
- 빌드 타입 및 테스트 옵션
- 커스텀 정의

## 🔧 개발 환경

### 프로젝트 구조
```
src/
├── extension.ts                 # 확장 프로그램 진입점
├── types/
│   ├── project.ts              # 프로젝트 관련 타입
│   └── build.ts                # 빌드 관련 타입
├── services/
│   ├── mockSwdpClient.ts       # SWDP API 클라이언트
│   └── projectManager.ts       # 프로젝트 관리 서비스
├── views/
│   ├── projectTreeProvider.ts  # 프로젝트 TreeView
│   ├── swdpTreeProvider.ts     # SWDP 빌드 TreeView
│   └── pumbaTreeProvider.ts    # PUMBA 빌드 TreeView
├── utils/
│   ├── iconUtils.ts            # 아이콘 유틸리티
│   └── markdownViewer.ts       # Markdown 뷰어
└── data/
    └── mockData.ts             # 모의 데이터
```

### 빌드 및 배포
```bash
# 개발
npm run compile    # TypeScript 컴파일
npm run watch      # 자동 컴파일 (개발 모드)

# 배포
npm run vscode:prepublish  # 배포용 빌드
vsce package              # .vsix 파일 생성
```

### 설정 파일
- **tsconfig.json**: TypeScript 컴파일러 설정
- **package.json**: 확장 프로그램 매니페스트
- **.vscode/**: VS Code 워크스페이스 설정

## 🌐 API 명세

### SWDP Core API 엔드포인트
```yaml
# 프로젝트 관리
GET /api/projects                    # 프로젝트 목록 조회
GET /api/projects/{id}               # 프로젝트 정보 조회
GET /api/projects/{id}/config        # 프로젝트 기본 설정
GET /api/projects/{id}/branches      # 브랜치 목록 조회

# 빌드 관리
POST /api/builds                     # 빌드 요청
GET /api/builds/{id}/status          # 빌드 상태 조회
GET /api/builds/{id}/logs            # 빌드 로그 조회

# PUMBA 통합
POST /api/pumba/build               # PUMBA 빌드 요청
GET /api/pumba/builds/{id}/status   # PUMBA 빌드 상태
```

### 핵심 데이터 타입
```typescript
// 프로젝트 정보
interface Project {
  id: string;
  name: string;
  repository: string;
  defaultBranch: string;
  buildConfig: ProjectConfig;
}

// 빌드 요청
interface BuildRequest {
  projectId: string;
  branch: string;
  buildType: 'dev' | 'rel' | 'commit';
  config: BuildConfig;
}

// 빌드 상태
interface BuildStatus {
  id: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  progress: number;
  startTime?: string;
  endTime?: string;
  logs?: string[];
}
```

## 📚 개발 가이드라인

### 코딩 표준
- **TypeScript Strict Mode** 활성화
- **VS Code Extension 가이드라인** 준수
- **모듈화 및 재사용성** 고려
- **단일 책임 원칙** 적용

### UI/UX 원칙
- **미니멀리즘**: VS Code 내장 API 최대 활용
- **통합된 경험**: Activity Bar 단일 진입점
- **학습 비용 최소화**: 직관적인 TreeView 구조
- **상태 표시**: 명확한 아이콘 및 라벨 사용

### 상태 관리
- **폴링 방식**: 실시간 WebSocket 대신 사용자 액션 기반
- **로컬 캐시**: 설정 파일 기반 상태 저장
- **에러 처리**: 사용자 친화적 오류 메시지

## 🚀 확장 계획

### Phase 1: 기본 기능 (현재)
- [x] 프로젝트 선택 시스템
- [x] SWDP 빌드 연동
- [x] PUMBA 빌드 연동
- [x] 설정 관리 시스템

### Phase 2: 향후 확장
- [ ] **JIRA Integration**: 이슈 조회 및 생성
- [ ] **Bitbucket Integration**: PR 관리
- [ ] **고급 기능**: 빌드 스케줄링, 알림 시스템
- [ ] **대시보드**: 빌드 통계 및 히스토리

### 확장 모듈 인터페이스
```typescript
interface FeatureModule {
  id: string;
  name: string;
  activate(context: ExtensionContext): void;
  deactivate(): void;
  getTreeDataProvider(): TreeDataProvider<any>;
  getCommands(): Command[];
}
```

## 🔒 보안 및 제약사항

### 보안 고려사항
- **내부망 전용**: 별도 외부 인증 불필요
- **로컬 설정**: 민감 정보 로컬 저장
- **API 통신**: HTTP/HTTPS 기반 REST API
- **소스 보호**: ZIP 전송 시 .gitignore 활용

### 기술적 제약사항
- **실시간 로그**: Bamboo 로그 스트리밍 불가
- **상태 확인**: 폴링 방식 상태 업데이트
- **대용량 파일**: ZIP 압축 크기 제한 고려
- **VS Code API**: Extension API 기능 제한

## 📝 중요 설정 파일

### package.json 핵심 설정
```json
{
  "name": "build-agent",
  "displayName": "Build Agent",
  "engines": { "vscode": "^1.90.0" },
  "activationEvents": ["onView:buildAgentView", "*"],
  "main": "./out/extension.js",
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "buildAgent",
          "title": "Build Agent",
          "icon": "$(wrench)"
        }
      ]
    },
    "views": {
      "buildAgent": [
        { "id": "swdpView", "name": "SWDP Build" },
        { "id": "projectView", "name": "Project Manager" },
        { "id": "pumbaView", "name": "PUMBA Remote Build" }
      ]
    }
  }
}
```

### API 엔드포인트 설정
```json
{
  "buildAgent.swdpUrl": "http://swdp.int/api",
  "buildAgent.pumbaUrl": "http://pumba.int/api",
  "buildAgent.pollingInterval": 5000
}
```

## 🎯 성공 지표

### 개발 완료 기준
- [x] 프로젝트 선택 및 관리 시스템 구현
- [x] SWDP 빌드 타입별 실행 가능
- [x] PUMBA 빌드 ZIP 전송 및 모니터링
- [x] 설정 관리 및 저장 시스템
- [x] TreeView 기반 직관적 UI

### 사용자 경험 목표
- 빌드 요청 시간 단축 (기존 대비 50% 이상)
- 컨텍스트 전환 최소화 (VS Code 내 완결)
- 설정 관리 자동화 (수동 설정 50% 감소)
- 직관적인 상태 표시 (실시간 진행률 확인)

---

**이 문서는 VS Code Extension "Build Agent" 프로젝트의 완전한 컨텍스트를 제공합니다. Claude가 이 프로젝트를 이해하고 효율적으로 개발 작업을 수행할 수 있도록 설계되었습니다.**