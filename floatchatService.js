

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
            { categoryId: 1, categoryCode: 'swdp_menu', description: 'SWDP 메뉴', descriptionEn: 'SWDP Menu', iconPath: 'apps' },
            { categoryId: 2, categoryCode: 'project', description: '프로젝트', descriptionEn: 'Project', iconPath: 'folder' },
            { categoryId: 3, categoryCode: 'voc', description: 'VOC', descriptionEn: 'VOC', iconPath: 'headphones' },
            { categoryId: 4, categoryCode: 'project_info', description: '프로젝트 정보', descriptionEn: 'Project Info', iconPath: 'info-circle' },
            { categoryId: 5, categoryCode: 'swdp_api', description: 'SWDP API', descriptionEn: 'SWDP API', iconPath: 'code-branch' }
          ],
          message: 'Mock categories loaded successfully'
        });
      }, 500); // 0.5-second delay
    });
  },

  // Simulate sending a message and receiving a mock response
  async sendMessage(messageData, useAsync = false) {
    console.log("Mock sendMessage called with:", messageData);
    return new Promise(resolve => {
      setTimeout(() => {
        const response = {
          success: true,
          aiResponse: `This is a mock response to your question: "${messageData.userQuestion}". The category is ${messageData.categoryCode}.`,
          conversationId: `conv-${Date.now()}`,
          sessionId: `session-${messageData.categoryCode}`,
          message: 'Mock message sent successfully'
        };
        resolve(response);
      }, 1500); // 1.5-second delay to simulate AI thinking
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
      'swdp_menu': 'apps',
      'project': 'folder',
      'voc': 'headphones',
      'project_info': 'info-circle',
      'swdp_api': 'code-branch'
    };
    return iconMap[categoryCode] || 'comment';
  },

  getQuickQuestions(categoryCode, language) {
    const questionMap = {
      ko: {
        'swdp_menu': ['메뉴 구조 알려줘', '주요 기능이 뭐야?'],
        'project': ['프로젝트 현황 보여줘', '팀원 정보 알려줘'],
        'voc': ['VOC 현황 확인해줘', '최근 이슈는?'],
      },
      en: {
        'swdp_menu': ['Show menu structure', 'What are the main features?'],
        'project': ['Show project status', 'Tell me team members'],
        'voc': ['Check VOC status', 'Recent issues?'],
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

// In a real module environment, you'd use `export default`.
// For this browser-based mock, we'll just make it globally accessible if needed,
// but http-vue-loader and the script module should handle scoping correctly.
window.floatChatService = floatChatService;
export default floatChatService;
