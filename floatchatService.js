

// Mock floatchatService.js for frontend testing without a real backend.

const floatChatService = {

  // Simulate a successful health check
  async healthCheck() {
    return Promise.resolve({ success: true });
  },

  // Return mock categories after a short delay
  async getCategories() {
    console.log("Mock getCategories called");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { 
              categoryId: 1, 
              categoryCode: 'general', 
              description: '일반 문의', 
              descriptionEn: 'General Inquiry', 
              iconPath: 'comment' 
            },
            { 
              categoryId: 2, 
              categoryCode: 'technical', 
              description: '기술 지원', 
              descriptionEn: 'Technical Support', 
              iconPath: 'cog' 
            },
            { 
              categoryId: 3, 
              categoryCode: 'business', 
              description: '비즈니스 상담', 
              descriptionEn: 'Business Consultation', 
              iconPath: 'briefcase' 
            },
            { 
              categoryId: 4, 
              categoryCode: 'product', 
              description: '제품 정보', 
              descriptionEn: 'Product Information', 
              iconPath: 'box' 
            },
            { 
              categoryId: 5, 
              categoryCode: 'account', 
              description: '계정 관리', 
              descriptionEn: 'Account Management', 
              iconPath: 'user' 
            },
            { 
              categoryId: 6, 
              categoryCode: 'billing', 
              description: '결제/청구', 
              descriptionEn: 'Billing', 
              iconPath: 'credit-card' 
            }
          ],
          message: 'Mock categories loaded successfully'
        });
      }, 300); // 0.3-second delay
    });
  },

  // Simulate sending a message and receiving a mock response
  async sendMessage(messageData, useAsync = false) {
    console.log("Mock sendMessage called with:", messageData);
    return new Promise(resolve => {
      setTimeout(() => {
        const mockResponses = {
          'general': [
            '안녕하세요! 저희 서비스에 대해 문의해주셔서 감사합니다. 🙂\n\n저희는 고객의 다양한 요청에 신속하고 정확하게 대응하는 AI 챗봇 서비스를 제공하고 있습니다.',
            '무엇이든 궁금한 점이 있으시면 언제든지 말씀해주세요! 최선을 다해 도움을 드리겠습니다.',
            '일반적인 문의사항에 대해 24시간 자동 응답 서비스를 제공하고 있습니다.'
          ],
          'technical': [
            '기술적인 문제가 발생하셨나요? 🔧\n\n다음 단계를 차례대로 시도해보시기 바랍니다:\n\n1. 브라우저 캐시 삭제\n2. 페이지 새로고침\n3. 다른 브라우저로 접속 시도',
            '시스템 요구사항: Chrome 80+, Firefox 75+, Safari 13+\n최적 해상도: 1280x720 이상',
            '기술 지원팀에 연결해드릴까요? 전문 엔지니어가 직접 도움을 드리겠습니다.'
          ],
          'business': [
            '비즈니스 상담에 관심을 가져주셔서 감사합니다! 💼\n\n저희는 다양한 업계의 파트너와 함께 성장하고 있습니다.',
            '맞춤형 솔루션을 제안해드릴 수 있습니다. 구체적인 요구사항을 알려주시면 전담 컨설턴트가 연락드리겠습니다.',
            '파트너십 프로그램: 리셀러, 기술 파트너, 솔루션 파트너 등 다양한 협력 방안이 있습니다.'
          ],
          'product': [
            '제품에 대해 문의해주셔서 감사합니다! 📦\n\n주요 기능:\n• 실시간 채팅 지원\n• 다국어 서비스\n• 맞춤형 응답\n• 24/7 가용성',
            '가격 정보는 사용량과 기능에 따라 달라집니다. 무료 체험판부터 시작해보세요!',
            '제품 데모를 원하시나요? 라이브 데모 세션을 예약해드릴 수 있습니다.'
          ],
          'account': [
            '계정 관리와 관련된 문의이시군요! 👤\n\n다음 메뉴에서 설정을 변경하실 수 있습니다:\n• 프로필 설정\n• 보안 설정\n• 알림 설정',
            '비밀번호 변경은 로그인 후 설정 > 보안에서 가능합니다. 이메일 인증이 필요합니다.',
            '계정에 문제가 있으시면 support@company.com으로 연락주시거나 고객센터(1588-0000)로 문의해주세요.'
          ],
          'billing': [
            '결제 및 청구 관련 문의이시군요! 💳\n\n지원 결제 수단:\n• 신용카드\n• 계좌이체\n• 가상계좌\n• PayPal',
            '청구서는 매월 1일에 이메일로 발송됩니다. 마이페이지에서도 확인 가능합니다.',
            '결제 문제가 있으시면 재무팀(billing@company.com)으로 직접 연락주시기 바랍니다.'
          ]
        };

        const categoryResponses = mockResponses[messageData.categoryCode] || mockResponses['general'];
        const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

        const response = {
          success: true,
          aiResponse: randomResponse,
          conversationId: `conv-${Date.now()}`,
          sessionId: `session-${messageData.categoryCode}`,
          message: 'Mock message sent successfully'
        };
        resolve(response);
      }, 1200 + Math.random() * 800); // 1.2~2초 랜덤 지연
    });
  },

  // Return empty conversation history
  async getConversations(categoryCode) {
    console.log("Mock getConversations called for:", categoryCode);
    return Promise.resolve({
      success: true,
      data: [],
      message: 'Mock conversations loaded successfully'
    });
  },

  // Simulate sending feedback successfully
  async sendFeedback(feedbackData) {
    console.log("Mock sendFeedback called with:", feedbackData);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '피드백이 성공적으로 전송되었습니다. (Mock)'
        });
      }, 500);
    });
  },

  // --- Helper functions (no changes needed) ---

  getCategoryIcon(categoryCode, iconPath) {
    if (iconPath && iconPath.trim()) {
      return iconPath.trim();
    }
    const iconMap = {
      'general': 'comment',
      'technical': 'cog',
      'business': 'briefcase',
      'product': 'box',
      'account': 'user',
      'billing': 'credit-card'
    };
    return iconMap[categoryCode] || 'comment';
  },

  getQuickQuestions(categoryCode, language) {
    const questionMap = {
      ko: {
        'general': ['서비스 소개해줘', '어떤 도움을 받을 수 있나요?'],
        'technical': ['기술적 문제 해결 방법', '시스템 요구사항 알려줘'],
        'business': ['비즈니스 플랜 문의', '파트너십 가능한가요?'],
        'product': ['제품 기능 설명', '가격 정보 알려줘'],
        'account': ['계정 설정 방법', '비밀번호 변경하기'],
        'billing': ['결제 방법 문의', '청구서 확인하기']
      },
      en: {
        'general': ['Tell me about the service', 'What kind of help can I get?'],
        'technical': ['Technical troubleshooting', 'System requirements'],
        'business': ['Business plan inquiry', 'Partnership opportunities'],
        'product': ['Product features', 'Pricing information'],
        'account': ['Account settings', 'Password reset'],
        'billing': ['Payment methods', 'Check invoice']
      }
    };
    return questionMap[language]?.[categoryCode] || [];
  },

  convertConversationsToMessages(conversations) {
    const messages = [];
    if (!Array.isArray(conversations)) return messages;
    conversations.forEach((conv, index) => {
      if (conv.userQuestion) {
        messages.push({ id: `user-${conv.conversationId}-${index}`, type: 'user', content: conv.userQuestion, timestamp: new Date(conv.createdDate).getTime(), isLoading: false });
      }
      if (conv.aiResponse) {
        messages.push({ id: `ai-${conv.conversationId}-${index}`, type: 'ai', content: conv.aiResponse, timestamp: new Date(conv.createdDate).getTime() + 1, isLoading: false, conversationId: conv.conversationId });
      }
    });
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },

  convertMarkdownTableToHtml(content) {
    if (!content || typeof content !== 'string') return content;
    // This is a simplified mock version. A full implementation is complex.
    // For the mock, we'll just wrap the content in a div.
    return `<div class="markdown-content">${content.replace(/\n/g, '<br>')}</div>`;
  },
  
  convertMessageToText(message) {
    if (!message || !message.content) return '';
    // Simple mock, just strip potential HTML tags for copying
    return message.content.replace(/<[^>]*>/g, '');
  },

  getErrorMessage(error) {
    return 'An unknown mock error occurred.';
  }
};

// Make it globally accessible for the browser environment
window.floatChatService = floatChatService;
