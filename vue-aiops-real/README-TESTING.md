# 🤖 AI ChatOps 완전 자동화 테스트 가이드

## 📋 개요

vue-aiops-real 프로젝트를 위한 완전한 자동화 테스트 시스템입니다. Playwright MCP를 활용하여 캡처 기반 검증과 상세한 마크다운 리포트 생성을 지원합니다.

## 🚀 빠른 시작

### 1. 자동화 워크플로우 실행
```bash
# 전체 자동화 테스트 실행 (권장)
npm run test:automation

# 개별 테스트 스위트 실행
npm run test:comprehensive  # 종합 E2E 테스트
npm run test:capture       # 고급 캡처 워크플로우
npm run test:reports       # 마크다운 리포트 생성

# 모든 테스트 (HTML 리포트 포함)
npm run test:all

# 헤드리스 모드 해제 (브라우저 창 표시)
npm run test:headed

# 디버그 모드
npm run test:debug
```

### 2. 개발 서버와 함께 실행
```bash
# 터미널 1: 개발 서버 시작
npm run dev

# 터미널 2: 테스트 실행
npm run test:automation
```

## 📊 테스트 스위트 구성

### 🔴 고우선순위 테스트
1. **comprehensive-e2e-test.spec.ts** - 종합 E2E 테스트
   - 초기 로딩 및 UI 구조 검증
   - 채팅 인터페이스 활성화 및 카테고리 선택
   - 페르소나 선택 및 채팅 기능 테스트
   - 반응형 디자인 및 다양한 뷰포트 테스트
   - 고급 기능 및 설정 테스트
   - 성능 및 접근성 검증

2. **advanced-capture-workflow.spec.ts** - 고급 캡처 워크플로우
   - 전체 UI 플로우 상세 캡처
   - 채팅 기능 심화 캡처
   - 설정 및 테마 변경 캡처
   - 에러 상황 및 복구 캡처

### 🟡 중간우선순위 테스트
3. **markdown-report-generator.spec.ts** - 마크다운 리포트 생성
   - 종합 기능 테스트
   - 반응형 디자인 테스트
   - 접근성 및 사용성 테스트

4. **기존 테스트들**
   - comprehensive-test.spec.ts
   - final-scenario-test.spec.ts
   - markdown-workflow-test.spec.ts

## 📁 결과 및 리포트 구조

```
test-results/
├── automation-workflow/          # 자동화 워크플로우 결과
│   ├── reports/
│   │   ├── final-report-*.md    # 최종 종합 리포트
│   │   ├── latest-report.md     # 최신 리포트 (심볼릭 링크)
│   │   └── results-*.json       # JSON 형태 결과
│   ├── screenshots/             # 통합 스크린샷
│   └── automation.log           # 실행 로그
├── comprehensive/               # 종합 테스트 캡처
│   ├── screenshots/
│   └── reports/
├── advanced-capture/           # 고급 캡처 결과
│   └── [테스트명]/
│       ├── screenshots/        # 시퀀스별 캡처
│       ├── metadata/           # 캡처 메타데이터
│       └── capture-report.json
└── markdown-reports/           # 마크다운 리포트
    ├── detailed-report-*.md
    ├── summary-report-*.md
    ├── dashboard-*.html
    └── screenshots/
```

## 🎯 주요 기능

### 1. 완전 자동화 워크플로우
- **자동 재시도**: 실패 시 최대 3회 재시도
- **우선순위 기반 실행**: 고우선순위 → 중간우선순위 순서
- **개발 서버 자동 관리**: 미실행 시 자동 시작/종료
- **종합 리포트 생성**: 모든 테스트 결과 통합

### 2. 고급 캡처 시스템
- **상황별 스크린샷**: 각 단계별 상세 캡처
- **비교 캡처**: 변경 전후 상태 비교
- **상호작용 시퀀스**: 사용자 행동 순서별 캡처
- **다중 뷰포트**: 다양한 화면 크기에서 테스트
- **에러 상황 캡처**: 오류 발생 시 자동 캡처

### 3. 마크다운 리포트
- **상세 리포트**: 모든 테스트 결과 포함
- **요약 리포트**: 핵심 정보만 정리
- **HTML 대시보드**: 시각적 결과 표시
- **성능 메트릭**: 로딩 시간, 성능 지표 포함
- **접근성 검사**: WCAG 가이드라인 준수 확인

## 🔧 고급 설정

### 환경 변수
```bash
# CI 환경에서 실행
CI=true npm run test:automation

# 특정 브라우저만 테스트
BROWSER=firefox npm run test:automation

# 디버그 모드
DEBUG=true npm run test:automation
```

### 설정 커스터마이징
`playwright-automation-workflow.js` 파일에서 다음 설정을 조정할 수 있습니다:

```javascript
this.config = {
  retryCount: 3,        // 재시도 횟수
  timeout: 300000,      // 전체 타임아웃 (5분)
  parallel: false,      // 병렬 실행 여부
  browsers: ['chromium'], // 테스트할 브라우저
  // ... 기타 설정
};
```

## 🐛 문제 해결

### 일반적인 문제들

1. **개발 서버 연결 실패**
   ```bash
   # 포트 확인
   netstat -ano | findstr :5175
   
   # 수동으로 서버 시작
   npm run dev
   ```

2. **브라우저 설치 문제**
   ```bash
   # 브라우저 재설치
   npx playwright install
   ```

3. **권한 문제**
   ```bash
   # 관리자 권한으로 실행 (Windows)
   # 또는 sudo 사용 (Linux/Mac)
   ```

4. **메모리 부족**
   ```bash
   # 병렬 실행 비활성화
   # playwright.config.ts에서 workers: 1 설정
   ```

### 디버깅 팁

1. **헤드리스 모드 해제**: `npm run test:headed`
2. **단계별 디버깅**: `npm run test:debug`
3. **로그 확인**: `test-results/automation-workflow/automation.log`
4. **스크린샷 확인**: 각 단계별 캡처된 이미지 검토

## 📈 CI/CD 통합

### GitHub Actions 예시
```yaml
name: AI ChatOps 자동화 테스트

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright
      run: npx playwright install --with-deps
      
    - name: Run automation tests
      run: npm run test:automation
      env:
        CI: true
        
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: test-results/
```

## 📚 추가 리소스

- [Playwright 공식 문서](https://playwright.dev/)
- [Vue.js 테스팅 가이드](https://vuejs.org/guide/scaling-up/testing.html)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

## 💡 권장사항

1. **정기 실행**: 매일 또는 주간 단위로 자동화 테스트 실행
2. **결과 모니터링**: 성공률 추이 관찰 및 개선
3. **스크린샷 검토**: 시각적 회귀 테스트로 활용
4. **성능 기준**: 로딩 시간 임계값 설정 및 모니터링
5. **접근성 준수**: 정기적인 접근성 검사로 품질 향상

---

*이 가이드는 AI ChatOps 프로젝트의 품질 보증을 위해 작성되었습니다.*