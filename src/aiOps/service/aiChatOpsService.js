import axios from 'axios';

const API_BASE_URL = 'http://localhost:3004';

let markdownConverter = null;

const aiChatOpsService = {

  async loadMarkdownConverter() {
    if (!markdownConverter) {
      try {
        const module = await import('./convertMarkdownToHtml.js');
        markdownConverter = module.convertMarkdownToHtml;
      } catch (error) {
        throw error;
      }
    }
    return markdownConverter;
  },

  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
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
        success: response.data.success || true,
        data: response.data.data,
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

  async sendMessage(messageData) {
    try {
      const requestBody = {
        personaCode: messageData.personaCode,
        userQuery: messageData.userQuery
      };

      if (messageData.queryHistory && messageData.queryHistory.length > 0) {
        requestBody.queryHistory = JSON.stringify(messageData.queryHistory);
      }

      const response = await axios.get(`${API_BASE_URL}/message-async`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      return {
        success: response.data.success || true,
        data: {
          aiResponse: response.data.data,
          success: response.data.success
        },
        sessionId: messageData.sessionId,
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
      const response = await axios.get(`${API_BASE_URL}/quick-questions`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const questionsData = response.data.data;
      const parsedQuestions = this.parseQuickQuestions(questionsData);
      
      return {
        success: response.data.success || true,
        data: {
          questions: parsedQuestions,
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

  // Parse raw data into quick questions array
  parseQuickQuestions(rawData) {
    if (!rawData) return [];
    
    try {
      if (typeof rawData === 'string') {
        const cleanData = rawData.trim();
        
        // Try parsing JSON array format
        const jsonMatch = cleanData.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
        }
        
        // Parse line by line
        return cleanData.split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.match(/^[\[\]\r\n\s\-\*]*$/))
          .map(line => line.replace(/^[0-9]+\.?\s*/, '').replace(/^["'\-\*•]\s*|["'\-\*•]\s*$/g, ''))
          .filter(line => line.length > 5)
          .slice(0, 5);
      }
      
      // Handle array data
      if (Array.isArray(rawData)) {
        return rawData.filter(q => q && q.trim() && q.trim().length > 5).slice(0, 5);
      }
      
      // Handle object data
      if (rawData && typeof rawData === 'object') {
        const questions = rawData.questions || rawData.queries || rawData.data || [];
        return Array.isArray(questions) ? questions.filter(q => q && q.trim()).slice(0, 5) : [];
      }
      
      return [];
    } catch (error) {
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
        data: response.data.data,
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
        data: response.data.data,
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
      const response = await axios.get(`${API_BASE_URL}/feedback`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
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
    return this.getRandomPersonaIcon(personaCode);
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

  // Convert HTML content to markdown format
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

  // Convert HTML content to plain text
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

  // Get user-friendly error message from error object
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

  // Check if content is markdown format
  isMarkdown(content) {
    if (!content || typeof content !== 'string') return false;
    
    console.log('isMarkdown check:', {
      content: content.substring(0, 100),
      hasHeaders: /^#{1,6}\s+.+$/m.test(content),
      hasBold: /\*\*.+?\*\*/.test(content),
      hasItalic: /\*.+?\*/.test(content),
      hasCode: /`.+?`/.test(content)
    });
    
    const markdownPatterns = [
      /^#{1,6}\s+.+$/m,
      /^\*\s+.+$/m,
      /^-\s+.+$/m,
      /^\d+\.\s+.+$/m,
      /\*\*.+?\*\*/,
      /\*.+?\*/,
      /`.+?`/,
      /```[\s\S]*?```/,
      /^\>.+$/m,
      /\[.+?\]\(.+?\)/,
      /!\[.*?\]\(.+?\)/
    ];
    
    const result = markdownPatterns.some(pattern => pattern.test(content));
    console.log('isMarkdown result:', result);
    return result;
  },

  // Convert markdown to HTML
  async markdownToHtml(markdown) {
    if (!markdown || typeof markdown !== 'string') return markdown;
    
    try {
      const converter = await this.loadMarkdownConverter();
      return converter(markdown);
    } catch (error) {
      return markdown;
    }
  },

  // Detect content type (html, markdown, or plain)
  detectContentType(content) {
    if (!content || typeof content !== 'string') return 'plain';
    
    // Check for markdown first (more specific)
    if (this.isMarkdown(content)) {
      return 'markdown';
    }
    
    // Then check for actual HTML tags (more restrictive)
    if (/<[a-zA-Z][^>]*>.*<\/[a-zA-Z][^>]*>/.test(content) || 
        /<[a-zA-Z][^>]*\/?>/.test(content)) {
      return 'html';
    }
    
    return 'plain';
  },

  // Format content for display based on type
  async formatContentForDisplay(content) {
    // Convert escaped newlines to actual newlines for proper markdown detection
    const normalizedContent = content.replace(/\\n/g, '\n');
    const contentType = this.detectContentType(normalizedContent);
    
    // Debug logging
    console.log('formatContentForDisplay:', {
      originalContent: content.substring(0, 100) + '...',
      normalizedContent: normalizedContent.substring(0, 100) + '...',
      contentType: contentType,
      isMarkdownCheck: this.isMarkdown(normalizedContent)
    });
    
    switch (contentType) {
      case 'markdown':
        const htmlResult = await this.markdownToHtml(normalizedContent);
        console.log('Markdown conversion result:', htmlResult.substring(0, 200) + '...');
        return htmlResult;
      case 'html':
        return normalizedContent;
      case 'plain':
      default:
        return normalizedContent;
    }
  },

  // Get content in appropriate format for clipboard
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