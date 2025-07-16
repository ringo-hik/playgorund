/**
 * E2E 테스트용 로깅 검증 스크립트
 * 브라우저 콘솔에서 다음 명령어를 실행하여 로깅 상태를 확인할 수 있습니다.
 */

// 콘솔 로그 필터링 함수
function filterConsoleLogs(keyword) {
  return console.log(`콘솔에서 "${keyword}"를 포함한 로그를 찾으려면 브라우저 개발자 도구의 콘솔 탭에서 검색하세요.`);
}

// 컴포넌트 상태 검증 함수
function validateComponentState() {
  const app = document.querySelector('.ai-chatops-chat');
  if (!app) {
    console.error('❌ AI ChatOps 컴포넌트를 찾을 수 없습니다.');
    return false;
  }
  
  const chatButton = app.querySelector('.ai-chatops-chat-button');
  const chatWindow = app.querySelector('.ai-chatops-chat-window');
  
  console.log('🔍 컴포넌트 상태 검증:', {
    hasChatButton: !!chatButton,
    hasChatWindow: !!chatWindow,
    chatWindowVisible: chatWindow ? chatWindow.style.display !== 'none' : false,
    chatButtonActive: chatButton ? chatButton.classList.contains('is-active') : false
  });
  
  return true;
}

// 페르소나 데이터 검증 함수
function validatePersonaData() {
  const vueApp = document.querySelector('.ai-chatops-chat').__vue__;
  if (!vueApp) {
    console.error('❌ Vue 인스턴스를 찾을 수 없습니다.');
    return false;
  }
  
  const personas = vueApp.personas;
  const filteredPersonas = vueApp.filteredPersonas;
  
  console.log('📊 페르소나 데이터 검증:', {
    totalPersonas: personas ? personas.length : 0,
    filteredPersonas: filteredPersonas ? filteredPersonas.length : 0,
    selectedCategory: vueApp.selectedCategory,
    currentView: vueApp.currentView,
    loadingPersonas: vueApp.loadingPersonas
  });
  
  if (personas && personas.length > 0) {
    console.log('✅ 페르소나 데이터 샘플:', personas.slice(0, 3).map(p => ({
      code: p.personaCode,
      title: p.title,
      category: p.category
    })));
  }
  
  return true;
}

// 채팅 상태 검증 함수
function validateChatState() {
  const chatTab = document.querySelector('.chat-tab');
  if (!chatTab) {
    console.log('ℹ️ 채팅 탭이 현재 활성화되어 있지 않습니다.');
    return false;
  }
  
  const vueApp = chatTab.__vue__;
  if (!vueApp) {
    console.error('❌ 채팅 탭의 Vue 인스턴스를 찾을 수 없습니다.');
    return false;
  }
  
  console.log('💬 채팅 상태 검증:', {
    selectedPersona: vueApp.selectedPersona ? vueApp.selectedPersona.personaCode : null,
    messagesCount: vueApp.messages ? vueApp.messages.length : 0,
    isProcessing: vueApp.isProcessing,
    loadingHistory: vueApp.loadingHistory,
    showQuickQuestions: vueApp.showQuickQuestions,
    quickQuestionsCount: vueApp.quickQuestions ? vueApp.quickQuestions.length : 0
  });
  
  return true;
}

// 전체 검증 함수
function runE2ELoggingValidation() {
  console.log('🚀 E2E 로깅 검증 시작');
  console.log('=====================================');
  
  try {
    validateComponentState();
    validatePersonaData();
    validateChatState();
    
    console.log('=====================================');
    console.log('✅ E2E 로깅 검증 완료');
    console.log('💡 이제 UI를 조작하면서 콘솔 로그를 확인해보세요:');
    console.log('   1. 채팅 버튼 클릭');
    console.log('   2. 카테고리 선택');
    console.log('   3. 페르소나 선택');
    console.log('   4. 메시지 전송');
    console.log('   5. 빠른 질문 생성');
    
    // 로그 필터링 가이드
    console.log('=====================================');
    console.log('🔍 로그 필터링 가이드:');
    console.log('   - [AIChatOpsLayout] 검색: 메인 컴포넌트 로그');
    console.log('   - [ChatTab] 검색: 채팅 탭 로그');
    console.log('   - [aiChatOpsService] 검색: API 서비스 로그');
    console.log('   - ❌ 검색: 에러 로그');
    console.log('   - ⚠️ 검색: 경고 로그');
    console.log('   - ✅ 검색: 성공 로그');
    
  } catch (error) {
    console.error('❌ E2E 로깅 검증 중 오류 발생:', error);
  }
}

// 자동 실행 (3초 후)
setTimeout(() => {
  runE2ELoggingValidation();
}, 3000);

// 전역 함수로 노출
window.runE2ELoggingValidation = runE2ELoggingValidation;
window.validateComponentState = validateComponentState;
window.validatePersonaData = validatePersonaData;
window.validateChatState = validateChatState;

console.log('📝 E2E 로깅 검증 스크립트 로드 완료');
console.log('💡 수동 실행: runE2ELoggingValidation()');