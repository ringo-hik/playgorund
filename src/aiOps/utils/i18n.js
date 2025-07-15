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
    
    aiChatOpsTitle: 'AIChatOps',
    welcomeTitle: '안녕하세요. 학습형 AIChatOps 입니다.',
    welcomeMessage: '다양한 서비스를 이용해보세요. 많이 사용하고, 피드백 주실 수록 향상된 결과를 얻을 수 있습니다.',
    
    personalCategory: '개인 특화',
    personalCategoryDesc: '개인 맞춤형 AI 어시스턴트',
    generalCategory: '일반 문의',
    generalCategoryDesc: '사용자 지원 및 문의 응답',
    operationCategory: '운영/관리',
    operationCategoryDesc: '시스템 운영 및 관리 지원',
    
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
    quickQuestionGenerated: '빠른 질문이 생성되었습니다',
    quickQuestionError: '빠른 질문 생성 중 오류가 발생했습니다',
    quickQuestionLoading: '빠른 질문을 생성하고 있습니다...',
    
    noPersonaSelected: '페르소나를 선택해주세요',
    noPersonaDesc: '홈 화면에서 원하는 페르소나를 선택하여 시작하세요',
    welcomeChat: '{persona} 전문가, AIChatOps입니다!',
    welcomeTip: '빠른 질문을 통해서 다양한 질문을 해보세요',
    inputPlaceholder: '질문을 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)',
    copySuccess: '클립보드에 복사되었습니다!',
    improvePrompt: '프롬프트 개선',
    
    justNow: '방금 전',
    minutesAgo: '{minutes}분 전',
    hoursAgo: '{hours}시간 전',
    
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
    
    easterEgg: '이스터 에그 ',
    
    ratingTexts: ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'],

    loadingMessages: [
  "프롬프트 생성 중...",
  "희미하게 반짝이는 중...",
  "클라우드화 중...",
  "GPT 몰래 물어 보는 중...",
  "클로드 훔쳐보는 중...",
  "미스트랄 중… le vent pense encore…",
  "큐닝 중…。",
  "라마 소환 중...",
  "통찰 시도 중...",
  "깊이를 탐색 중...",
  "생각이 폭발하는 중...",
  "의식을 융합 중...",
  "뉴런 연결 중...",
  "토큰 추출 중...",
  "의미 임베딩 중...",
  "잠재 공간 확장 중...",
  "꿈의 루프 진입 중...",
  "시냅스 연결 중...",
  "추론 계산 중...",
  "속삭임 수신 중...",
  "수다 조립 중...",
  "이성적 구성 중...",
  "환각 생성 중...",
  "반응 구조화 중...",
  "추측 기반 정리 중...",
  "심사숙고 중...",
  "하이프 발생 중...",
  "부동 코딩 중...",
  "지나치게 고민 중...",
  "이해하려 노력 중...",
  "신비화 중...",
  "공간 왜곡 중...",
  "암호 해독 중...",
  "다시 토큰화 중...",
  "다중 우주 확장 중...",
  "벡터 정렬 중...",
  "확장 처리 중...",
  "맥락 정렬 중...",
  "구조 해체 중..."
    ]
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
    
    aiChatOpsTitle: 'AIChatOps',
    welcomeTitle: 'Hello. Welcome to Learning AIChatOps.',
    welcomeMessage: 'Try various services. The more you use and provide feedback, the better results you can get.',
    
    personalCategory: 'Personal',
    personalCategoryDesc: 'Personalized AI assistant',
    generalCategory: 'General Support',
    generalCategoryDesc: 'User support and inquiry response',
    operationCategory: 'Operations',
    operationCategoryDesc: 'System operation and management support',
    
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
    quickQuestionGenerated: 'Quick questions have been generated',
    quickQuestionError: 'An error occurred while generating quick questions',
    quickQuestionLoading: 'Generating quick questions...',
    
    noPersonaSelected: 'Please select a persona',
    noPersonaDesc: 'Choose your desired persona from the home screen to get started',
    welcomeChat: 'I am AIChatOps, an expert in {persona}!',
    welcomeTip: 'Try various questions through quick questions',
    inputPlaceholder: 'Enter your question... (Enter: Send, Shift+Enter: New line)',
    copySuccess: 'Copied to clipboard!',
    improvePrompt: 'Improve Prompt',
    
    justNow: 'Just now',
    minutesAgo: '{minutes} minutes ago',
    hoursAgo: '{hours} hours ago',
    
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
    
    easterEgg: 'Easter Egg ',
    
    ratingTexts: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],

    loadingMessages: [
  "Prompting...",
  "Glimmering...",
  "Clauding...",
  "Gemining...",
  "Gpting...",
  "Barding...",
  "Claudeing...",
  "Mistraling...",
  "Qwening...",
  "Llamaing...",
  "Groking...",
  "Deepseeking...",
  "Thinksploding...",
  "Mindfusing...",
  "Neuroning...",
  "Tokening...",
  "Embedding...",
  "Latenting...",
  "Dreamlooping...",
  "Synapsing...",
  "Inferencing...",
  "Whispering...",
  "Chatterizing...",
  "Reasonizing...",
  "Hallucinating...",
  "Reactivizing...",
  "Speculativing...",
  "Cogitating...",
  "Hypething...",
  "Floatcoding...",
  "Overthinking...",
  "Understanding...",
  "Mystifying...",
  "Warping...",
  "Decoding...",
  "Retokenizing...",
  "Multiversing...",
  "Vectorizing...",
  "Expanding...",
  "Contextualizing...",
  "Unstructuring..."
    ]
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