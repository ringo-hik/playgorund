import axios from 'axios';

const API_BASE_URL = '/api/v1/devportal/float-chat';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  response => {
    // 성공적인 응답은 그대로 반환
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message
    };
  },
  error => {
    // 에러 처리
    return Promise.reject({
      success: false,
      errorMessage: getErrorMessage(error),
      error: error
    });
  }
);

const floatChatService = {

  async healthCheck() {
    return apiClient.get('/health', { timeout: 10000 });
  },

  async getPersonas() {
    return apiClient.get('/personas', { timeout: 15000 });
  },

  async getPersonasByCategory(category) {
    const response = await apiClient.get('/personas', { params: { category }, timeout: 15000 });
    if (response.success) {
      let personas = response.data;
      if (Array.isArray(personas) && category) {
        personas = personas.filter(persona => {
          return persona.category === category || 
                 persona.personaCode.includes(category) ||
                 (persona.tags && persona.tags.includes(category));
        });
        response.data = personas;
      }
    }
    return response;
  },

  async getPersonaByCode(personaCode) {
    return apiClient.get(`/personas/${personaCode}`, { timeout: 10000 });
  },

  async getSystemPrompt(personaCode) {
    return apiClient.get(`/personas/${personaCode}/prompt`, { timeout: 10000 });
  },

  async updateSystemPrompt(personaCode, systemPrompt) {
    return apiClient.put(`/personas/${personaCode}/prompt`, { systemPrompt }, { timeout: 20000 });
  },

  async sendMessage(messageData, useAsync = false) {
    const endpoint = useAsync ? '/message/async' : '/message';
    return apiClient.post(endpoint, messageData, { timeout: 60000 });
  },

  async getConversations(personaCode) {
    return apiClient.get(`/conversations/${personaCode}`, { timeout: 15000 });
  },

  async deleteConversations(personaCode) {
    return apiClient.delete(`/conversations/${personaCode}`, { timeout: 15000 });
  },

  async sendFeedback(feedbackData) {
    return apiClient.post('/feedback', feedbackData, { timeout: 20000 });
  },

  // 카테고리 관련 유틸리티 함수들
  getCategoryInfo(categoryCode) {
    const categoryMap = {
      'devops': {
        name: '개발운영',
        nameEn: 'DevOps',
        icon: 'cog',
        color: 'burgundy',
        description: '시스템 개발 및 운영 지원',
        descriptionEn: 'System development and operation support'
      },
      'user': {
        name: '사용자 지원',
        nameEn: 'User Support',
        icon: 'users-alt',
        color: 'sapphire', 
        description: '사용자 지원 및 문의 응답',
        descriptionEn: 'User support and inquiry response'
      },
      'personal': {
        name: '개인화',
        nameEn: 'Personal',
        icon: 'user',
        color: 'emerald',
        description: '개인 맞춤형 AI 어시스턴트',
        descriptionEn: 'Personalized AI assistant'
      }
    };
    
    return categoryMap[categoryCode] || {
      name: categoryCode,
      nameEn: categoryCode,
      icon: 'grid',
      color: 'blue',
      description: '전문적인 도움을 제공합니다',
      descriptionEn: 'Provides professional assistance'
    };
  },

  filterPersonasByCategory(personas, category) {
    if (!Array.isArray(personas) || !category) {
      return [];
    }
    
    return personas.filter(persona => {
      // category 기반 매칭 (단순화)
      return persona.category === category ||
             (persona.tags && persona.tags.includes(category));
    });
  },

  getPersonaIcon(personaCode, iconPath) {
    if (iconPath && iconPath.trim()) {
      return iconPath.trim();
    }

    const iconMap = {
      // DevOps 카테고리
      'swdp_menu': 'apps',
      'project': 'folder',
      'swdp_api': 'code-branch',
      'operation_support': 'cog',
      'system_admin': 'server',
      'devops_engineer': 'layers',
      'infrastructure': 'cloud',
      'deployment': 'upload',
      'monitoring': 'chart-line',
      
      // User Support 카테고리
      'user_support': 'users-alt',
      'customer_service': 'smile',
      'voc': 'headphones',
      'helpdesk': 'life-buoy',
      'support_agent': 'user-circle',
      'qa_support': 'question-circle',
      'service_desk': 'ticket',
      
      // Personal 카테고리
      'personal_assistant': 'user',
      'data_analyst': 'chart-bar',
      'technical_expert': 'wrench',
      'business_analyst': 'briefcase',
      'product_manager': 'clipboard-notes',
      'security_expert': 'shield',
      'qa_tester': 'check-circle',
      'developer': 'laptop-code',
      'designer': 'paint-brush',
      
      // 기타 공통
      'project_info': 'info-circle',
      'documentation': 'file-text',
      'training': 'graduation-cap',
      'consultation': 'comments'
    };

    return iconMap[personaCode] || 'comment';
  },

  getQuickQuestions(personaCode, language) {
    const questionMap = {
      ko: {
        // DevOps 카테고리
        'swdp_menu': [
          '메뉴 구조를 알려주세요',
          '주요 기능은 무엇인가요?',
          '사용자 가이드를 보여주세요'
        ],
        'project': [
          '프로젝트 현황을 보여주세요',
          '팀원 정보를 알려주세요',
          '프로젝트 일정을 확인해주세요'
        ],
        'swdp_api': [
          'API 문서를 보여주세요',
          '인증 방법은?',
          'API 사용 예제를 알려주세요'
        ],
        'operation_support': [
          '시스템 운영 현황을 확인해주세요',
          '모니터링 대시보드를 보여주세요',
          '장애 대응 절차는?'
        ],
        'system_admin': [
          '서버 상태를 확인해주세요',
          '배포 절차를 알려주세요',
          '로그 분석 방법은?'
        ],
        'devops_engineer': [
          'CI/CD 파이프라인 현황은?',
          '인프라 구성을 설명해주세요',
          '성능 최적화 방법은?'
        ],
        
        // User Support 카테고리
        'user_support': [
          '사용자 문의 현황은?',
          '자주 묻는 질문을 알려주세요',
          '고객 지원 방법을 안내해주세요'
        ],
        'customer_service': [
          '고객 만족도는 어떤가요?',
          '서비스 이용 가이드를 보여주세요',
          '문제 해결 방법을 알려주세요'
        ],
        'voc': [
          'VOC 현황을 확인해주세요',
          '최근 이슈는 무엇인가요?',
          '개선 요청사항을 정리해주세요'
        ],
        'helpdesk': [
          '헬프데스크 현황을 보여주세요',
          '티켓 처리 현황은?',
          'FAQ를 업데이트해주세요'
        ],
        
        // Personal 카테고리
        'personal_assistant': [
          '개인 업무 일정을 정리해주세요',
          '오늘 할 일을 추천해주세요',
          '업무 효율성을 높이는 방법은?'
        ],
        'data_analyst': [
          '데이터 분석 결과를 요약해주세요',
          '트렌드 분석을 해주세요',
          '핵심 지표를 보여주세요'
        ],
        'technical_expert': [
          '기술 문서를 찾아주세요',
          '개발 가이드를 알려주세요',
          '기술적 이슈 해결 방법은?'
        ],
        'business_analyst': [
          '비즈니스 요구사항을 분석해주세요',
          '시장 동향을 알려주세요',
          '개선 제안사항은?'
        ]
      },
      en: {
        // DevOps Category
        'swdp_menu': [
          'Show me the menu structure',
          'What are the main features?',
          'Display user guide'
        ],
        'project': [
          'Show project status',
          'Tell me about team members',
          'Check project timeline'
        ],
        'swdp_api': [
          'Show API documentation',
          'How to authenticate?',
          'Show API usage examples'
        ],
        'operation_support': [
          'Check system operation status',
          'Show monitoring dashboard',
          'What\'s the incident response procedure?'
        ],
        'system_admin': [
          'Check server status',
          'Explain deployment procedure',
          'How to analyze logs?'
        ],
        'devops_engineer': [
          'What\'s the CI/CD pipeline status?',
          'Explain infrastructure configuration',
          'How to optimize performance?'
        ],
        
        // User Support Category
        'user_support': [
          'What\'s the user inquiry status?',
          'Show me frequently asked questions',
          'Guide customer support methods'
        ],
        'customer_service': [
          'How is customer satisfaction?',
          'Show service usage guide',
          'Explain problem-solving methods'
        ],
        'voc': [
          'Check VOC status',
          'What are recent issues?',
          'Summarize improvement requests'
        ],
        'helpdesk': [
          'Show helpdesk status',
          'What\'s the ticket processing status?',
          'Update FAQ'
        ],
        
        // Personal Category
        'personal_assistant': [
          'Organize my personal schedule',
          'Recommend today\'s tasks',
          'How to improve work efficiency?'
        ],
        'data_analyst': [
          'Summarize data analysis results',
          'Perform trend analysis',
          'Show key metrics'
        ],
        'technical_expert': [
          'Find technical documentation',
          'Show development guide',
          'How to resolve technical issues?'
        ],
        'business_analyst': [
          'Analyze business requirements',
          'Tell me market trends',
          'What are improvement suggestions?'
        ]
      }
    };

    return questionMap[language]?.[personaCode] || [];
  },

  convertConversationsToMessages(conversations) {
    const messages = [];
    
    if (!Array.isArray(conversations)) {
      return messages;
    }

    conversations.forEach((conv, index) => {
      if (conv.userQuestion) {
        messages.push({
          id: `user-${conv.conversationId}-${index}`,
          type: 'user',
          content: conv.userQuestion,
          timestamp: new Date(conv.createdDate).getTime(),
          isLoading: false
        });
      }

      if (conv.aiResponse) {
        messages.push({
          id: `ai-${conv.conversationId}-${index}`,
          type: 'ai',
          content: conv.aiResponse,
          timestamp: new Date(conv.createdDate).getTime() + 1,
          isLoading: false,
          conversationId: conv.conversationId
        });
      }
    });

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },

  htmlToMarkdown(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return htmlContent;
    }

    let markdown = htmlContent;

    // 테이블 변환 - 더 간소화된 방식
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

    // 제목 변환
    markdown = markdown.replace(/<h([1-6])[^>]*class="markdown-heading[^"]*"[^>]*>(.*?)<\/h[1-6]>/gs, (match, level, content) => {
      const text = this.stripHtml(content).trim();
      return '\n' + '#'.repeat(parseInt(level)) + ' ' + text + '\n\n';
    });

    // 문단 변환
    markdown = markdown.replace(/<p[^>]*class="markdown-paragraph"[^>]*>(.*?)<\/p>/gs, (match, content) => {
      return this.stripHtml(content).trim() + '\n\n';
    });

    // 강조 변환
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

    // 나머지 HTML 태그 제거
    markdown = this.stripHtml(markdown);

    // 여러 줄바꿈 정리
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
      
      const headerMatch = table.match(/<thead>(.*?)<\/thead>/s);
      if (headerMatch) {
        const headers = headerMatch[1].match(/<th[^>]*>(.*?)<\/th>/gs);
        if (headers) {
          result += headers.map(h => this.stripHtml(h.replace(/<th[^>]*>|<\/th>/g, '')).trim()).join('\t') + '\n';
        }
      }
      
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

    // 제목을 일반 텍스트로 변환
    text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs, (match, content) => {
      return '\n' + this.stripHtml(content).trim() + '\n';
    });

    // 문단 변환
    text = text.replace(/<p[^>]*>(.*?)<\/p>/gs, (match, content) => {
      return this.stripHtml(content).trim() + '\n';
    });

    // 리스트 아이템 변환
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gs, (match, content) => {
      return '• ' + this.stripHtml(content).trim() + '\n';
    });

    // 코드 블록 변환
    text = text.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, (match, content) => {
      return '\n' + this.stripHtml(content) + '\n';
    });

    // 나머지 HTML 태그 제거
    text = this.stripHtml(text);

    // 여러 줄바꿈 정리
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return text;
  },

  stripHtml(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  },

  getErrorMessage(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (data && data.errorMessage) {
        return data.errorMessage;
      } else if (data && data.message) {
        return data.message;
      } else if (status === 400) {
        return '잘못된 요청입니다. 입력 정보를 확인해주세요.';
      } else if (status === 401) {
        return '인증이 필요합니다. 다시 로그인해주세요.';
      } else if (status === 403) {
        return '접근 권한이 없습니다.';
      } else if (status === 404) {
        return '요청한 리소스를 찾을 수 없습니다.';
      } else if (status === 429) {
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      } else if (status === 500) {
        return '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (status === 503) {
        return '서비스를 일시적으로 사용할 수 없습니다.';
      } else {
        return `서버 오류가 발생했습니다. (상태 코드: ${status})`;
      }
    } else if (error.request) {
      if (error.code === 'ECONNABORTED') {
        return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      } else if (error.code === 'NETWORK_ERROR') {
        return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
      } else {
        return '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
      }
    } else {
      return error.message || '알 수 없는 오류가 발생했습니다.';
    }
  }
};

export default floatChatService;