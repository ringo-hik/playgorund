import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// POST /message-async 핸들러
server.post('/message-async', (req, res) => {
  console.log('POST /message-async received:', req.body);
  
  const { personaCode, userQuery, category, previousReport } = req.body;
  
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
      
      responseData = `# 주간 업무 보고서

**보고 기간**: ${weekStart.toLocaleDateString('ko-KR')} ~ ${weekEnd.toLocaleDateString('ko-KR')}
**작성자**: VSCode Extension 사용자
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
    
    res.json({
      success: true,
      data: responseData,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      metadata: {
        personaCode,
        category,
        hasUserQuery: !!userQuery,
        hasPreviousReport: !!previousReport
      }
    });
  } else {
    // 다른 페르소나나 카테고리는 기본 응답
    res.json({
      success: true,
      data: "처리되지 않은 페르소나입니다. Extension 카테고리의 weekly_report 페르소나만 지원됩니다.",
      sessionId: `session_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }
});

// 다른 모든 요청은 기본 JSON Server 라우터로 처리
server.use(router);

const port = 3004;
server.listen(port, () => {
  console.log(`SWDP ChatOps Mock API Server is running on port ${port}`);
  console.log(`Available endpoints:`);
  console.log(`  POST http://localhost:${port}/message-async`);
  console.log(`  GET  http://localhost:${port}/health`);
  console.log(`  GET  http://localhost:${port}/personas`);
});