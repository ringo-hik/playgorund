import axios from 'axios';

const API_BASE_URL = '/api/v1/devportal/aiops-chat';

const aiopsChatService = {

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

  async sendMessage(messageData, useAsync = false) {
    try {
      const endpoint = useAsync ? '/message/async' : '/message';
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        personaCode: messageData.personaCode,
        userQuestion: messageData.userQuestion,
        sessionId: messageData.sessionId
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      return {
        success: true,
        aiResponse: response.data.aiResponse,
        conversationId: response.data.conversationId,
        sessionId: response.data.sessionId,
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

  getPersonaIcon(personaCode, iconPath) {
    if (iconPath && iconPath.trim()) {
      return iconPath.trim();
    }

    const iconMap = {
      'swdp_menu': 'apps',
      'project': 'folder',
      'voc': 'headphones',
      'project_info': 'info-circle',
      'swdp_api': 'code-branch',
      'personal_assistant': 'user',
      'operation_support': 'cog',
      'user_support': 'users-alt',
      'data_analyst': 'chart-bar',
      'technical_expert': 'wrench'
    };

    return iconMap[personaCode] || 'comment';
  },

  getQuickQuestions(personaCode, language) {
    const questionMap = {
      ko: {
        'swdp_menu': [
          '메뉴 구조를 알려주세요',
          '주요 기능은 무엇인가요?'
        ],
        'project': [
          '프로젝트 현황을 보여주세요',
          '팀원 정보를 알려주세요'
        ],
        'voc': [
          'VOC 현황을 확인해주세요',
          '최근 이슈는 무엇인가요?'
        ],
        'project_info': [
          '프로젝트 상세 정보',
          '기술 스택 정보'
        ],
        'swdp_api': [
          'API 문서를 보여주세요',
          '인증 방법은?'
        ],
        'personal_assistant': [
          '개인 업무 일정을 정리해주세요',
          '오늘 할 일을 추천해주세요'
        ],
        'operation_support': [
          '시스템 운영 현황을 확인해주세요',
          '모니터링 대시보드를 보여주세요'
        ],
        'user_support': [
          '사용자 문의 현황은?',
          '자주 묻는 질문을 알려주세요'
        ],
        'data_analyst': [
          '데이터 분석 결과를 요약해주세요',
          '트렌드 분석을 해주세요'
        ],
        'technical_expert': [
          '기술 문서를 찾아주세요',
          '개발 가이드를 알려주세요'
        ]
      },
      en: {
        'swdp_menu': [
          'Show me the menu structure',
          'What are the main features?'
        ],
        'project': [
          'Show project status',
          'Tell me about team members'
        ],
        'voc': [
          'Check VOC status',
          'What are recent issues?'
        ],
        'project_info': [
          'Project details',
          'Tech stack information'
        ],
        'swdp_api': [
          'Show API documentation',
          'How to authenticate?'
        ],
        'personal_assistant': [
          'Organize my personal schedule',
          'Recommend today\'s tasks'
        ],
        'operation_support': [
          'Check system operation status',
          'Show monitoring dashboard'
        ],
        'user_support': [
          'What\'s the user inquiry status?',
          'Show me frequently asked questions'
        ],
        'data_analyst': [
          'Summarize data analysis results',
          'Perform trend analysis'
        ],
        'technical_expert': [
          'Find technical documentation',
          'Show development guide'
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

    markdown = markdown.replace(/<div class="markdown-table-container">(.*?)<\/div>/gs, (match, tableContent) => {
      const tableMatch = tableContent.match(/<table[^>]*class="markdown-table"[^>]*>(.*?)<\/table>/s);
      if (!tableMatch) return '';
      
      const table = tableMatch[1];
      let result = '\n';
      
      const headerMatch = table.match(/<thead>(.*?)<\/thead>/s);
      if (headerMatch) {
        const headers = headerMatch[1].match(/<th[^>]*>(.*?)<\/th>/gs);
        if (headers) {
          const headerText = headers.map(h => this.stripHtml(h.replace(/<th[^>]*>|<\/th>/g, '')).trim()).join(' | ');
          result += `| ${headerText} |\n`;
          result += `| ${headers.map(() => '---').join(' | ')} |\n`;
        }
      }
      
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

    markdown = markdown.replace(/<h([1-6])[^>]*class="markdown-heading[^"]*"[^>]*>(.*?)<\/h[1-6]>/gs, (match, level, content) => {
      const text = this.stripHtml(content).trim();
      return '\n' + '#'.repeat(parseInt(level)) + ' ' + text + '\n\n';
    });

    markdown = markdown.replace(/<p[^>]*class="markdown-paragraph"[^>]*>(.*?)<\/p>/gs, (match, content) => {
      return this.stripHtml(content).trim() + '\n\n';
    });

    markdown = markdown.replace(/<strong[^>]*class="markdown-strong"[^>]*>(.*?)<\/strong>/gs, (match, content) => {
      return '**' + this.stripHtml(content).trim() + '**';
    });

    markdown = markdown.replace(/<code[^>]*class="markdown-inline-code"[^>]*>(.*?)<\/code>/gs, (match, content) => {
      return '`' + this.stripHtml(content).trim() + '`';
    });

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

    markdown = markdown.replace(/<div[^>]*class="markdown-alert[^"]*"[^>]*>(.*?)<\/div>/gs, (match, content) => {
      const text = this.stripHtml(content).replace(/^[^\w]*/, '').trim();
      return '\n> ' + text + '\n\n';
    });

    markdown = this.stripHtml(markdown);

    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    return markdown;
  },

  htmlToPlainText(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return htmlContent;
    }

    let text = htmlContent;

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

    text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs, (match, content) => {
      return '\n' + this.stripHtml(content).trim() + '\n';
    });

    text = text.replace(/<p[^>]*>(.*?)<\/p>/gs, (match, content) => {
      return this.stripHtml(content).trim() + '\n';
    });

    text = text.replace(/<li[^>]*>(.*?)<\/li>/gs, (match, content) => {
      return '• ' + this.stripHtml(content).trim() + '\n';
    });

    text = text.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, (match, content) => {
      return '\n' + this.stripHtml(content) + '\n';
    });

    text = this.stripHtml(text);

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

export default aiopsChatService;