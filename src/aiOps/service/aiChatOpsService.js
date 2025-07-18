import axios from 'axios';
import { convertMarkdownToHtml } from './convertMarkdownToHtml.js';

const API_BASE_URL = 'http://localhost:3004';

const aiChatOpsService = {

  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000
      });

      return {
        success: response.data.success || true,
        data: response.data.data || response.data,
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
    console.log('🚀 [aiChatOpsService] getPersonas: Starting API call');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/personas`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      console.log('📡 [aiChatOpsService] getPersonas: Raw API response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        fullData: response.data
      });

      console.log('📄 [aiChatOpsService] getPersonas: Processed personas data:', {
        personasType: typeof response.data,
        isArray: Array.isArray(response.data),
        length: Array.isArray(response.data) ? response.data.length : 'not array',
        firstItem: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null
      });

      return {
        success: response.data.success || true,
        data: response.data.data || response.data,
        message: response.data.message || 'Personas loaded successfully'
      };

    } catch (error) {
      console.error('❌ [aiChatOpsService] getPersonas: API call failed:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestURL: error.config?.url,
        timeout: error.code === 'ECONNABORTED'
      });
      
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async sendMessage(messageData) {
    console.log('🚀 [aiChatOpsService] sendMessage: Starting API call:', {
      personaCode: messageData.personaCode,
      userQueryLength: messageData.userQuery?.length || 0,
      hasSessionId: !!messageData.sessionId,
      hasQueryHistory: !!(messageData.queryHistory && messageData.queryHistory.length > 0),
      queryHistoryCount: messageData.queryHistory?.length || 0
    });
    
    try {
      const requestBody = {
        personaCode: messageData.personaCode,
        userQuery: messageData.userQuery,
        sessionId: messageData.sessionId
      };

      if (messageData.queryHistory && messageData.queryHistory.length > 0) {
        requestBody.queryHistory = JSON.stringify(messageData.queryHistory);
        console.log('📄 [aiChatOpsService] sendMessage: Including query history:', messageData.queryHistory.length, 'items');
      }

      console.log('📤 [aiChatOpsService] sendMessage: Request body prepared:', {
        personaCode: requestBody.personaCode,
        userQueryLength: requestBody.userQuery?.length,
        sessionId: requestBody.sessionId,
        hasQueryHistory: !!requestBody.queryHistory
      });

      const response = await axios.get(`${API_BASE_URL}/message-async`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      console.log('📡 [aiChatOpsService] sendMessage: Raw API response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        success: response.data?.success,
        hasAiQuery: !!response.data?.aiQuery,
        hasAiResponse: !!response.data?.data?.aiResponse,
        hasSessionId: !!response.data?.sessionId,
        fullResponse: response.data
      });

      const aiResponse = response.data.data || response.data;
      
      console.log('🤖 [aiChatOpsService] sendMessage: AI response extracted:', {
        aiResponseType: typeof aiResponse,
        aiResponseLength: typeof aiResponse === 'string' ? aiResponse.length : 'not string',
        aiResponsePreview: typeof aiResponse === 'string' ? aiResponse.substring(0, 100) + '...' : aiResponse
      });
      
      const result = {
        success: response.data.success || true,
        data: {
          aiResponse: aiResponse,
          success: response.data.success
        },
        sessionId: response.data.sessionId || messageData.sessionId,
        message: response.data.message || 'Message sent successfully'
      };
      
      console.log('✅ [aiChatOpsService] sendMessage: Final result prepared:', {
        success: result.success,
        hasAiResponse: !!result.data.aiResponse,
        sessionId: result.sessionId,
        message: result.message
      });
      
      return result;

    } catch (error) {
      console.error('❌ [aiChatOpsService] sendMessage: API call failed:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestURL: error.config?.url,
        timeout: error.code === 'ECONNABORTED',
        personaCode: messageData.personaCode
      });
      
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  async generateQuickQuestions(questionData) {
    console.log('🚀 [aiChatOpsService] generateQuickQuestions: Starting API call:', {
      personaCode: questionData.personaCode,
      hasConversationContext: !!questionData.conversationContext,
      currentLanguage: questionData.currentLanguage
    });
    
    try {
      const response = await axios.get(`${API_BASE_URL}/quick-questions`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('📡 [aiChatOpsService] generateQuickQuestions: Raw API response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        success: response.data?.success,
        hasAiQuery: !!response.data?.aiQuery,
        fullResponse: response.data
      });

      const questionsData = response.data.data || response.data;
      
      console.log('❓ [aiChatOpsService] generateQuickQuestions: Raw questions data:', {
        type: typeof questionsData,
        isArray: Array.isArray(questionsData),
        length: typeof questionsData === 'string' ? questionsData.length : 'not string',
        preview: typeof questionsData === 'string' ? questionsData.substring(0, 200) + '...' : questionsData
      });
      
      const parsedQuestions = this.parseQuickQuestions(questionsData);
      
      console.log('📄 [aiChatOpsService] generateQuickQuestions: Parsed questions:', {
        count: parsedQuestions.length,
        questions: parsedQuestions
      });
      
      return {
        success: response.data.success || true,
        data: {
          questions: parsedQuestions,
          success: response.data.success
        },
        message: response.data.message || 'Quick questions generated successfully'
      };

    } catch (error) {
      console.error('❌ [aiChatOpsService] generateQuickQuestions: API call failed:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestURL: error.config?.url,
        timeout: error.code === 'ECONNABORTED',
        personaCode: questionData.personaCode
      });
      
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
        error: error
      };
    }
  },

  parseQuickQuestions(rawData) {
    console.log('🔄 [aiChatOpsService] parseQuickQuestions: Starting parsing:', {
      hasRawData: !!rawData,
      rawDataType: typeof rawData,
      isArray: Array.isArray(rawData),
      rawDataPreview: typeof rawData === 'string' ? rawData.substring(0, 200) + '...' : rawData
    });
    
    if (!rawData) {
      console.warn('⚠️ [aiChatOpsService] parseQuickQuestions: No raw data provided');
      return [];
    }
    
    try {
      let cleanData = rawData;
      
      if (typeof rawData === 'string') {
        cleanData = rawData.trim();
        console.log('📄 [aiChatOpsService] parseQuickQuestions: Processing string data:', {
          length: cleanData.length,
          hasJsonMatch: /\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/.test(cleanData)
        });
        
        const jsonMatch = cleanData.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
        if (jsonMatch) {
          console.log('🔮 [aiChatOpsService] parseQuickQuestions: JSON match found:', jsonMatch[0]);
          const questions = JSON.parse(jsonMatch[0]);
          const filtered = Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
          console.log('✅ [aiChatOpsService] parseQuickQuestions: JSON parsing successful:', filtered);
          return filtered;
        }
        
        console.log('📄 [aiChatOpsService] parseQuickQuestions: No JSON match, processing lines');
        const lines = cleanData.split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.match(/^[\[\]\r\n\s\-\*]*$/))
          .map(line => line.replace(/^[0-9]+\.?\s*/, '').replace(/^["'\-\*•]\s*|["'\-\*•]\s*$/g, ''))
          .filter(line => line.length > 5)
          .slice(0, 5);
        
        console.log('✅ [aiChatOpsService] parseQuickQuestions: Line processing result:', lines);
        return lines;
      }
      
      if (Array.isArray(rawData)) {
        console.log('📄 [aiChatOpsService] parseQuickQuestions: Processing array data:', {
          length: rawData.length,
          items: rawData
        });
        const filtered = rawData.filter(q => q && q.trim() && q.trim().length > 5).slice(0, 5);
        console.log('✅ [aiChatOpsService] parseQuickQuestions: Array processing result:', filtered);
        return filtered;
      }
      
      if (rawData && typeof rawData === 'object') {
        console.log('📄 [aiChatOpsService] parseQuickQuestions: Processing object data:', {
          keys: Object.keys(rawData),
          hasQuestions: !!rawData.questions,
          hasQueries: !!rawData.queries,
          hasData: !!rawData.data
        });
        const questions = rawData.questions || rawData.queries || rawData.data || [];
        const filtered = Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
        console.log('✅ [aiChatOpsService] parseQuickQuestions: Object processing result:', filtered);
        return filtered;
      }
      
      console.warn('⚠️ [aiChatOpsService] parseQuickQuestions: Unknown data type, returning empty array');
      return [];
    } catch (error) {
      console.error('❌ [aiChatOpsService] parseQuickQuestions: 빠른 질문 파싱 실패:', {
        error: error.message,
        stack: error.stack,
        rawData: rawData
      });
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
        success: response.data.success || true,
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
        success: response.data.success || true,
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
  /* 아직 사용 안함 

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
  */

  async sendFeedback(feedbackData) {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      return {
        success: response.data.success || true,
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

  getPersonaIcon(personaCode) {
    this.getRandomPersonaIcon(personaCode);
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
    return html.replace(/<[^>]*>/g, '');
  },

  // 단순화된 응답 추출 유틸리티
  extractAIResponse(response) {
    return response.data?.aiResponse || response.data?.data || response.data;
  },

  extractConversationId(response) {
    return response.data?.conversationId || response.sessionId || Date.now();
  },

  extractQuickQuestions(response) {
    return response.data?.questions || response.data?.data || [];
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
  },

  // 마크다운 감지 및 렌더링 유틸리티
  isMarkdown(content) {
    if (!content || typeof content !== 'string') return false;
    
    // 이미 HTML인 경우 마크다운이 아님
    if (content.includes('<') && content.includes('>')) {
      return false;
    }
    
    // 마크다운 패턴 확인
    const markdownPatterns = [
      /^#{1,6}\s+.+$/m,           // 헤딩 (# ## ### 등)
      /^\*\s+.+$/m,              // 리스트 (* 항목)
      /^-\s+.+$/m,               // 리스트 (- 항목)
      /^\d+\.\s+.+$/m,           // 번호 리스트 (1. 항목)
      /\*\*.+?\*\*/,             // 굵은 글씨 (**text**)
      /\*.+?\*/,                 // 기울임 글씨 (*text*)
      /`.+?`/,                   // 인라인 코드 (`code`)
      /```[\s\S]*?```/,          // 코드 블록 (```code```)
      /^\>.+$/m,                 // 인용 (> 텍스트)
      /\[.+?\]\(.+?\)/,          // 링크 ([text](url))
      /!\[.*?\]\(.+?\)/          // 이미지 (![alt](url))
    ];
    
    return markdownPatterns.some(pattern => pattern.test(content));
  },

  markdownToHtml(markdown) {
    if (!markdown || typeof markdown !== 'string') return markdown;
    
    try {
      return convertMarkdownToHtml(markdown);
    } catch (error) {
      console.error('마크다운 변환 실패:', error);
      return markdown;
    }
  },

  detectContentType(content) {
    if (!content || typeof content !== 'string') return 'plain';
    
    // HTML 태그가 있는 경우
    if (content.includes('<') && content.includes('>')) {
      return 'html';
    }
    
    // 마크다운 패턴이 있는 경우
    if (this.isMarkdown(content)) {
      return 'markdown';
    }
    
    return 'plain';
  },

  formatContentForDisplay(content) {
    const contentType = this.detectContentType(content);
    
    switch (contentType) {
      case 'markdown':
        return this.markdownToHtml(content);
      case 'html':
        return content;
      case 'plain':
      default:
        return content;
    }
  },

  getContentForCopy(content) {
    const contentType = this.detectContentType(content);
    
    switch (contentType) {
      case 'html':
        return this.htmlToMarkdown(content);
      case 'markdown':
        return content;
      case 'plain':
      default:
        return content;
    }
  }
};

export default aiChatOpsService;