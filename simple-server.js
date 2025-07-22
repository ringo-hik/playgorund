const http = require('http');
const fs = require('fs');
const path = require('path');

// Read db.json
const dbPath = path.join(__dirname, 'db.json');
let db;

try {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (error) {
  console.error('Error reading db.json:', error);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url;
  const method = req.method;
  
  console.log(`${method} ${url}`);

  // Handle different endpoints
  if (url === '/health' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        status: "healthy",
        uptime: "24h 30m",
        version: "1.0.0"
      },
      timestamp: new Date().toISOString()
    }));
    
  } else if (url === '/personas' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: db.personas,
      timestamp: new Date().toISOString()
    }));
    
  } else if (url === '/admin/personas-with-prompts' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(db['admin-personas-with-prompts']));
    
  } else if (url === '/admin/personas' && method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const personaData = JSON.parse(body);
        console.log('POST /admin/personas received:', personaData);
        
        // Validate required fields
        const requiredFields = ['personaCode', 'title', 'description', 'descriptionEn', 'category'];
        for (const field of requiredFields) {
          if (!personaData[field]) {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(400);
            res.end(JSON.stringify({
              success: false,
              errorMessage: `필수 필드가 누락되었습니다: ${field}`,
              timestamp: new Date().toISOString()
            }));
            return;
          }
        }
        
        // Check if persona already exists
        const existingPersonas = db['admin-personas-with-prompts'].data;
        if (existingPersonas.some(p => p.personaCode === personaData.personaCode)) {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(409);
          res.end(JSON.stringify({
            success: false,
            errorMessage: '이미 존재하는 페르소나 코드입니다.',
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        // Add default system prompt if not provided
        const newPersona = {
          ...personaData,
          tags: personaData.tags || [],
          welcomeMsg: personaData.welcomeMsg || `안녕하세요! ${personaData.title}입니다.`,
          systemPrompt: personaData.systemPrompt || `You are a helpful AI assistant specialized in ${personaData.category}.\n\nProvide helpful, accurate responses related to your specialization.`
        };
        
        // Add to both admin and regular personas
        db['admin-personas-with-prompts'].data.push(newPersona);
        const regularPersona = {...newPersona};
        delete regularPersona.systemPrompt;
        delete regularPersona.descriptionEn;
        db.personas.data.push(regularPersona);
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          data: newPersona,
          message: '페르소나가 성공적으로 생성되었습니다.',
          timestamp: new Date().toISOString()
        }));
        
      } catch (error) {
        console.error('Error creating persona:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          errorMessage: 'Internal server error',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
  } else if (url.startsWith('/admin/personas/') && method === 'PUT') {
    const personaCode = url.split('/').pop();
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const updateData = JSON.parse(body);
        console.log(`PUT /admin/personas/${personaCode} received:`, updateData);
        
        // Find and update persona in admin list
        const adminPersonas = db['admin-personas-with-prompts'].data;
        const personaIndex = adminPersonas.findIndex(p => p.personaCode === personaCode);
        
        if (personaIndex === -1) {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(404);
          res.end(JSON.stringify({
            success: false,
            errorMessage: '페르소나를 찾을 수 없습니다.',
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        // Update persona
        const updatedPersona = {
          ...adminPersonas[personaIndex],
          ...updateData,
          personaCode: personaCode // Ensure persona code doesn't change
        };
        
        adminPersonas[personaIndex] = updatedPersona;
        
        // Update regular personas list too
        const regularPersonas = db.personas.data;
        const regularPersonaIndex = regularPersonas.findIndex(p => p.personaCode === personaCode);
        if (regularPersonaIndex !== -1) {
          const regularPersona = {...updatedPersona};
          delete regularPersona.systemPrompt;
          delete regularPersona.descriptionEn;
          regularPersonas[regularPersonaIndex] = regularPersona;
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: updatedPersona,
          message: '페르소나가 성공적으로 수정되었습니다.',
          timestamp: new Date().toISOString()
        }));
        
      } catch (error) {
        console.error('Error updating persona:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          errorMessage: 'Internal server error',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
  } else if (url.startsWith('/admin/personas/') && method === 'DELETE') {
    const personaCode = url.split('/').pop();
    console.log(`DELETE /admin/personas/${personaCode}`);
    
    // Find and remove persona from admin list
    const adminPersonas = db['admin-personas-with-prompts'].data;
    const personaIndex = adminPersonas.findIndex(p => p.personaCode === personaCode);
    
    if (personaIndex === -1) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        errorMessage: '페르소나를 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      }));
      return;
    }
    
    // Remove from both lists
    adminPersonas.splice(personaIndex, 1);
    
    const regularPersonas = db.personas.data;
    const regularPersonaIndex = regularPersonas.findIndex(p => p.personaCode === personaCode);
    if (regularPersonaIndex !== -1) {
      regularPersonas.splice(regularPersonaIndex, 1);
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: '페르소나가 성공적으로 삭제되었습니다.',
      timestamp: new Date().toISOString()
    }));
    
  } else if (url === '/admin/system-prompt/test' && method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { promptContent, testInput, personaCode } = JSON.parse(body);
        console.log('POST /admin/system-prompt/test received:', { personaCode, testInput: testInput?.substring(0, 50) + '...' });
        
        // Simulate AI response based on system prompt and test input
        const currentTime = new Date().toLocaleString('ko-KR');
        const mockResponse = `# 🤖 AI 시스템 프롬프트 테스트 결과

## 📋 테스트 정보

| 항목 | 값 |
|------|-----|
| **페르소나** | \`${personaCode}\` |
| **시스템 프롬프트 길이** | ${promptContent?.length || 0}자 |
| **사용자 질문** | "${testInput}" |
| **테스트 시간** | ${currentTime} |

---

## 💬 AI 응답 내용

안녕하세요! 현재 **테스트 모드**에서 동작하고 있습니다.

입력하신 시스템 프롬프트를 분석하여 다음과 같이 응답드립니다:

### 사용자 질문에 대한 응답

> **"${testInput}"**

이 질문에 대해 시스템 프롬프트의 지시사항을 따라 응답을 생성했습니다.

### 🔍 시스템 프롬프트 분석

**주요 특징:**
- **길이**: ${getPromptLengthCategory(promptContent?.length || 0)}
- **복잡도**: ${getPromptComplexity(promptContent || '')}
- **구조화 정도**: ${getPromptStructure(promptContent || '')}

**프롬프트 내용 미리보기:**
\`\`\`
${(promptContent || '').substring(0, 200)}${(promptContent || '').length > 200 ? '...' : ''}
\`\`\`

---

## ✅ 테스트 결과 요약

- ✅ **프롬프트 로딩**: 성공 (${promptContent?.length || 0}자)
- ✅ **페르소나 식별**: ${personaCode}
- ✅ **사용자 입력 처리**: "${testInput}"
- ✅ **응답 생성**: 완료 (${currentTime})
- ✅ **마크다운 형식**: 지원됨

### 📊 성능 지표

- **응답 시간**: ~${Math.floor(Math.random() * 500 + 100)}ms
- **토큰 사용량**: ~${Math.floor((promptContent?.length || 0) / 4)}개
- **처리 상태**: 정상

---

## ⚠️ 참고사항

> 🔧 **현재는 Mock 서버 테스트 모드입니다**
> 
> 실제 AI 서비스 연동 시에는:
> - 시스템 프롬프트가 AI 모델의 동작을 실제로 제어합니다
> - 더 정교하고 맥락에 맞는 응답을 생성합니다
> - 실시간 학습 및 개선이 이루어집니다

### 다음 단계
1. **프롬프트 최적화**: 더 구체적인 지시사항 추가
2. **테스트 케이스 확장**: 다양한 질문으로 테스트
3. **실제 AI 연동**: 프로덕션 환경 배포

---

*✨ 테스트 완료 시간: ${currentTime}*`;

        function getPromptLengthCategory(length) {
          if (length < 100) return "짧음 📝";
          if (length < 500) return "보통 📄";
          if (length < 1000) return "길음 📃";
          return "매우 길음 📚";
        }

        function getPromptComplexity(prompt) {
          const lineCount = prompt.split('\n').length;
          if (lineCount < 5) return "단순함 🟢";
          if (lineCount < 15) return "보통 🟡";
          return "복잡함 🔴";
        }

        function getPromptStructure(prompt) {
          if (prompt.includes('1.') || prompt.includes('-') || prompt.includes('*')) {
            return "구조화됨 📋";
          }
          return "자유형식 📝";
        }

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: mockResponse,
          sessionId: `test_session_${Date.now()}`,
          timestamp: new Date().toISOString(),
          metadata: {
            promptLength: promptContent?.length || 0,
            personaCode: personaCode,
            testMode: true
          }
        }));
        
      } catch (error) {
        console.error('Error testing system prompt:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          errorMessage: 'System prompt test failed',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
  } else if (url.startsWith('/admin/system-prompt/') && method === 'PUT') {
    const personaCode = url.split('/').pop();
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { systemPrompt } = JSON.parse(body);
        console.log(`PUT /admin/system-prompt/${personaCode} received`);
        
        // Find and update system prompt
        const adminPersonas = db['admin-personas-with-prompts'].data;
        const persona = adminPersonas.find(p => p.personaCode === personaCode);
        
        if (!persona) {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(404);
          res.end(JSON.stringify({
            success: false,
            errorMessage: '페르소나를 찾을 수 없습니다.',
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        // Update system prompt
        persona.systemPrompt = systemPrompt;
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: persona,
          message: '시스템 프롬프트가 성공적으로 업데이트되었습니다.',
          timestamp: new Date().toISOString()
        }));
        
      } catch (error) {
        console.error('Error updating system prompt:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          errorMessage: 'Internal server error',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
  } else if (url === '/message-async' && method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('POST /message-async received:', data);
        
        const { personaCode, userQuery, category, previousReport, userId, userEmail, userName } = data;
        
        // 사용자 정보 로깅
        if (userId) {
          console.log(`Request from user: ${userId} (${userEmail || 'no-email'}) - ${userName || 'no-name'}`);
        }
        
        // Extension 카테고리의 weekly_report 페르소나 처리
        if (category === 'Extension' && personaCode === 'weekly_report') {
          let responseData;
          
          if (previousReport && userQuery) {
            // 피드백이 있는 경우 - 기존 리포트를 수정
            responseData = `${previousReport}\n\n## 📝 피드백 반영 사항\n\n**피드백**: ${userQuery}\n\n**수정 내용**: 요청하신 내용을 바탕으로 리포트를 업데이트했습니다.\n- 추가 정보 및 세부사항 포함\n- 내용 구성 및 가독성 개선\n- 필요한 데이터 보완\n\n---\n*최종 수정: ${new Date().toLocaleString('ko-KR')}*`;
          } else {
            // 새로운 주간보고 생성
            const currentDate = new Date();
            const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
            const weekEnd = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
            
            // 사용자 정보 설정
            const authorName = userName || userId || 'VSCode Extension 사용자';
            const authorInfo = userId ? `${authorName} (${userId})` : authorName;
            
            responseData = `# 주간 업무 보고서

**보고 기간**: ${weekStart.toLocaleDateString('ko-KR')} ~ ${weekEnd.toLocaleDateString('ko-KR')}
**작성자**: ${authorInfo}
**작성일**: ${new Date().toLocaleDateString('ko-KR')}

## 📊 주요 성과

### 완료된 업무
- ✅ **SWDP ChatOps Extension 테스트**
  - VSCode Extension 설치 및 동작 확인
  - 액티비티바 아이콘 추가 완료
  - API 연동 테스트 성공

- ✅ **개발 환경 설정**
  - Mock API 서버 구동
  - Extension 카테고리 페르소나 설정
  - 주간보고 자동화 시스템 구축

### 진행 중인 업무
- 🔄 **기능 검증 및 개선**
  - 사용자 시나리오 테스트
  - 피드백 시스템 검증
  - 파일 저장 기능 확인

## 🎯 다음 주 계획

### 우선순위 업무
1. **Extension 기능 완성도 향상**
   - 에러 처리 개선
   - 사용자 경험 최적화
   - 추가 기능 검토

2. **배포 준비**
   - 문서화 완성
   - 테스트 케이스 추가
   - 패키지 최적화

## 📈 이슈 및 해결방안

### 해결된 이슈
- ✅ API 연결 오류 (ECONNREFUSED) → API URL 수정으로 해결
- ✅ GET/POST 방식 불일치 → POST 방식으로 통일

### 현재 작업 중인 이슈
- 사용자 쿼리 전달 및 처리 로직 개선

## 💡 개선 제안

- **동적 데이터 처리**: 실제 프로젝트 데이터를 기반으로 한 보고서 생성
- **템플릿 시스템**: 다양한 보고서 템플릿 지원
- **협업 기능**: 팀 멤버와의 보고서 공유 기능

## 📋 특이사항

- VSCode Extension을 통한 자동화 시스템 구축 완료
- 사용자 피드백을 통한 실시간 리포트 수정 기능 구현
- 마크다운 형식의 전문적인 보고서 자동 생성

---

**다음 보고**: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
**문의사항**: Extension 사용 중 문제가 있으시면 피드백 기능을 이용해 주세요.

*이 보고서는 SWDP ChatOps Extension에 의해 자동 생성되었습니다.*`;
          }
          
          const response = {
            success: true,
            data: responseData,
            sessionId: `session_${Date.now()}`,
            timestamp: new Date().toISOString(),
            metadata: {
              personaCode,
              category,
              hasUserQuery: !!userQuery,
              hasPreviousReport: !!previousReport,
              userId: userId || 'unknown-user',
              userEmail: userEmail || '',
              userName: userName || ''
            }
          };
          
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify(response));
          
        } else {
          // 다른 페르소나나 카테고리는 기본 응답
          const response = {
            success: true,
            data: "처리되지 않은 페르소나입니다. Extension 카테고리의 weekly_report 페르소나만 지원됩니다.",
            sessionId: `session_${Date.now()}`,
            timestamp: new Date().toISOString()
          };
          
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(JSON.stringify(response));
        }
        
      } catch (error) {
        console.error('Error processing POST request:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          error: 'Internal server error',
          message: error.message
        }));
      }
    });
    
  } else if (url.startsWith('/admin/conversations') && method === 'GET') {
    // Parse query parameters for pagination and filtering
    const urlObj = new URL(url, `http://localhost:${PORT}`);
    const page = parseInt(urlObj.searchParams.get('page') || '0');
    const size = parseInt(urlObj.searchParams.get('size') || '20');
    const personaCode = urlObj.searchParams.get('personaCode');
    const userId = urlObj.searchParams.get('userId');
    const startDate = urlObj.searchParams.get('startDate');
    const endDate = urlObj.searchParams.get('endDate');
    
    // Mock conversation data generation
    const generateMockConversations = (page, size, filters) => {
      const personaCodes = ['personal_assistant', 'project_manager', 'developer', 'system_admin'];
      const userIds = ['user001', 'user002', 'user003', 'admin', 'tester'];
      const queries = [
        "안녕하세요. 도움이 필요합니다.",
        "프로젝트 일정을 확인해주세요.",
        "시스템 상태를 점검해주세요.",
        "데이터 분석 결과를 알려주세요.",
        "보안 점검이 필요합니다."
      ];
      const responses = [
        "네, 어떤 도움이 필요하신지 알려주세요.",
        "프로젝트 일정을 확인하여 알려드리겠습니다.",
        "시스템 상태를 점검하고 보고드리겠습니다.",
        "데이터 분석을 수행하여 결과를 제공해드리겠습니다.",
        "보안 점검을 진행하여 보고서를 작성해드리겠습니다."
      ];
      
      const totalElements = 250;
      const startIndex = page * size;
      const conversations = [];
      
      for (let i = 0; i < Math.min(size, totalElements - startIndex); i++) {
        const id = startIndex + i + 1;
        const personaCode = personaCodes[Math.floor(Math.random() * personaCodes.length)];
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const queryIndex = Math.floor(Math.random() * queries.length);
        const createdDate = new Date();
        createdDate.setHours(createdDate.getHours() - Math.floor(Math.random() * 24 * 7));
        
        conversations.push({
          id: id,
          personaCode: personaCode,
          userQuery: queries[queryIndex],
          aiResponse: responses[queryIndex],
          createdDate: createdDate.toISOString(),
          userId: userId,
          sessionId: `session_${Math.floor(Math.random() * 1000)}`,
          responseTime: Math.floor(Math.random() * 3000) + 500,
          success: Math.random() > 0.05,
          queryLength: queries[queryIndex].length,
          responseLength: responses[queryIndex].length
        });
      }
      
      return {
        conversations: conversations,
        currentPage: page,
        pageSize: size,
        totalPages: Math.ceil(totalElements / size),
        totalElements: totalElements,
        first: page === 0,
        last: page === Math.ceil(totalElements / size) - 1,
        hasNext: page < Math.ceil(totalElements / size) - 1,
        hasPrevious: page > 0,
        personaCode: filters.personaCode,
        userId: filters.userId,
        startDate: filters.startDate,
        endDate: filters.endDate
      };
    };
    
    const mockData = generateMockConversations(page, size, {
      personaCode, userId, startDate, endDate
    });
    
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockData,
      message: 'Conversations loaded successfully',
      timestamp: new Date().toISOString()
    }));
    
  } else if (url.startsWith('/admin/conversation-stats') && method === 'GET') {
    const urlObj = new URL(url, `http://localhost:${PORT}`);
    const personaCode = urlObj.searchParams.get('personaCode');
    const period = urlObj.searchParams.get('period') || 'all';
    
    const mockStats = {
      totalConversations: 1247,
      totalUsers: 86,
      totalPersonas: 11,
      dailyAverage: 42.3,
      todayCount: 38,
      weekCount: 296,
      monthCount: 1247,
      personaStats: {
        'personal_assistant': {
          personaCode: 'personal_assistant',
          title: '개인 업무 어시스턴트',
          totalCount: 315,
          dailyAverage: 10.7,
          successRate: 0.98,
          avgResponseTime: 1250,
          uniqueUsers: 28
        },
        'project_manager': {
          personaCode: 'project_manager',
          title: '프로젝트 매니저',
          totalCount: 267,
          dailyAverage: 9.1,
          successRate: 0.96,
          avgResponseTime: 1450,
          uniqueUsers: 22
        },
        'system_admin': {
          personaCode: 'system_admin',
          title: '시스템 관리자',
          totalCount: 198,
          dailyAverage: 6.7,
          successRate: 0.94,
          avgResponseTime: 1850,
          uniqueUsers: 18
        },
        'developer': {
          personaCode: 'developer',
          title: '개발자',
          totalCount: 156,
          dailyAverage: 5.3,
          successRate: 0.97,
          avgResponseTime: 2100,
          uniqueUsers: 15
        }
      },
      hourlyDistribution: {
        '9': 45, '10': 62, '11': 58, '12': 32, '13': 38, '14': 78, 
        '15': 85, '16': 67, '17': 52, '18': 28
      },
      topUsers: [
        { userId: 'user001', conversationCount: 127, uniquePersonas: 4, mostUsedPersona: 'personal_assistant', lastActiveDate: '2024-01-22' },
        { userId: 'admin', conversationCount: 98, uniquePersonas: 6, mostUsedPersona: 'system_admin', lastActiveDate: '2024-01-21' },
        { userId: 'user002', conversationCount: 85, uniquePersonas: 3, mostUsedPersona: 'project_manager', lastActiveDate: '2024-01-20' }
      ],
      responseTimeStats: {
        avgResponseTime: 1562,
        minResponseTime: 480,
        maxResponseTime: 4200,
        medianResponseTime: 1350,
        responseTimeRanges: {
          '0-1s': 387,
          '1-3s': 678,
          '3-5s': 142,
          '5s+': 40
        }
      },
      successRate: 0.96,
      successCount: 1197,
      failureCount: 50
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockStats,
      message: 'Statistics loaded successfully',
      timestamp: new Date().toISOString()
    }));
    
  } else {
    // 404 for unknown endpoints
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3005;

server.listen(PORT, () => {
  console.log(`SWDP ChatOps Mock API Server is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST http://localhost:${PORT}/message-async`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  GET  http://localhost:${PORT}/personas`);
  console.log(`\nAdmin endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/admin/personas-with-prompts`);
  console.log(`  POST http://localhost:${PORT}/admin/personas`);
  console.log(`  PUT  http://localhost:${PORT}/admin/personas/{personaCode}`);
  console.log(`  DEL  http://localhost:${PORT}/admin/personas/{personaCode}`);
  console.log(`  POST http://localhost:${PORT}/admin/system-prompt/test`);
  console.log(`  PUT  http://localhost:${PORT}/admin/system-prompt/{personaCode}`);
});

process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  server.close(() => {
    process.exit(0);
  });
});