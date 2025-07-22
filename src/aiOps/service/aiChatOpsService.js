import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005';

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
  },

  // ============================================
  // System Admin API Methods
  // ============================================

  async getSystemPrompts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/prompts`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data || response.data.prompts || [],
        message: response.data.message || 'System prompts loaded successfully'
      };

    } catch (error) {
      // Mock fallback data for development
      const mockPrompts = [
        {
          id: 'default_system',
          name: 'Default System Prompt',
          type: 'system',
          description: 'Default system behavior prompt',
          content: `You are a helpful AI assistant. Please provide accurate, helpful, and informative responses to user questions.

Guidelines:
- Be concise and clear in your responses
- Provide examples when helpful
- Ask clarifying questions if needed
- Be honest about limitations
- Maintain a professional and friendly tone`
        },
        {
          id: 'technical_support',
          name: 'Technical Support Prompt',
          type: 'system',
          description: 'Specialized prompt for technical support scenarios',
          content: `You are a technical support specialist. Help users with technical issues and questions.

Your responsibilities:
- Diagnose technical problems
- Provide step-by-step solutions
- Recommend best practices
- Escalate complex issues when necessary
- Document solutions for future reference`
        },
        {
          id: 'creative_assistant',
          name: 'Creative Assistant Prompt',
          type: 'system',
          description: 'Prompt for creative writing and brainstorming',
          content: `You are a creative assistant specialized in writing, brainstorming, and ideation.

Your capabilities:
- Generate creative content and ideas
- Assist with writing and editing
- Provide storytelling techniques
- Offer constructive feedback
- Inspire creative thinking`
        }
      ];

      return {
        success: true,
        data: mockPrompts,
        message: 'Mock system prompts loaded successfully (fallback)'
      };
    }
  },

  async updateSystemPrompt(promptData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/prompts/${promptData.id}`, {
        content: promptData.content,
        name: promptData.name,
        type: promptData.type,
        description: promptData.description
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'System prompt updated successfully'
      };

    } catch (error) {
      // Mock success for development
      return {
        success: true,
        data: promptData,
        message: 'Mock system prompt updated successfully (fallback)'
      };
    }
  },

  async testSystemPrompt(testData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/test-prompt`, {
        promptContent: testData.promptContent,
        testInput: testData.testInput,
        promptId: testData.promptId
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return {
        success: response.data.success || true,
        data: response.data.data || response.data.response,
        message: response.data.message || 'Prompt test completed successfully'
      };

    } catch (error) {
      // Mock response for development/testing
      const mockResponses = [
        `Based on the provided prompt, I understand that I should respond as a helpful AI assistant. 

Your test message "${testData.testInput}" has been received and processed according to the system prompt guidelines.

This is a simulated response demonstrating how the AI would behave with the current prompt configuration. The response style and content would vary based on the specific prompt instructions provided.`,
        
        `Thank you for testing the system prompt. I'm responding according to the prompt configuration you've set up.

Test input: "${testData.testInput}"

This mock response shows how the AI would interpret and respond to user messages based on the current system prompt. The actual behavior would depend on the specific instructions and context provided in the prompt.`,
        
        `System prompt test successful! 

Your input: "${testData.testInput}"

I'm generating this response following the guidelines specified in your system prompt. This demonstrates how the AI would behave with users when this prompt is active. The tone, style, and approach would all be influenced by the prompt content you've configured.`
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      return {
        success: true,
        data: randomResponse,
        message: 'Mock prompt test completed successfully (fallback)'
      };
    }
  },

  async createSystemPrompt(promptData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/prompts`, {
        name: promptData.name,
        type: promptData.type || 'system',
        description: promptData.description,
        content: promptData.content
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'System prompt created successfully'
      };

    } catch (error) {
      // Mock success for development
      const newPrompt = {
        id: `custom_${Date.now()}`,
        ...promptData,
        type: promptData.type || 'system',
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: newPrompt,
        message: 'Mock system prompt created successfully (fallback)'
      };
    }
  },

  async deleteSystemPrompt(promptId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/prompts/${promptId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'System prompt deleted successfully'
      };

    } catch (error) {
      // Mock success for development
      return {
        success: true,
        data: { id: promptId },
        message: 'Mock system prompt deleted successfully (fallback)'
      };
    }
  },

  async getSystemConfiguration() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/config`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'System configuration loaded successfully'
      };

    } catch (error) {
      // Mock configuration for development
      const mockConfig = {
        systemPrompts: {
          enabled: true,
          defaultPromptId: 'default_system',
          maxPromptLength: 4000,
          allowCustomPrompts: true
        },
        testing: {
          enabled: true,
          maxTestsPerHour: 100,
          testTimeout: 30000
        },
        api: {
          baseUrl: API_BASE_URL,
          timeout: 30000,
          retries: 3
        }
      };

      return {
        success: true,
        data: mockConfig,
        message: 'Mock system configuration loaded successfully (fallback)'
      };
    }
  },

  // ============================================
  // Persona Management API Methods
  // ============================================

  async getAllPersonasWithPrompts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/personas-with-prompts`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data || response.data.personas || [],
        message: response.data.message || 'Personas with prompts loaded successfully'
      };

    } catch (error) {
      // Fallback to regular personas API and add mock system prompts
      try {
        const personasResponse = await this.getPersonas();
        if (personasResponse.success) {
          const personasWithPrompts = personasResponse.data.map(persona => ({
            ...persona,
            systemPrompt: this.getMockSystemPrompt(persona.personaCode)
          }));

          return {
            success: true,
            data: personasWithPrompts,
            message: 'Personas loaded with mock system prompts (fallback)'
          };
        }
      } catch (fallbackError) {
        // Double fallback with complete mock data
      }

      const mockPersonasWithPrompts = [
        {
          personaCode: 'personal_assistant',
          title: '개인 업무 어시스턴트',
          description: '개인 업무 및 일정 관리를 도와드립니다.',
          descriptionEn: 'Helps with personal tasks and schedule management.',
          category: 'personal',
          tags: ['개인', '업무', '일정'],
          welcomeMsg: '안녕하세요! 😊 개인 업무 어시스턴트입니다.\n\n**일정 관리, 업무 정리, 생산성 향상을 위한 다양한 도구와 팁을 제공해드릴 수 있습니다.**\n어떤 도움이 필요하신가요?',
          systemPrompt: `You are a personal assistant specialized in productivity and task management.

Your responsibilities:
- Help organize personal schedules and tasks
- Provide productivity tips and techniques
- Assist with time management strategies
- Offer personalized workflow solutions
- Support work-life balance initiatives

Always be friendly, proactive, and focused on improving the user's personal productivity.`
        },
        {
          personaCode: 'project_manager',
          title: '프로젝트 매니저',
          description: '프로젝트 관리 및 팀 협업을 지원합니다.',
          descriptionEn: 'Supports project management and team collaboration.',
          category: 'personal',
          tags: ['프로젝트', '관리', '팀'],
          welcomeMsg: '안녕하세요! 🚀 프로젝트 매니저입니다.\n\n**프로젝트 관리의 모든 것을 도와드립니다:**\n- 프로젝트 계획 및 일정 관리\n- 팀 협업 및 커뮤니케이션\n- 리스크 관리 및 문제 해결\n\n어떤 프로젝트 관련 도움이 필요하신가요?',
          systemPrompt: `You are an experienced project manager with expertise in various methodologies.

Your expertise includes:
- Project planning and timeline management
- Team coordination and communication
- Risk assessment and mitigation
- Agile and traditional project management
- Stakeholder management and reporting

Provide practical, actionable advice for successful project delivery.`
        },
        {
          personaCode: 'hr_specialist',
          title: 'HR 전문가',
          description: '인사 업무 및 직원 관리를 지원합니다.',
          descriptionEn: 'Supports HR operations and employee management.',
          category: 'general',
          tags: ['인사', 'HR', '직원'],
          welcomeMsg: '안녕하세요! 👥 HR 전문가입니다.\n\n**인사 업무 전반을 지원해드립니다:**\n- 채용 및 면접 프로세스\n- 직원 교육 및 개발\n- 성과 관리 및 평가\n- 조직 문화 및 복지\n\n어떤 HR 관련 질문이 있으신가요?',
          systemPrompt: `You are an HR specialist with comprehensive knowledge of human resources management.

Your areas of expertise:
- Recruitment and talent acquisition
- Employee development and training
- Performance management systems
- Organizational culture and engagement
- HR policies and compliance
- Workplace diversity and inclusion

Provide professional, ethical, and practical HR guidance.`
        }
      ];

      return {
        success: true,
        data: mockPersonasWithPrompts,
        message: 'Mock personas with system prompts loaded (fallback)'
      };
    }
  },

  async createPersona(personaData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/personas`, {
        ...personaData,
        createdAt: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data || personaData,
        message: response.data.message || 'Persona created successfully'
      };

    } catch (error) {
      // Mock success for development
      const newPersona = {
        ...personaData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: newPersona,
        message: 'Mock persona created successfully (fallback)'
      };
    }
  },

  async updatePersona(personaData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/personas/${personaData.personaCode}`, {
        ...personaData,
        updatedAt: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data || personaData,
        message: response.data.message || 'Persona updated successfully'
      };

    } catch (error) {
      // Mock success for development
      const updatedPersona = {
        ...personaData,
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: updatedPersona,
        message: 'Mock persona updated successfully (fallback)'
      };
    }
  },

  async deletePersona(personaCode) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/personas/${personaCode}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: { personaCode },
        message: response.data.message || 'Persona deleted successfully'
      };

    } catch (error) {
      // Mock success for development
      return {
        success: true,
        data: { personaCode },
        message: 'Mock persona deleted successfully (fallback)'
      };
    }
  },

  async updatePersonaSystemPrompt(promptData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/personas/${promptData.personaCode}/system-prompt`, {
        systemPrompt: promptData.systemPrompt,
        updatedAt: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'System prompt updated successfully'
      };

    } catch (error) {
      // Mock success for development
      return {
        success: true,
        data: promptData,
        message: 'Mock system prompt updated successfully (fallback)'
      };
    }
  },

  getMockSystemPrompt(personaCode) {
    const mockPrompts = {
      'personal_assistant': `You are a personal assistant specialized in productivity and task management.

Your responsibilities:
- Help organize personal schedules and tasks
- Provide productivity tips and techniques
- Assist with time management strategies
- Offer personalized workflow solutions
- Support work-life balance initiatives

Always be friendly, proactive, and focused on improving the user's personal productivity.`,

      'project_manager': `You are an experienced project manager with expertise in various methodologies.

Your expertise includes:
- Project planning and timeline management
- Team coordination and communication
- Risk assessment and mitigation
- Agile and traditional project management
- Stakeholder management and reporting

Provide practical, actionable advice for successful project delivery.`,

      'hr_specialist': `You are an HR specialist with comprehensive knowledge of human resources management.

Your areas of expertise:
- Recruitment and talent acquisition
- Employee development and training
- Performance management systems
- Organizational culture and engagement
- HR policies and compliance
- Workplace diversity and inclusion

Provide professional, ethical, and practical HR guidance.`
    };

    return mockPrompts[personaCode] || `You are a helpful AI assistant specialized in ${personaCode}.

Please provide accurate, helpful, and informative responses to user questions.

Guidelines:
- Be concise and clear in your responses
- Provide examples when helpful
- Ask clarifying questions if needed
- Be honest about limitations
- Maintain a professional and friendly tone`;
  }
};

export default aiChatOpsService;