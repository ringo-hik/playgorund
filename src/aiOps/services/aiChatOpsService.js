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

  async sendMessage(messageData) {
    try {
      const requestBody = {
        personaCode: messageData.personaCode,
        userQuery: messageData.userQuery,
        sessionId: messageData.sessionId
      };

      if (messageData.queryHistory && messageData.queryHistory.length > 0) {
        requestBody.queryHistory = JSON.stringify(messageData.queryHistory);
      }

      const response = await axios.post(`${API_BASE_URL}/message/async`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      // API 응답 구조 통일: response.data.success와 response.data.aiQuery 사용
      return {
        success: response.data.success || true,
        data: {
          aiResponse: response.data.aiQuery || response.data.data?.aiResponse || response.data.data,
          success: response.data.success
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

      // API 응답 구조 통일: response.data.success와 response.data.aiQuery 사용
      const questionsData = response.data.aiQuery || response.data.data || response.data;
      
      return {
        success: response.data.success || true,
        data: {
          questions: this.parseQuickQuestions(questionsData),
          success: response.data.success
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

  parseQuickQuestions(rawData) {
    if (!rawData) return [];
    
    try {
      let cleanData = rawData;
      
      if (typeof rawData === 'string') {
        cleanData = rawData.trim();
        
        const jsonMatch = cleanData.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
        }
        
        const lines = cleanData.split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.match(/^[\[\]\r\n\s\-\*]*$/))
          .map(line => line.replace(/^[0-9]+\.?\s*/, '').replace(/^["'\-\*•]\s*|["'\-\*•]\s*$/g, ''))
          .filter(line => line.length > 5)
          .slice(0, 5);
        
        return lines;
      }
      
      if (Array.isArray(rawData)) {
        return rawData.filter(q => q && q.trim() && q.trim().length > 5).slice(0, 5);
      }
      
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

  getPersonaIcon(personaCode, iconPath) {
    if (iconPath && iconPath.trim()) {
      return iconPath.trim();
    }

    const iconMap = {
      'swdp_api': 'code',
      'technical_expert': 'cpu',
      'data_analyst': 'database',
      'security_expert': 'shield',
      'developer': 'terminal',
      'architect': 'compass',
      'devops': 'settings',
      'project': 'briefcase',
      'project_manager': 'target',
      'business_analyst': 'lightbulb',
      'consultant': 'award',
      'strategist': 'gem',
      'product_manager': 'rocket',
      'personal_assistant': 'user',
      'user_support': 'users',
      'customer_service': 'mail',
      'operation_support': 'wrench',
      'voc': 'phone',
      'help_desk': 'message-circle',
      'designer': 'palette',
      'content_creator': 'edit',
      'marketing': 'rocket',
      'researcher': 'brain',
      'teacher': 'book',
      'musician': 'music',
      'gamer': 'gamepad-2',
      'photographer': 'camera',
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

  getRandomPersonaIcon(personaCode) {
    const availableIcons = [
      'robot', 'brain', 'cpu', 'database', 'shield', 'terminal', 'code',
      'compass', 'briefcase', 'target', 'lightbulb', 'award', 'gem', 'rocket',
      'users', 'user', 'mail', 'phone', 'message-circle', 'heart',
      'palette', 'camera', 'music', 'book', 'edit', 'sparkles',
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

  convertConversationsToMessages(conversations) {
    const messages = [];
    
    if (!Array.isArray(conversations)) {
      return messages;
    }

    conversations.forEach((conv, index) => {
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

    if (error?.request) {
      return error.code || 'NETWORK_ERROR';
    }

    return error?.message || 'UNKNOWN_ERROR';
  }
};

export default aiChatOpsService;