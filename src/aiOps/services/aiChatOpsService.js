import axios from 'axios';

const API_BASE_URL = '/api/v1/devportal/ai-chatops';

const aiChatOpsService = {

  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Health check successful'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async getPersonas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/personas`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Personas loaded successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async getPersonaByCode(personaCode) {
    try {
      const response = await axios.get(`${API_BASE_URL}/personas/${personaCode}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Persona loaded successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async getSystemPrompt(personaCode) {
    try {
      const response = await axios.get(`${API_BASE_URL}/personas/${personaCode}/prompt`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'System prompt loaded successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async updateSystemPrompt(personaCode, systemPrompt) {
    try {
      const response = await axios.put(`${API_BASE_URL}/personas/${personaCode}/prompt`, {
        systemPrompt: systemPrompt
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'System prompt updated successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  // 🔧 수정: API 요청 필드명 표준화 (userQuery → userQuery)
  async sendMessage(messageData) {
    try {
      const requestBody = {
        personaCode: messageData.personaCode,
        userQuery: messageData.userQuery, // 🔧 표준화된 필드명
        sessionId: messageData.sessionId
      };

      if (messageData.queryHistory && messageData.queryHistory.length > 0) {
        requestBody.queryHistory = messageData.queryHistory;
      }

      const response = await axios.post(`${API_BASE_URL}/message/async`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      // 🔧 수정: 응답 구조 표준화
      return {
        success: true,
        data: {
          aiResponse: response.data.data?.aiResponse || response.data.data,
        },
        sessionId: response.data.sessionId || messageData.sessionId,
        message: response.data.message || 'Message sent successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  // 🔧 수정: 함수명 통일 (makeQuickQuestions → generateQuickQuestions)
  async generateQuickQuestions(questionData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/quick-questions`, {
        personaCode: questionData.personaCode,
        conversationContext: questionData.conversationContext,
        currentLanguage: questionData.currentLanguage
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      // 🔧 수정: 응답 구조 표준화
      return {
        success: true,
        data: {
          questions: this.parseQuickQuestions(response.data.data || response.data)
        },
        message: response.data.message || 'Quick questions generated successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  // 🔧 개선: 빠른 질문 파싱 로직 강화
  parseQuickQuestions(rawData) {
    if (!rawData) return [];
    
    try {
      let cleanData = rawData;
      
      if (typeof rawData === 'string') {
        cleanData = rawData.trim();
        
        // JSON 배열 패턴 매칭 (더 엄격한 검증)
        const jsonMatch = cleanData.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
        }
        
        // 줄바꿈 기반 파싱 (개선된 정규식)
        const lines = cleanData.split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.match(/^[\[\]\r\n\s\-\*]*$/))
          .map(line => line.replace(/^[0-9]+\.?\s*/, '').replace(/^["'\-\*•]\s*|["'\-\*•]\s*$/g, ''))
          .filter(line => line.length > 5) // 너무 짧은 질문 제외
          .slice(0, 5);
        
        return lines;
      }
      
      if (Array.isArray(rawData)) {
        return rawData.filter(q => q && q.trim() && q.trim().length > 5).slice(0, 5);
      }
      
      // 객체인 경우 questions 속성 확인
      if (rawData && typeof rawData === 'object') {
        const questions = rawData.questions || rawData.queries || rawData.data || [];
        return Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
      }
      
      return [];
    } catch (error) {
      console.warn('빠른 질문 파싱 실패:', error);
      return [];
    }
  },

  async getConversations(personaCode) {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations/${personaCode}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Conversations loaded successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async deleteConversations(personaCode) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/conversations/${personaCode}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Conversations deleted successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async sendFeedback(feedbackData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/feedback`, {
        rating: feedbackData.rating,
        feedbackPersona: feedbackData.feedbackPersona,
        comment: feedbackData.comment
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Feedback sent successfully'
      };

    } catch (error) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  // 🔧 개선: 페르소나 아이콘 매핑 강화
  getPersonaIcon(personaCode, iconPath) {
    if (iconPath && iconPath.trim()) {
      return iconPath.trim();
    }

    // 🎯 개선된 아이콘 매핑 (더 직관적이고 다양한 아이콘)
    const iconMap = {
      // 기술 관련
      'swdp_api': 'code',
      'technical_expert': 'cpu',
      'data_analyst': 'database',
      'security_expert': 'shield',
      'developer': 'terminal',
      'architect': 'compass',
      'devops': 'settings',
      
      // 비즈니스 관련
      'project': 'briefcase',
      'project_manager': 'target',
      'business_analyst': 'lightbulb',
      'consultant': 'award',
      'strategist': 'gem',
      'product_manager': 'rocket',
      
      // 지원 관련
      'personal_assistant': 'user',
      'user_support': 'users',
      'customer_service': 'mail',
      'operation_support': 'wrench',
      'voc': 'phone',
      'help_desk': 'message-circle',
      
      // 창작 관련
      'designer': 'palette',
      'content_creator': 'edit',
      'marketing': 'rocket',
      'researcher': 'brain',
      'teacher': 'book',
      'musician': 'music',
      'gamer': 'gamepad-2',
      'photographer': 'camera',
      
      // 메뉴/일반
      'swdp_menu': 'grid',
      'project_info': 'info',
      'general_inquiry': 'message-square-heart',
      'ai_assistant': 'robot',
      'magic_helper': 'sparkles',
      'innovation': 'star',
      'home_assistant': 'home-heart'
    };

    return iconMap[personaCode] || this.getRandomPersonaIcon(personaCode);
  },

  // 🔧 개선: 랜덤 아이콘 선택 알고리즘 강화
  getRandomPersonaIcon(personaCode) {
    const availableIcons = [
      // 기술
      'robot', 'brain', 'cpu', 'database', 'shield', 'terminal', 'code',
      // 비즈니스
      'compass', 'briefcase', 'target', 'lightbulb', 'award', 'gem', 'rocket',
      // 소셜
      'users', 'user', 'mail', 'phone', 'message-circle', 'heart',
      // 창작
      'palette', 'camera', 'music', 'book', 'edit', 'sparkles',
      // 유틸리티
      'settings', 'home', 'star', 'info', 'wrench', 'grid'
    ];
    
    const seed = this.hashCode(personaCode || 'default');
    const index = Math.abs(seed) % availableIcons.length;
    
    return availableIcons[index];
  },

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  },

  // 🔧 개선: 언어별 기본 질문 강화
  getQuickQuestions(personaCode, language) {
    const questionMap = {
      ko: {
        'swdp_menu': [
          '메뉴 구조를 알려주세요',
          '주요 기능은 무엇인가요?',
          '사용법을 안내해주세요'
        ],
        'project': [
          '프로젝트 현황을 보여주세요',
          '팀원 정보를 알려주세요',
          '진행 상황은 어떤가요?'
        ],
        'voc': [
          'VOC 현황을 확인해주세요',
          '최근 이슈는 무엇인가요?',
          '고객 만족도는 어떤가요?'
        ],
        'project_info': [
          '프로젝트 상세 정보',
          '기술 스택 정보',
          '로드맵을 알려주세요'
        ],
        'swdp_api': [
          'API 문서를 보여주세요',
          '인증 방법은?',
          '예제 코드를 알려주세요'
        ],
        'personal_assistant': [
          '개인 업무 일정을 정리해주세요',
          '오늘 할 일을 추천해주세요',
          '우선순위를 정해주세요'
        ],
        'operation_support': [
          '시스템 운영 현황을 확인해주세요',
          '모니터링 대시보드를 보여주세요',
          '장애 현황은 어떤가요?'
        ],
        'user_support': [
          '사용자 문의 현황은?',
          '자주 묻는 질문을 알려주세요',
          '해결책을 제안해주세요'
        ],
        'data_analyst': [
          '데이터 분석 결과를 요약해주세요',
          '트렌드 분석을 해주세요',
          '인사이트를 알려주세요'
        ],
        'technical_expert': [
          '기술 문서를 찾아주세요',
          '개발 가이드를 알려주세요',
          '모범 사례를 추천해주세요'
        ]
      },
      en: {
        'swdp_menu': [
          'Show me the menu structure',
          'What are the main features?',
          'Guide me through the usage'
        ],
        'project': [
          'Show project status',
          'Tell me about team members',
          'How is the progress?'
        ],
        'voc': [
          'Check VOC status',
          'What are recent issues?',
          'How is customer satisfaction?'
        ],
        'project_info': [
          'Project details',
          'Tech stack information',
          'Show me the roadmap'
        ],
        'swdp_api': [
          'Show API documentation',
          'How to authenticate?',
          'Provide example code'
        ],
        'personal_assistant': [
          'Organize my personal schedule',
          'Recommend today\'s tasks',
          'Help me prioritize'
        ],
        'operation_support': [
          'Check system operation status',
          'Show monitoring dashboard',
          'Any incidents or issues?'
        ],
        'user_support': [
          'What\'s the user inquiry status?',
          'Show me frequently asked questions',
          'Suggest solutions'
        ],
        'data_analyst': [
          'Summarize data analysis results',
          'Perform trend analysis',
          'Share insights'
        ],
        'technical_expert': [
          'Find technical documentation',
          'Show development guide',
          'Recommend best practices'
        ]
      }
    };

    return questionMap[language]?.[personaCode] || [];
  },

  // 🔧 개선: 대화 변환 로직 강화
  convertConversationsToMessages(conversations) {
    const messages = [];
    
    if (!Array.isArray(conversations)) {
      return messages;
    }

    conversations.forEach((conv, index) => {
      // 사용자 메시지 처리 (userQuery 우선, userQuery 대안)
      const userContent = conv.userQuery;
      if (userContent) {
        messages.push({
          id: `user-${index}-${Date.now()}`,
          type: 'user',
          content: userContent,
          timestamp: new Date(conv.createdDate || Date.now()).getTime(),
          isLoading: false
        });
      }

      // AI 응답 처리 (aiResponse 우선, aiQuery 대안)
      const aiContent = conv.aiResponse || conv.aiQuery;
      if (aiContent) {
        messages.push({
          id: `ai-${index}-${Date.now()}`,
          type: 'ai',
          content: aiContent,
          timestamp: new Date(conv.createdDate || Date.now()).getTime() + 1,
          isLoading: false,
          conversationId: conv.conversationId || conv.id
        });
      }
    });

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },

  // 🔧 개선: HTML 변환 로직 강화
  htmlToMarkdown(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return htmlContent;
    }

    let markdown = htmlContent;

    // 테이블 변환
    markdown = markdown.replace(/<div class="markdown-table-container">(.*?)<\/div>/gs, (match, tableContent) => {
      const tableMatch = tableContent.match(/<table[^>]*class="markdown-table"[^>]*>(.*?)<\/table>/s);
      if (!tableMatch) return '';
      
      const table = tableMatch[1];
      let result = '\n';
      
      // 헤더 처리
      const headerMatch = table.match(/<thead>(.*?)<\/thead>/s);
      if (headerMatch) {
        const headers = headerMatch[1].match(/<th[^>]*>(.*?)<\/th>/gs);
        if (headers) {
          const headerText = headers.map(h => this.stripHtml(h.replace(/<th[^>]*>|<\/th>/g, '')).trim()).join(' | ');
          result += `| ${headerText} |\n`;
          result += `| ${headers.map(() => '---').join(' | ')} |\n`;
        }
      }
      
      // 바디 처리
      const bodyMatch = table.match(/<tbody>(.*?)<\/tbody>/s);
      if (bodyMatch) {
        const rows = bodyMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gs);
        if (rows) {
          rows.forEach(row => {
            const cells = row.match(/<td[^>]*>(.*?)<\/td>/gs);
            if (cells) {
              const cellText = cells.map(c => this.stripHtml(c.replace(/<td[^>]*>|<\/td>/g, '')).trim()).join(' | ');
              result += `| ${cellText} |\n`;
            }
          });
        }
      }
      
      return result + '\n';
    });

    // 헤딩 변환
    markdown = markdown.replace(/<h([1-6])[^>]*class="markdown-heading[^"]*"[^>]*>(.*?)<\/h[1-6]>/gs, (match, level, content) => {
      const text = this.stripHtml(content).trim();
      return '\n' + '#'.repeat(parseInt(level)) + ' ' + text + '\n\n';
    });

    // 문단 변환
    markdown = markdown.replace(/<p[^>]*class="markdown-paragraph"[^>]*>(.*?)<\/p>/gs, (match, content) => {
      return this.stripHtml(content).trim() + '\n\n';
    });

    // 굵은 글씨 변환
    markdown = markdown.replace(/<strong[^>]*class="markdown-strong"[^>]*>(.*?)<\/strong>/gs, (match, content) => {
      return '**' + this.stripHtml(content).trim() + '**';
    });

    // 인라인 코드 변환
    markdown = markdown.replace(/<code[^>]*class="markdown-inline-code"[^>]*>(.*?)<\/code>/gs, (match, content) => {
      return '`' + this.stripHtml(content).trim() + '`';
    });

    // 코드 블록 변환
    markdown = markdown.replace(/<div[^>]*class="markdown-code-block"[^>]*>(.*?)<\/div>/gs, (match, content) => {
      const langMatch = content.match(/<div[^>]*class="language-label"[^>]*>(.*?)<\/div>/);
      const codeMatch = content.match(/<pre><code>(.*?)<\/code><\/pre>/s);
      
      if (codeMatch) {
        const language = langMatch ? this.stripHtml(langMatch[1]).trim() : '';
        const code = this.stripHtml(codeMatch[1]);
        return '\n```' + language + '\n' + code + '\n```\n\n';
      }
      return '';
    });

    // 리스트 변환
    markdown = markdown.replace(/<ul[^>]*class="markdown-list"[^>]*>(.*?)<\/ul>/gs, (match, content) => {
      const items = content.match(/<li[^>]*class="markdown-list-item"[^>]*>(.*?)<\/li>/gs);
      if (items) {
        return '\n' + items.map(item => {
          const text = this.stripHtml(item.replace(/<li[^>]*>|<\/li>/g, '')).trim();
          return '- ' + text;
        }).join('\n') + '\n\n';
      }
      return '';
    });

    // 알림 박스 변환
    markdown = markdown.replace(/<div[^>]*class="markdown-alert[^"]*"[^>]*>(.*?)<\/div>/gs, (match, content) => {
      const text = this.stripHtml(content).replace(/^[^\w]*/, '').trim();
      return '\n> ' + text + '\n\n';
    });

    // HTML 태그 제거
    markdown = this.stripHtml(markdown);

    // 중복 줄바꿈 정리
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    return markdown;
  },

  htmlToPlainText(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return htmlContent;
    }

    let text = htmlContent;

    // 테이블을 탭으로 구분된 텍스트로 변환
    text = text.replace(/<div class="markdown-table-container">(.*?)<\/div>/gs, (match, tableContent) => {
      const tableMatch = tableContent.match(/<table[^>]*>(.*?)<\/table>/s);
      if (!tableMatch) return '';
      
      const table = tableMatch[1];
      let result = '\n';
      
      // 헤더 처리
      const headerMatch = table.match(/<thead>(.*?)<\/thead>/s);
      if (headerMatch) {
        const headers = headerMatch[1].match(/<th[^>]*>(.*?)<\/th>/gs);
        if (headers) {
          result += headers.map(h => this.stripHtml(h.replace(/<th[^>]*>|<\/th>/g, '')).trim()).join('\t') + '\n';
        }
      }
      
      // 바디 처리
      const bodyMatch = table.match(/<tbody>(.*?)<\/tbody>/s);
      if (bodyMatch) {
        const rows = bodyMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gs);
        if (rows) {
          rows.forEach(row => {
            const cells = row.match(/<td[^>]*>(.*?)<\/td>/gs);
            if (cells) {
              result += cells.map(c => this.stripHtml(c.replace(/<td[^>]*>|<\/td>/g, '')).trim()).join('\t') + '\n';
            }
          });
        }
      }
      
      return result;
    });

    // 헤딩을 줄바꿈으로 구분
    text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs, (match, content) => {
      return '\n' + this.stripHtml(content).trim() + '\n';
    });

    // 문단을 줄바꿈으로 구분
    text = text.replace(/<p[^>]*>(.*?)<\/p>/gs, (match, content) => {
      return this.stripHtml(content).trim() + '\n';
    });

    // 리스트 아이템을 불릿으로 표시
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gs, (match, content) => {
      return '• ' + this.stripHtml(content).trim() + '\n';
    });

    // 코드 블록 처리
    text = text.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, (match, content) => {
      return '\n' + this.stripHtml(content) + '\n';
    });

    // HTML 태그 제거
    text = this.stripHtml(text);

    // 중복 줄바꿈 정리
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return text;
  },

  stripHtml(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  },

  // 🔧 개선: 에러 메시지 처리 강화
  getErrorMessage(error) {
    // HTTP 상태 코드 처리
    if (error?.response?.status) {
      const status = error.response.status;
      const statusMessages = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        408: 'REQUEST_TIMEOUT',
        429: 'RATE_LIMITED',
        500: 'INTERNAL_SERVER_ERROR',
        502: 'BAD_GATEWAY',
        503: 'SERVICE_UNAVAILABLE',
        504: 'GATEWAY_TIMEOUT'
      };
      
      return statusMessages[status] || `HTTP_${status}`;
    }

    // 네트워크 에러 처리
    if (error?.request) {
      return error.code || 'NETWORK_ERROR';
    }

    // 일반 에러 처리
    return error?.message || 'UNKNOWN_ERROR';
  }
};

export default aiChatOpsService;