# AI ChatOps Admin 내부망 통합 가이드

## 🔍 필수 사전 체크리스트

### 1. 의존성 패키지 확인
```json
{
  "dependencies": {
    "axios": "^1.6.0",    // HTTP 클라이언트 (필수)
    "vue": "^3.3.4"       // Vue.js 프레임워크 (필수)
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",  // Vue 빌드 플러그인 (필수)
    "vite": "^4.4.5"                 // 빌드 도구 (필수)
  }
}
```

### 2. 백엔드 API 엔드포인트 요구사항
```
기본 API Base URL: http://your-internal-server/api
CORS 설정 필수: Origin, Methods, Headers

필수 엔드포인트:
✅ GET  /admin/personas-with-prompts     - 페르소나 목록 조회
✅ POST /admin/personas                  - 페르소나 생성  
✅ PUT  /admin/personas/{personaCode}    - 페르소나 수정
✅ DEL  /admin/personas/{personaCode}    - 페르소나 삭제
✅ POST /admin/system-prompt/test        - 프롬프트 테스트
✅ GET  /admin/conversations             - 대화 내역 조회 (신규)
✅ GET  /admin/conversation-stats        - 대화 통계 조회 (신규)
✅ GET  /admin/categories                - 카테고리 목록
✅ GET  /admin/health                    - 헬스체크
```

## 🚀 단계별 통합 방법

### A. 프론트엔드 파일 복사 방식 (권장)

#### 1단계: 필수 파일 복사
```bash
# Admin 컴포넌트들
src/aiOps/admin/
├── SystemAdminPage.vue           # 메인 관리 페이지
├── SystemAdminTab.vue           # 프롬프트 관리 탭  
├── ConversationAnalyticsPage.vue # 대화 분석 페이지 (신규)
└── components/
    └── PersonaManager.vue        # 페르소나 관리자

# 서비스 레이어
src/aiOps/service/
├── aiChatOpsService.js          # API 서비스 (수정 필요)
└── convertMarkdownToHtml.js     # 마크다운 변환기

# 유틸리티
src/aiOps/utils/
├── i18n.js                      # 다국어 지원
└── timerUtils.js                # 타이머 유틸리티

# 스타일
src/aiOps/styles/
├── aiChatOps.css               # 메인 스타일
└── customMarkdown.css          # 마크다운 스타일
```

#### 2단계: API 설정 수정
```javascript
// src/aiOps/service/aiChatOpsService.js 수정
const API_BASE_URL = 'http://your-internal-api-server:port'; // 변경 필요

// 또는 환경변수로 관리
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3005';
```

#### 3단계: 라우터 설정
```javascript
// router/index.js에 추가
import SystemAdminPage from '@/aiOps/admin/SystemAdminPage.vue'
import ConversationAnalyticsPage from '@/aiOps/admin/ConversationAnalyticsPage.vue'

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: SystemAdminPage
  },
  {
    path: '/admin/analytics', 
    name: 'Analytics',
    component: ConversationAnalyticsPage
  }
]
```

### B. 백엔드 Java 파일 통합

#### 1단계: DTO 클래스 복사
```bash
# 프로젝트의 dto 패키지에 복사
com/yourcompany/project/dto/
├── PersonaDto.java                    # 페르소나 데이터 
├── ApiResponseDto.java               # API 응답 형식
├── SystemPromptTestRequestDto.java   # 프롬프트 테스트 요청
├── SystemPromptUpdateRequestDto.java # 프롬프트 업데이트 요청
├── ConversationDto.java              # 대화 데이터 (신규)
├── ConversationPageDto.java          # 페이지네이션 응답 (신규)
└── ConversationStatsDto.java         # 통계 데이터 (신규)
```

#### 2단계: 서비스 레이어 통합
```bash
com/yourcompany/project/service/
├── AdminService.java                 # 인터페이스
└── AdminServiceImpl.java            # 구현체 (DB 연동 로직 추가 필요)
```

#### 3단계: 컨트롤러 통합
```bash
com/yourcompany/project/controller/
└── AdminController.java             # REST API 컨트롤러
```

## ⚙️ 환경 설정 파일

### 1. Vite 설정 (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://your-internal-api-server:port', // 수정 필요
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### 2. 환경변수 (.env)
```bash
# 내부망 환경에 맞게 수정
VUE_APP_API_BASE_URL=http://your-internal-api-server:port
VUE_APP_ENVIRONMENT=production
```

### 3. Spring Boot 설정 (application.yml)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:your-database-url
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

# CORS 설정 
cors:
  allowed-origins: 
    - http://your-frontend-server:3000
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
```

## 🗄️ 데이터베이스 스키마 

### 1. personas 테이블
```sql
CREATE TABLE personas (
    persona_code VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    description_en TEXT,
    category VARCHAR(50),
    welcome_msg TEXT,
    system_prompt TEXT,
    tags JSON,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. conversations 테이블 (신규)
```sql
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    persona_code VARCHAR(50),
    user_query TEXT,
    ai_response TEXT, 
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    response_time INT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    query_length INT,
    response_length INT,
    INDEX idx_persona_code (persona_code),
    INDEX idx_user_id (user_id),
    INDEX idx_created_date (created_date)
);
```

## 🔧 운영 체크리스트

### 배포 전 필수 확인사항
- [ ] API_BASE_URL이 내부망 서버로 올바르게 설정되었는지
- [ ] CORS 설정이 프론트엔드 도메인을 허용하는지  
- [ ] 데이터베이스 연결 및 테이블이 생성되었는지
- [ ] 모든 API 엔드포인트가 정상 응답하는지
- [ ] 환경변수가 프로덕션 값으로 설정되었는지

### 성능 최적화
- [ ] 빌드 최적화: `npm run build`
- [ ] Gzip 압축 활성화
- [ ] 정적 파일 캐싱 설정
- [ ] DB 인덱스 최적화

### 보안 설정
- [ ] API 인증/인가 구현
- [ ] HTTPS 적용
- [ ] SQL Injection 방어
- [ ] XSS 방어 헤더 설정

## 🧪 테스트 방법

### 1. 로컬 테스트
```bash
# 프론트엔드 실행
npm run dev

# 백엔드 Spring Boot 실행  
./mvnw spring-boot:run

# 브라우저에서 확인
http://localhost:3000/admin
http://localhost:3000/admin/analytics
```

### 2. 기능별 테스트
- [ ] 페르소나 CRUD 동작
- [ ] 시스템 프롬프트 테스트
- [ ] 대화 내역 조회 및 필터링
- [ ] 통계 데이터 표시
- [ ] 페이지네이션 동작
- [ ] 로딩 상태 표시

## 🚨 트러블슈팅

### 자주 발생하는 문제들
1. **CORS 오류**: 백엔드 CORS 설정 확인
2. **API 타임아웃**: axios timeout 설정 늘리기
3. **빌드 실패**: Node.js 버전 호환성 확인
4. **DB 연결 실패**: 연결 정보 및 방화벽 확인

### 로그 확인 방법
```javascript
// 개발 모드에서 API 호출 로그 확인
console.log('API Request:', url, params)
console.log('API Response:', response)
```

이 가이드를 따라 단계별로 진행하면 내부망에서도 문제없이 동작할 것입니다!