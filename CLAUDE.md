# CLAUDE.md - AI Operations 코드 분석 가이드

## 프로젝트 개요
이 프로젝트는 AI ChatOps 시스템으로, 다양한 AI 페르소나를 통해 사용자와 대화할 수 있는 Vue.js 기반 웹 애플리케이션입니다.

## 프로젝트 구조
```
src/aiOps/
├── AIChatOpsLayout.vue     # 메인 컴포넌트 (809줄) - 채팅 인터페이스
├── components/
│   ├── ChatTab.vue         # 채팅 탭 컴포넌트
│   ├── Elements.vue        # 공통 UI 요소
│   └── FeedbackTab.vue     # 피드백 탭 컴포넌트
├── services/
│   └── aiChatOpsService.js # API 서비스 (553줄) - REST API 통신
├── styles/
│   ├── aiChatOps.css      # 메인 스타일시트
│   └── customMarkdown.css  # 마크다운 스타일
└── utils/
    └── i18n.js            # 국제화 유틸리티
```

## 핵심 기능 분석

### 1. API 서비스 (aiChatOpsService.js:1-553)
- **REST API 통신**: axios 기반 HTTP 클라이언트
- **페르소나 관리**: 다양한 AI 페르소나 CRUD 작업
- **메시지 처리**: 동기/비동기 메시지 전송
- **세션 관리**: 대화 컨텍스트 유지
- **HTML 마크다운 변환**: 응답 데이터 포맷팅

### 2. 메인 레이아웃 (AIChatOpsLayout.vue:1-809)
- **상태 관리**: Vue.js 기반 반응형 상태
- **다중 뷰**: 카테고리 선택, 페르소나 목록, 채팅, 피드백
- **테마 시스템**: 5가지 테마 지원
- **다국어**: 한국어/영어 지원
- **캐싱**: 메시지 캐싱 및 세션 관리

## Gemini CLI를 통한 코드 분석

### 기본 프로젝트 분석
```bash
# 전체 프로젝트 구조 및 기능 분석
gemini -p "프로젝트 전체 구조를 분석하고 주요 기능, 아키텍처 패턴, 사용된 기술 스택을 요약해주세요"

# API 서비스 계층 분석
gemini -p "aiChatOpsService.js 파일을 분석하여 API 구조, 에러 핸들링, 보안 이슈를 검토해주세요"

# Vue 컴포넌트 아키텍처 분석
gemini -p "AIChatOpsLayout.vue 컴포넌트의 상태 관리, 생명주기, 성능 최적화 방안을 분석해주세요"
```

### 보안 분석
```bash
# 보안 취약점 검사
gemini -p "코드베이스에서 XSS, CSRF, 인증/인가 관련 보안 취약점을 찾아 개선 방안을 제시해주세요"

# API 보안 검토
gemini -p "REST API 호출에서 보안 헤더, 입력값 검증, 에러 처리 방식을 검토하고 보안 강화 방안을 제시해주세요"
```

### 성능 최적화 분석
```bash
# 프론트엔드 성능 분석
gemini -p "Vue.js 컴포넌트의 렌더링 성능, 메모리 사용량, 번들 크기 최적화 방안을 분석해주세요"

# 네트워크 최적화 분석
gemini -p "API 호출 패턴, 캐싱 전략, 네트워크 요청 최적화 방안을 분석해주세요"
```

### 코드 품질 분석
```bash
# 코드 품질 검토
gemini -p "ESLint 규칙 준수, 코드 복잡도, 테스트 커버리지, 리팩토링 필요 부분을 분석해주세요"

# 아키텍처 패턴 분석
gemini -p "현재 사용된 디자인 패턴, 아키텍처 패턴의 적절성을 평가하고 개선 방안을 제시해주세요"
```

## Claude Code 고급 기능 활용

### Agent Mode 자동 활용
Claude Code는 다음 상황에서 자동으로 **Agent Mode**로 전환하여 효율적인 분석을 수행합니다:

1. **키워드 검색 작업**: "config", "logger", "service" 등 특정 키워드 탐색
2. **파일 위치 찾기**: "어떤 파일에서 API 호출을 하는가?" 같은 질문
3. **다중 파일 분석**: 여러 파일 간의 관계 및 의존성 분석
4. **패턴 매칭**: 특정 코딩 패턴이나 안티패턴 검색

### Plan Mode 자동 활용
다음과 같은 복잡한 작업에서 **Plan Mode**가 자동 활성화됩니다:

1. **리팩토링 계획**: 코드 구조 개선 작업
2. **기능 추가**: 새로운 기능 구현 계획 수립
3. **성능 최적화**: 단계별 최적화 전략 수립
4. **보안 강화**: 보안 취약점 해결 로드맵 작성

### 권한 및 자동화 설정
- **전체 권한 허용**: 모든 파일 접근 및 수정 권한 보유
- **자동 모드 전환**: 작업 복잡도에 따른 자동 모드 선택
- **배치 처리**: 여러 작업을 효율적으로 병렬 처리

## 실행 명령어 예시

### 종합 분석 명령어
```bash
# 전체 프로젝트 분석 (Gemini CLI)
gemini -a -p "이 AI ChatOps 프로젝트의 전체 아키텍처, 보안, 성능, 코드 품질을 종합적으로 분석하고 개선 로드맵을 제시해주세요"

# Claude Code Agent Mode 트리거 (자동)
# "API 서비스에서 에러 핸들링은 어떻게 구현되어 있나요?"

# Claude Code Plan Mode 트리거 (자동)
# "이 프로젝트에 실시간 알림 기능을 추가하는 계획을 세워주세요"
```

### 특화 분석 스크립트
```bash
# 보안 중심 분석
gemini -p "보안 취약점 스캔: XSS, CSRF, 인증 우회, 민감 정보 노출 위험을 검사하고 대응 방안을 제시하세요"

# 성능 중심 분석
gemini -p "성능 병목 지점 분석: 렌더링 지연, API 응답 시간, 메모리 누수 가능성을 검토하고 최적화 방안을 제시하세요"

# 유지보수성 분석
gemini -p "코드 유지보수성 평가: 코드 복잡도, 중복 코드, 테스트 가능성을 분석하고 리팩토링 우선순위를 제시하세요"
```

## 분석 결과 활용 가이드

### 1. 자동 리포트 생성
- Gemini CLI 분석 결과를 마크다운 포맷으로 자동 저장
- Claude Code가 분석 결과를 바탕으로 개선 코드 자동 생성
- 우선순위별 작업 목록 자동 생성

### 2. 지속적 모니터링
- 코드 변경 시 자동 재분석 트리거
- 성능 메트릭 자동 추적
- 보안 취약점 자동 검사

### 3. 개발팀 협업
- 분석 결과 공유를 위한 대시보드 연동
- 코드 리뷰 자동화
- 개발 가이드라인 자동 생성

---

## 주요 명령어 치트시트

| 분석 유형 | Gemini CLI 명령어 | Claude Code 모드 |
|----------|------------------|------------------|
| 전체 구조 | `gemini -a -p "프로젝트 전체 분석"` | Auto Agent |
| 보안 검사 | `gemini -p "보안 취약점 분석"` | Auto Plan |
| 성능 분석 | `gemini -p "성능 최적화 방안"` | Auto Agent |
| 코드 품질 | `gemini -p "코드 품질 검토"` | Auto Plan |
| 리팩토링 | Claude Code: "리팩토링 계획 수립" | Auto Plan |
| 버그 찾기 | Claude Code: "에러 패턴 검색" | Auto Agent |

이 가이드를 통해 AI 도구들을 최대한 활용하여 코드 품질을 지속적으로 개선할 수 있습니다.

---

## 🤖 완전 자동화 테스트 시스템 (2025-01-14 구축 완료)

### 📋 구축된 Playwright MCP 자동화 테스트 시스템

vue-aiops-real 프로젝트에 **완전한 자동화 테스트 인프라**가 구축되었습니다. 이 시스템은 캡처 기반 검증과 상세한 마크다운 리포트 생성을 지원합니다.

### 🔥 핵심 테스트 파일들

#### 고우선순위 테스트 스위트
1. **`vue-aiops-real/tests/comprehensive-e2e-test.spec.ts`**
   - 6단계 종합 E2E 테스트 (초기 로딩 → 성능 검증)
   - 자동 리포트 생성 클래스 포함
   - 스크린샷 자동 캡처 및 분류

2. **`vue-aiops-real/tests/advanced-capture-workflow.spec.ts`**
   - 고급 캡처 워크플로우 클래스 (`AdvancedCaptureWorkflow`)
   - 상황별/비교/시퀀스/다중뷰포트 캡처
   - 에러 상황 자동 캡처 및 복구 테스트

3. **`vue-aiops-real/tests/markdown-report-generator.spec.ts`**
   - 마크다운 리포트 생성기 클래스 (`MarkdownReportGenerator`)
   - HTML 대시보드 자동 생성
   - 성능/접근성 메트릭 포함

#### 자동화 워크플로우
4. **`vue-aiops-real/playwright-automation-workflow.js`**
   - 완전 자동화 실행 스크립트
   - 자동 재시도 (최대 3회)
   - 개발 서버 자동 시작/종료
   - 우선순위 기반 테스트 실행

### 🚀 테스트 실행 명령어

#### 핵심 명령어 (package.json에 추가됨)
```bash
# 🔥 완전 자동화 테스트 (권장)
npm run test:automation

# 개별 테스트 스위트
npm run test:comprehensive  # 종합 E2E 테스트
npm run test:capture       # 고급 캡처 워크플로우  
npm run test:reports       # 마크다운 리포트 생성

# 디버깅 모드
npm run test:headed        # 브라우저 창 표시
npm run test:debug         # 단계별 디버깅
npm run test:all           # HTML 리포트 포함
```

### 📁 생성되는 결과 구조
```
test-results/
├── automation-workflow/          # 🤖 자동화 워크플로우 통합 결과
│   ├── reports/
│   │   ├── final-report-*.md    # 📊 최종 종합 리포트
│   │   ├── latest-report.md     # 🔗 최신 리포트 링크
│   │   └── results-*.json       # 📋 JSON 형태 상세 결과
│   ├── screenshots/             # 📸 통합 스크린샷
│   └── automation.log           # 📝 실행 로그

├── comprehensive/               # 🎯 종합 테스트 캡처
│   ├── screenshots/            # 6단계 테스트별 캡처
│   └── reports/               # 테스트별 상세 리포트

├── advanced-capture/           # 🔬 고급 캡처 결과  
│   └── [테스트명]/
│       ├── 001-상태명-*.png    # 시퀀스별 캡처
│       ├── 001-상태명-*.json   # 캡처 메타데이터
│       └── capture-report.json # 캡처 종합 리포트

└── markdown-reports/           # 📄 마크다운 리포트
    ├── detailed-report-*.md    # 상세 리포트
    ├── summary-report-*.md     # 요약 리포트  
    ├── dashboard-*.html        # HTML 대시보드
    └── screenshots/           # 리포트용 스크린샷
```

### 🎯 자동화 시스템 특징

#### 1. 지능형 재시도 시스템
- 네트워크 오류, 일시적 로딩 지연 자동 복구
- 최대 3회 재시도로 안정성 확보
- 실패 원인별 상세 로깅

#### 2. 캡처 기반 검증
- **상황별 캡처**: 각 UI 상태별 자동 스크린샷
- **비교 캡처**: 변경 전후 상태 시각적 비교
- **시퀀스 캡처**: 사용자 상호작용 단계별 기록
- **다중 뷰포트**: 모바일/태블릿/데스크톱 반응형 테스트

#### 3. 종합 리포트 시스템
- **Markdown 상세 리포트**: 모든 테스트 결과 + 성능 메트릭
- **HTML 대시보드**: 시각적 결과 표시 + 스크린샷 갤러리
- **JSON 데이터**: 프로그램적 접근을 위한 구조화된 결과
- **접근성 검사**: WCAG 가이드라인 준수 자동 확인

#### 4. CI/CD 준비
- GitHub Actions 예시 설정 포함 (README-TESTING.md)
- 환경변수 기반 설정 (CI=true 등)
- 아티팩트 자동 업로드 지원

### 💡 세션 간 연속성 확보

**다른 세션에서도 이 테스트 시스템을 활용하려면:**

1. **상태 확인**: `vue-aiops-real/` 디렉토리에서 테스트 파일들 존재 여부 확인
2. **즉시 실행**: `npm run test:automation` 명령어로 전체 테스트 실행
3. **결과 확인**: `test-results/automation-workflow/reports/latest-report.md` 확인
4. **문제 해결**: `README-TESTING.md` 가이드 참조

### 🔧 주요 설정 파일 위치
- **설정**: `vue-aiops-real/playwright.config.ts`
- **스크립트**: `vue-aiops-real/package.json` (scripts 섹션)
- **가이드**: `vue-aiops-real/README-TESTING.md`
- **자동화**: `vue-aiops-real/playwright-automation-workflow.js`

이 시스템을 통해 AI ChatOps 프로젝트의 품질을 지속적이고 자동적으로 검증할 수 있습니다.