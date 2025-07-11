const i18nResources = {
  ko: {
    online: '온라인',
    offline: '오프라인',
    openChat: '채팅 창 열기',
    closeChat: '채팅 창 닫기',
    minimize: '최소화',
    maximize: '최대화',
    restore: '복원',
    close: '닫기',
    back: '뒤로',
    cancel: '취소',
    home: '홈',
    goHome: '홈으로 가기',
    
    welcomeTitle: '안녕하세요. 학습형 AIOps Chat 입니다.',
    welcomeMessage: '다양한 서비스를 이용해보세요. 많이 사용하고, 피드백 주실 수록 향상된 결과를 얻을 수 있습니다.',
    
    personalCategory: '개인 특화',
    personalCategoryDesc: '개인 맞춤형 AI 어시스턴트',
    userCategory: '일반 문의',
    userCategoryDesc: '사용자 지원 및 문의 응답',
    devopsCategory: '운영/관리',
    devopsCategoryDesc: '시스템 운영 및 관리 지원',
    
    selectPersona: '페르소나를 선택해주세요',
    selectPersonaDesc: 'Persona(전문가)를 선택해주세요',
    loadingPersonas: 'Persona 목록 불러오는 중...',
    noPersonas: '사용 가능한 Persona가 없습니다',
    noPersonasDesc: '이 카테고리에는 아직 Persona가 없습니다',
    defaultPersonaDesc: '전문적인 도움을 제공합니다',
    
    loadingHistory: '대화 기록 불러오는 중...',
    change: '변경',
    clearAll: '전체 삭제',
    quickQuestions: '빠른 질문',
    continuousChat: '연속 대화',
    generateQuestions: '질문 생성하기',
    noPersonaSelected: '페르소나를 선택해주세요',
    noPersonaDesc: '홈 화면에서 원하는 페르소나를 선택하여 시작하세요',
    welcomeChat: '{persona} 전문가, AIOps Chat입니다!',
    welcomeTip: '빠른 질문을 통해서 다양한 질문을 해보세요',
    inputPlaceholder: '질문을 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)',
    copySuccess: '클립보드에 복사되었습니다!',
    
    aiError: '응답 생성 중 오류가 발생했어요.',
    networkError: '일시적인 오류가 발생했어요. 다시 시도해주세요.',
    
    sendFeedback: '피드백 보내기',
    feedbackTitle: '피드백 보내기',
    feedbackDescription: '서비스 개선을 위해 소중한 의견을 들려주세요.',
    ratingLabel: '서비스 만족도',
    feedbackComment: '피드백 의견',
    commentPlaceholder: '서비스에 대한 의견이나 개선사항을 자유롭게 작성해주세요.\n\n• 좋았던 점이나 아쉬웠던 점\n• 개선되었으면 하는 기능\n• 추가로 필요한 기능 등',
    submitFeedback: '피드백 보내기',
    feedbackSuccess: '피드백 전송 완료',
    sendAnother: '다른 피드백 보내기',
    
    ratingTexts: ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음']
  },
  
  en: {
    online: 'Online',
    offline: 'Offline',
    openChat: 'Open Chat',
    closeChat: 'Close Chat',
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    home: 'Home',
    goHome: 'Go Home',
    
    welcomeTitle: 'Hello. Welcome to Learning AIOps Chat.',
    welcomeMessage: 'Try various services. The more you use and provide feedback, the better results you can get.',
    
    personalCategory: 'Personal',
    personalCategoryDesc: 'Personalized AI assistant',
    userCategory: 'General Support',
    userCategoryDesc: 'User support and inquiry response',
    devopsCategory: 'Operations',
    devopsCategoryDesc: 'System operation and management support',
    
    selectPersona: 'Please select a persona',
    selectPersonaDesc: 'Choose your Persona (Expert)',
    loadingPersonas: 'Loading persona list...',
    noPersonas: 'No personas available',
    noPersonasDesc: 'There are no personas in this category yet',
    defaultPersonaDesc: 'Provides professional assistance',
    
    loadingHistory: 'Loading conversation history...',
    change: 'Change',
    clearAll: 'Clear All',
    quickQuestions: 'Quick Questions',
    continuousChat: 'Continuous Chat',
    generateQuestions: 'Generate Questions',
    noPersonaSelected: 'Please select a persona',
    noPersonaDesc: 'Choose your desired persona from the home screen to get started',
    welcomeChat: 'I am AIOps Chat, an expert in {persona}!',
    welcomeTip: 'Try various questions through quick questions',
    inputPlaceholder: 'Enter your question... (Enter: Send, Shift+Enter: New line)',
    copySuccess: 'Copied to clipboard!',
    
    aiError: 'An error occurred while generating the response.',
    networkError: 'A temporary error occurred. Please try again.',
    
    sendFeedback: 'Send Feedback',
    feedbackTitle: 'Send Feedback',
    feedbackDescription: 'Please share your valuable opinions to help us improve our service.',
    ratingLabel: 'Service Satisfaction',
    feedbackComment: 'Feedback Comments',
    commentPlaceholder: 'Please freely write your opinions or suggestions about the service.\n\n• What you liked or found lacking\n• Features you\'d like to see improved\n• Additional features needed, etc.',
    submitFeedback: 'Send Feedback',
    feedbackSuccess: 'Feedback Sent Successfully',
    sendAnother: 'Send Another Feedback',
    
    ratingTexts: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
  }
};

export function getText(language, key, params = {}) {
  let text = i18nResources[language]?.[key] || key;
  
  if (params && typeof text === 'string') {
    Object.keys(params).forEach(paramKey => {
      const regex = new RegExp(`{${paramKey}}`, 'g');
      text = text.replace(regex, params[paramKey]);
    });
  }
  
  return text;
}

export function getTextArray(language, key) {
  return i18nResources[language]?.[key] || [];
}

export default i18nResources;