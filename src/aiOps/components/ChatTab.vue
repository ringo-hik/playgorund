<template>
  <div class="chat-tab">
    <div v-if="!selectedPersona" class="no-persona-selected">
      <div class="persona-selection-guide">
        <div class="guide-icon">
          <LucideIcon name="home-heart" fill="none" stroke="currentColor" :width="24" :height="24" />
        </div>
        <h3 class="guide-title">{{ getText('noPersonaSelected') }}</h3>
        <p class="guide-description">{{ getText('noPersonaDesc') }}</p>
      </div>
    </div>

    <div v-else class="chat-interface">
      <!-- 채팅 헤더 추가 -->
      <div class="chat-header">
        <div class="persona-info">
          <div class="persona-badge">
            <LucideIcon :name="getPersonaIconName(selectedPersona)" fill="white" :width="16" :height="16" />
            <span>{{ getPersonaDisplayName(selectedPersona) }}</span>
          </div>
        </div>
        
        <div class="header-actions">
          <button
            @click="$emit('go-persona-list')"
            class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="페르소나 목록으로"
          >
            <LucideIcon name="users" :width="14" :height="14" />
          </button>
          
          <button
            @click="$emit('go-home')"
            class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="홈으로"
          >
            <LucideIcon name="home" :width="14" :height="14" />
          </button>
          
          <button
            @click="clearChatHistory"
            class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="메시지 내역 삭제"
          >
            <LucideIcon name="trash-2" :width="14" :height="14" />
          </button>
        </div>
      </div>

      <div ref="messagesContainer" class="messages-container" :class="messagesClasses">
        <div v-if="loadingHistory" class="loading-history">
          <Elements component-type="spinner" size="sm" color="accent" />
          <span class="loading-text">{{ getText('loadingHistory') }}</span>
        </div>

        <div v-else-if="messages.length === 0" class="welcome-section">
          <div class="welcome-content">
            <div class="welcome-header">
              <div class="persona-avatar">
                <LucideIcon :name="getPersonaIconName(selectedPersona)" fill="currentColor" :width="24" :height="24" />
              </div>
              <h2 class="welcome-title">
                {{ getText('welcomeChat').replace('{persona}', getPersonaDisplayName(selectedPersona)) }}
              </h2>
            </div>
            <p class="welcome-description">{{ getText('welcomeTip') }}</p>
          </div>
        </div>

        <div class="messages-list">
          <Elements
            v-for="message in messages"
            :key="message.id"
            component-type="message"
            :message="message"
            :persona="selectedPersona"
            :current-language="currentLanguage"
            @copy-message="handleCopyMessage"
            @regenerate-message="handleRegenerateMessage"
            @feedback-message="handleFeedbackMessage"
          />
        </div>
      </div>

      <div class="input-area" ref="inputArea">
        <!-- 빠른 질문 셀렉트박스 형태로 변경 -->
        <div v-if="showQuickQuestions && quickQuestions.length > 0" class="quick-questions-dropdown" ref="quickQuestionsDropdown">
          <div class="quick-questions-list">
            <div
              v-for="(question, index) in quickQuestions" 
              :key="index" 
              @click="sendQuickQuestion(question)" 
              class="quick-question-item"
            >
              {{ question }}
            </div>
          </div>
        </div>
        
        <div class="input-container card-system">
          <div class="input-box">
            <textarea 
              v-model="currentMessage" 
              ref="messageInput" 
              :placeholder="getText('inputPlaceholder')"
              @keydown="handleKeyDown"
              @input="handleInput"
              @focus="handleFocus"
              :disabled="isProcessing" 
              class="message-textarea form-input enhanced-input"
            />
            
            <div class="input-bottom-row">
              <div class="left-actions">
                <button
                  @click="generateQuickQuestions" 
                  :disabled="isProcessing || isQuickQuestionsLoading"
                  class="btn-system btn-system--ghost btn-system--sm quick-questions-generate-btn"
                  :title="getText('generateQuestions') || '질문 생성하기'"
                >
                  <div v-if="isQuickQuestionsLoading" class="loading-spinner"></div>
                  <LucideIcon v-else name="lightbulb" :width="12" :height="12" />
                </button>
                
                <button
                  @click="toggleContinuousChat"
                  :disabled="isProcessing"
                  :class="[
                    'btn-system',
                    'btn-system--sm',
                    'continuous-chat-btn',
                    continuousChatEnabled ? 'btn-system--success' : 'btn-system--ghost'
                  ]"
                  :title="continuousChatEnabled ? '단일 대화로 전환' : '연속 대화로 전환'"
                >
                  <LucideIcon :name="continuousChatEnabled ? 'layers' : 'message-square'" :width="12" :height="12" />
                </button>
              </div>
              
              <button
                @click="sendMessage" 
                :disabled="!canSendMessage" 
                :class="[
                  'btn-system', 
                  'btn-system--send', 
                  'btn-system--sm', 
                  'btn-system--icon-only', 
                  'send-button-enhanced', 
                  { 'loading': isProcessing }
                ]"
                title="메시지 전송"
              >
                <Elements v-if="isProcessing" component-type="spinner" size="sm" color="accent" />
                <LucideIcon v-else name="send-horizontal" fill="currentColor" :width="14" :height="14" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="isDevelopment && showDevInfo" class="dev-info-tooltip">
          <div class="dev-info-header">🔧 Dev Info</div>
          <div class="dev-info-content">
            <div class="dev-info-item">
              <span class="dev-label">Messages:</span>
              <span class="dev-value">{{ messages.length }}/{{ maxSessionMessages }}</span>
            </div>
            <div class="dev-info-item">
              <span class="dev-label">Memory:</span>
              <span class="dev-value">{{ memoryUsage.used }}MB/{{ memoryUsage.total }}MB</span>
            </div>
            <div class="dev-info-item">
              <span class="dev-label">Pending:</span>
              <span class="dev-value" :class="{ 'dev-value--active': pendingMessages.length > 0 }">{{ pendingMessages.length }}</span>
            </div>
            <div class="dev-info-item">
              <span class="dev-label">Rendering:</span>
              <span class="dev-value" :class="{ 'dev-value--active': renderingScheduled }">{{ renderingScheduled ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LucideIcon from './LucideIcon.vue';
import Elements from './Elements.vue';
import { getText, getTextArray } from '../utils/i18n.js';
import aiChatOpsService from '@/service/aiChatOpsService.js';

export default {
  name: 'ChatTab',
  components: {
    LucideIcon,
    Elements
  },
  
  props: {
    selectedPersona: {
      type: Object,
      default: null
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    currentLanguage: {
      type: String,
      default: 'ko'
    },
    windowSize: {
      type: Object,
      default: () => ({ width: 455, height: 676 })
    },
    selectedCategory: {
      type: String,
      default: null
    }
  },
  
  data() {
    return {
      currentMessage: '',
      messages: [],
      loadingHistory: false,
      currentLoadingMessage: '',
      loadingInterval: null,
      loadingMessageId: null,
      showQuickQuestions: false,
      quickQuestions: [],
      continuousChatEnabled: true,
      isQuickQuestionsLoading: false,
      isInitialLoad: false,
      maxSessionMessages: 30,
      memoryUsage: { used: 0, total: 0 },
      memoryMonitorInterval: null,
      isDevelopment: process.env.NODE_ENV === 'development',
      showDevInfo: false,
      debugMode: true, // 강제 디버깅 모드
      renderingStates: [],
      lastApiCall: null,
      
      pendingMessages: [],
      renderingScheduled: false,
      batchUpdateTimeout: null,
      
      enhancedInputManager: {
        minHeight: 38,
        maxHeight: 400,
        scrollThreshold: 300,
        currentState: {
          isExpanded: false,
          hasScrolled: false,
          lineCount: 1
        }
      }
    };
  },
  
  computed: {
    canSendMessage() {
      return this.currentMessage.trim().length > 0 && !this.isProcessing && this.selectedPersona;
    },
    
    recentConversations() {
      if (!this.continuousChatEnabled) return [];
      
      const conversationPairs = [];
      for (let i = 0; i < this.messages.length - 1; i += 2) {
        if (this.messages[i]?.type === 'user' && this.messages[i + 1]?.type === 'ai') {
          conversationPairs.push({
            question: this.messages[i].content,
            answer: this.messages[i + 1].content
          });
        }
      }
      return conversationPairs.slice(-5);
    },

    messagesClasses() {
      return {
        'smooth-scroll': !this.loadingHistory && !this.isInitialLoad && !this.renderingScheduled,
        'initial-loading': this.loadingHistory
      };
    },
    
    isExpanded() {
      if (!this.windowSize) return false;
      return this.windowSize.width > 600 || this.windowSize.height > 800;
    }
  },
  
  watch: {
    currentLanguage() {
      console.log('🌐 [ChatTab] currentLanguage changed:', this.currentLanguage);
      this.$nextTick(() => {
        this.trackInputChanges();
      });
    },
    
    isProcessing(newVal, oldVal) {
      console.log('⚙️ [ChatTab] isProcessing changed:', { from: oldVal, to: newVal });
      if (!newVal) {
        this.stopLoadingMessages();
      }
      if (newVal) {
        this.showQuickQuestions = false;
        console.log('🔄 [ChatTab] isProcessing: Hidden quick questions due to processing');
      }
    },
    
    selectedPersona: {
      handler(newPersona, oldPersona) {
        console.log('👤 [ChatTab] selectedPersona changed:', {
          from: oldPersona?.personaCode || 'none',
          to: newPersona?.personaCode || 'none',
          hasPersona: !!newPersona
        });
        
        if (newPersona) {
          this.loadPersonaHistory();
        } else {
          console.log('📄 [ChatTab] selectedPersona: No persona selected, clearing messages');
          this.messages = [];
        }
      },
      immediate: true
    }
  },
  
  methods: {
    getText,
    
    getPersonaIconName(persona) {
      if (!persona) return 'message-square-heart';
      return aiChatOpsService.getPersonaIcon(persona.personaCode, persona.iconPath);
    },
    
    getPersonaDescription(persona) {
      if (!persona) return '';
      if (this.currentLanguage === 'en' && persona.descriptionEn) {
        return persona.descriptionEn;
      }
      return persona.description || this.getText('defaultPersonaDesc');
    },

    getPersonaDisplayName(persona) {
      if (!persona) return '';
      return persona.title || persona.personaName || persona.personaCode || '';
    },

    generateUniqueId() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    getSessionId() {
      return 'session-' + Date.now();
    },

    async loadPersonaHistory() {
      if (!this.selectedPersona?.personaCode) {
        console.warn('🚫 [ChatTab] loadPersonaHistory: No persona code');
        return;
      }
      
      console.log('🚀 [ChatTab] Loading persona history:', this.selectedPersona.personaCode);
      
      this.loadingHistory = true;
      this.isInitialLoad = true;
      
      try {
        const response = await aiChatOpsService.getConversations(this.selectedPersona.personaCode);
        
        console.log('📜 [ChatTab] History API response:', response);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          this.messages = [];
          this.pendingMessages = [];
          
          const normalizedConversations = response.data.map(conv => ({
            ...conv,
            userQuery: conv.userQuery,
            conversationId: conv.conversationId || conv.id || Date.now()
          }));
          
          console.log('📝 [ChatTab] Normalized conversations:', normalizedConversations);
          
          const historyMessages = aiChatOpsService.convertConversationsToMessages(normalizedConversations);
          
          console.log('💬 [ChatTab] History messages:', historyMessages);
          
          if (historyMessages.length > 0) {
            this.messages = historyMessages;
            this.$nextTick(() => {
              this.setInitialScrollPosition();
            });
          } else {
            console.log('💭 [ChatTab] No history messages to display');
          }
        } else {
          console.warn('🚫 [ChatTab] Invalid history response:', response);
        }
      } catch (error) {
        console.error('❌ [ChatTab] 페르소나 히스토리 로드 실패:', error);
        this.addErrorMessage('히스토리를 불러오는 중 오류가 발생했습니다.');
      } finally {
        this.loadingHistory = false;
        this.isInitialLoad = false;
      }
    },

    measureMemoryUsage() {
      if (performance.memory) {
        const memory = performance.memory;
        this.memoryUsage = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024)
        };
      }
    },

    startMemoryMonitoring() {
      if (this.isDevelopment && performance.memory) {
        this.memoryMonitorInterval = setInterval(() => {
          this.measureMemoryUsage();
        }, 30000);
        this.measureMemoryUsage();
      }
    },

    stopMemoryMonitoring() {
      if (this.memoryMonitorInterval) {
        clearInterval(this.memoryMonitorInterval);
        this.memoryMonitorInterval = null;
      }
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      if (!textarea) return;

      const manager = this.enhancedInputManager;
      
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, manager.minHeight), manager.maxHeight);
      textarea.style.height = newHeight + 'px';
      
      const lineCount = Math.ceil(newHeight / 24);
      manager.currentState.lineCount = lineCount;
      manager.currentState.isExpanded = newHeight > manager.minHeight + 20;
      manager.currentState.hasScrolled = textarea.scrollHeight > manager.maxHeight;
      
      this.updateInputContainerClasses();
    },

    updateInputContainerClasses() {
      const container = this.$refs.messageInput?.closest('.input-container');
      if (!container) return;
      
      const manager = this.enhancedInputManager;
      
      if (manager.currentState.isExpanded) {
        container.classList.add('enhanced-input--expanded');
      } else {
        container.classList.remove('enhanced-input--expanded');
      }
      
      if (manager.currentState.hasScrolled) {
        container.classList.add('enhanced-input--scrolling');
      }
      else {
        container.classList.remove('enhanced-input--scrolling');
      }
    },

    applyInputVisualFeedback() {
      const container = this.$refs.messageInput?.closest('.input-container');
      if (container) {
        container.classList.add('enhanced-input--focused');
        setTimeout(() => {
          container.classList.remove('enhanced-input--focused');
        }, 150);
      }
    },

    handleKeyDown(event) {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          return;
        } else {
          event.preventDefault();
          if (this.canSendMessage) {
            this.sendMessage();
          }
          return;
        }
      }
      
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (this.canSendMessage) {
          this.sendMessage();
        }
        return;
      }
      
      if (event.ctrlKey && event.key === 'a') {
        return;
      }
    },

    handleInput() {
      this.trackInputChanges();
    },

    handleFocus() {
      this.applyInputVisualFeedback();
    },

    trackInputChanges() {
      this.adjustTextareaHeight();
    },
    
    toggleContinuousChat() {
      this.continuousChatEnabled = !this.continuousChatEnabled;
    },

    async sendMessage() {
      console.log('🚀 [ChatTab] sendMessage called:', {
        canSend: this.canSendMessage,
        hasPersona: !!this.selectedPersona,
        currentMessage: this.currentMessage
      });
      
      if (!this.canSendMessage || !this.selectedPersona) {
        console.warn('🚫 [ChatTab] Cannot send message:', {
          canSend: this.canSendMessage,
          hasPersona: !!this.selectedPersona
        });
        return;
      }
      
      const messageContent = this.currentMessage.trim();
      const plainTextContent = aiChatOpsService.htmlToPlainText(messageContent);
      
      console.log('📝 [ChatTab] Processing message:', {
        original: messageContent,
        plainText: plainTextContent
      });
      
      const userMessage = {
        id: `user-${this.generateUniqueId()}`,
        type: 'user',
        content: messageContent,
        timestamp: new Date(),
        isLoading: false
      };
      
      console.log('💬 [ChatTab] Created user message:', userMessage);
      
      this.addMessageWithLimit(userMessage);
      this.currentMessage = '';
      
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.style.height = this.enhancedInputManager.minHeight + 'px';
          textarea.classList.remove('enhanced-input--scrolling');
          this.enhancedInputManager.currentState.hasScrolled = false;
          this.applyInputVisualFeedback();
        }
      });
      
      this.startLoadingMessages();
      
      let queryHistory = null;
      
      if (this.continuousChatEnabled && this.recentConversations.length > 0) {
        queryHistory = this.recentConversations.map(conv => ({
          question: aiChatOpsService.htmlToPlainText(conv.question),
          answer: aiChatOpsService.htmlToPlainText(conv.answer)
        }));
      }
      
      try {
        const messageData = {
          personaCode: this.selectedPersona.personaCode,
          userQuery: plainTextContent,
          sessionId: this.getSessionId(),
          currentLanguage: this.currentLanguage
        };
        
        if (queryHistory) {
          messageData.queryHistory = queryHistory;
        }
        
        console.log('🚀 [ChatTab] Emitting message-sent:', messageData);
        this.lastApiCall = {
          timestamp: new Date(),
          data: messageData,
          status: 'sent'
        };
        
        this.$emit('message-sent', messageData);
        
      } catch (error) {
        console.error('❌ [ChatTab] 메시지 전송 오류:', error);
        this.lastApiCall = {
          timestamp: new Date(),
          error: error,
          status: 'failed'
        };
        
        this.addAiResponse({
          success: false,
          message: '메시지 전송 중 오류가 발생했습니다.'
        });
      }
    },

    // 빠른 질문 클릭 시 바로 전송하도록 수정
    sendQuickQuestion(question) {
      this.currentMessage = question;
      this.showQuickQuestions = false;
      this.quickQuestions = [];
      
      // 바로 전송
      this.$nextTick(() => {
        this.sendMessage();
      });
    },

    addAiResponse(response) {
      console.log('🚀 [ChatTab] addAiResponse called:', response);
      
      if (this.loadingMessageId) {
        const loadingIndex = this.messages.findIndex(msg => msg.id === this.loadingMessageId);
        if (loadingIndex !== -1) {
          console.log('🗑️ [ChatTab] Removing loading message:', this.loadingMessageId);
          this.messages.splice(loadingIndex, 1);
        }
        this.loadingMessageId = null;
      }
      
      this.stopLoadingMessages();
      
      let responseMessage;
      
      if (response.success) {
        // API 응답 구조 통일: response.data.success와 response.data.aiQuery 우선 처리
        const aiResponseContent = response.data?.aiResponse || 
                                 response.data?.aiQuery || 
                                 response.aiResponse || 
                                 response.aiQuery ||
                                 response.message ||
                                 '응답을 받았습니다.';
        
        console.log('💬 [ChatTab] AI Response content extraction:', {
          'response.data?.aiResponse': response.data?.aiResponse,
          'response.data?.aiQuery': response.data?.aiQuery,
          'response.aiResponse': response.aiResponse,
          'response.aiQuery': response.aiQuery,
          'response.message': response.message,
          'finalContent': aiResponseContent
        });
        
        responseMessage = {
          id: `ai-${this.generateUniqueId()}`,
          type: 'ai',
          content: aiResponseContent,
          timestamp: new Date(),
          isLoading: false,
          conversationId: response.data?.conversationId || response.conversationId || response.id || Date.now()
        };
      } else {
        const errorContent = response.message || response.errorMessage || this.getText('aiError');
        console.warn('🚫 [ChatTab] Error response:', {
          'response.message': response.message,
          'response.errorMessage': response.errorMessage,
          'getText(aiError)': this.getText('aiError'),
          'finalContent': errorContent
        });
        
        responseMessage = {
          id: `error-${this.generateUniqueId()}`,
          type: 'ai',
          content: errorContent,
          timestamp: new Date(),
          isError: true,
          isLoading: false
        };
      }
      
      console.log('💬 [ChatTab] Created response message:', responseMessage);
      
      this.addMessageWithLimit(responseMessage);
      
      // API 호출 상태 업데이트
      if (this.lastApiCall) {
        this.lastApiCall.status = 'completed';
        this.lastApiCall.response = response;
      }
    },
    
    addErrorMessage(errorText) {
      const errorMessage = {
        id: `error-${this.generateUniqueId()}`,
        type: 'ai',
        content: errorText,
        timestamp: new Date(),
        isError: true,
        isLoading: false
      };
      
      console.log('❌ [ChatTab] Adding error message:', errorMessage);
      this.addMessageWithLimit(errorMessage);
    },

    async generateQuickQuestions() {
      if (this.isQuickQuestionsLoading || this.isProcessing) return;
      
      this.isQuickQuestionsLoading = true;
      
      try {
        const questionData = {
          personaCode: this.selectedPersona.personaCode,
          currentLanguage: this.currentLanguage
        };
        
        const response = await aiChatOpsService.generateQuickQuestions(questionData);
        
        if (response.success) {
          // API 응답 구조 통일: response.data.success와 response.data.aiQuery 우선 처리
          const quickQuestionsData = response.data?.questions || 
                                    response.data?.aiQuery || 
                                    response.questions || 
                                    response.data || 
                                    response.aiQuery ||
                                    response.aiResponse;
          this.displayQuickQuestionsResponse(quickQuestionsData);
        } else {
          throw new Error(response.message || response.errorMessage);
        }
        
      } catch (error) {
        console.error('빠른 질문 생성 오류:', error);
        
        // 기본 질문으로 폴백
        this.quickQuestions = this.getDefaultQuickQuestions();
        this.showQuickQuestions = true;
      } finally {
        this.isQuickQuestionsLoading = false;
      }
    },

    generateQuestionPrompt() {
      const persona = this.selectedPersona;
      const category = this.selectedCategory;
      
      return `현재 대화 상황에 맞는 유용하고 실용적인 빠른 질문 3-5개를 생성해주세요. \n\n컨텍스트:\n- 페르소나: ${persona?.personaName || '일반'}\n- 카테고리: ${category || '일반 문의'}\n- 언어: ${this.currentLanguage === 'ko' ? '한국어' : 'English'}\n\n요구사항:\n1. 질문은 간결하고 명확해야 함\n2. 사용자가 즉시 클릭할 수 있는 형태로 제시\n3. 현재 대화 맥락에 연관성 있는 내용\n4. 다양한 주제와 난이도로 구성\n\n반드시 다음 형식으로 답변해주세요:\n["질문1", "질문2", "질문3", ...] 형태의 JSON 배열`;
    },

    getLoadingMessage() {
      const messages = getTextArray(this.currentLanguage, 'loadingMessages');
      if (messages && messages.length > 0) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
      }
      
      return this.currentLanguage === 'ko' ? 
        '응답을 생성하고 있습니다...' : 
        'Generating response...';
    },

    displayQuickQuestionsResponse(responseData) {
      try {
        let questionsList = [];
        
        if (typeof responseData === 'string') {
          const jsonMatch = responseData.match(/\[.*\]/);
          if (jsonMatch) {
            questionsList = JSON.parse(jsonMatch[0]);
          } else {
            questionsList = responseData.split('\n')
              .filter(q => q.trim())
              .map(q => q.replace(/^[-\*•]\s*/, '').trim())
              .slice(0, 5);
          }
        } else if (Array.isArray(responseData)) {
          questionsList = responseData.slice(0, 5);
        } else if (responseData && typeof responseData === 'object') {
          questionsList = responseData.questions || responseData.queries || responseData.data || [];
          if (typeof questionsList === 'string') {
            questionsList = [questionsList];
          }
        }
        
        questionsList = questionsList.filter(q => q && q.trim()).slice(0, 5);
        
        if (questionsList.length > 0) {
          this.quickQuestions = questionsList;
          this.showQuickQuestions = true;
        } else {
          throw new Error('빠른 질문 목록이 비어있습니다.');
        }
        
      } catch (error) {
        console.error('빠른 질문 답변 처리 오류:', error);
        
        this.quickQuestions = this.getDefaultQuickQuestions();
        this.showQuickQuestions = true;
      }
    },

    getDefaultQuickQuestions() {
      return [
        '안녕하세요! 어떻게 도와드릴까요?',
        '오늘 주요 업무는 무엇인가요?',
        '업무 효율성을 높이는 방법은?',
        '현재 진행 중인 프로젝트는?',
        '추천하고 싶은 도구나 방법이 있나요?'
      ];
    },

    startLoadingMessages() {
      if (this.loadingMessageId) return;
      
      const loadingMessage = {
        id: `loading-${this.generateUniqueId()}`,
        type: 'ai',
        content: this.getLoadingMessage(),
        timestamp: new Date(),
        isLoading: true
      };
      
      this.addMessageWithLimit(loadingMessage);
      this.loadingMessageId = loadingMessage.id;
      
      this.loadingInterval = setInterval(() => {
        const loadingIndex = this.messages.findIndex(msg => msg.id === this.loadingMessageId);
        if (loadingIndex !== -1) {
          this.messages[loadingIndex].content = this.getLoadingMessage();
        }
      }, 3000);
    },

    stopLoadingMessages() {
      if (this.loadingInterval) {
        clearInterval(this.loadingInterval);
        this.loadingInterval = null;
      }
    },

    addMessageWithLimit(newMessage) {
      console.log('📝 [ChatTab] addMessageWithLimit:', {
        message: newMessage,
        currentMessagesCount: this.messages.length,
        pendingCount: this.pendingMessages.length
      });
      
      this.pendingMessages.push(newMessage);
      this.scheduleBatchUpdate();
    },

    scheduleBatchUpdate() {
      if (this.renderingScheduled) return;
      
      this.renderingScheduled = true;
      
      this.$nextTick(() => {
        this.processBatchMessages();
        this.renderingScheduled = false;
      });
    },

    processBatchMessages() {
      if (this.pendingMessages.length === 0) return;

      this.messages.push(...this.pendingMessages);
      
      if (this.messages.length > this.maxSessionMessages) {
        const excessCount = this.messages.length - this.maxSessionMessages;
        const removeCount = Math.ceil(excessCount / 2) * 2;
        this.messages.splice(0, removeCount);
      }
      
      this.pendingMessages = [];
      
      this.$nextTick(() => {
        this.scrollToBottomSmooth();
      });
    },

    scrollToBottomInstantly() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'auto'
          });
        }
      });
    },

    scrollToBottomSmooth() {
      if (this.renderingScheduled) {
        this.$nextTick(() => {
          this.scrollToBottomSmooth();
        });
        return;
      }

      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    },

    setInitialScrollPosition() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.style.scrollBehavior = 'auto';
          container.scrollTop = container.scrollHeight;
          
          setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
          }, 100);
        }
      });
    },

    async handleCopyMessage(message) {
      try {
        const textToCopy = aiChatOpsService.htmlToPlainText(message.content);
        await navigator.clipboard.writeText(textToCopy);
        console.log('메시지가 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
      }
    },

    handleRegenerateMessage(message) {
      if (message.type === 'ai' && this.messages.length >= 2) {
        for (let i = this.messages.length - 1; i >= 0; i--) {
          if (this.messages[i].type === 'user') {
            this.currentMessage = this.messages[i].content;
            this.sendMessage();
            break;
          }
        }
      }
    },

    handleFeedbackMessage(message) {
      this.$emit('show-feedback', {
        messageId: message.id,
        content: message.content
      });
    },

    // 외부 클릭 감지 로직 추가
    handleClickOutside(event) {
      if (this.showQuickQuestions) {
        const dropdown = this.$refs.quickQuestionsDropdown;
        const inputArea = this.$refs.inputArea;
        
        if (dropdown && !dropdown.contains(event.target) && 
            inputArea && !inputArea.contains(event.target)) {
          this.showQuickQuestions = false;
        }
      }
    },

    clearChatHistory() {
      this.messages = [];
      this.pendingMessages = [];
      this.currentMessage = '';
      this.showQuickQuestions = false;
      this.quickQuestions = [];
      this.stopLoadingMessages();
    },
    
    resetToInitialState() {
      this.stopLoadingMessages();
      this.stopMemoryMonitoring();
      
      Object.assign(this, {
        currentMessage: '',
        messages: [],
        loadingHistory: false,
        currentLoadingMessage: '',
        loadingMessageId: null,
        showQuickQuestions: false,
        quickQuestions: [],
        continuousChatEnabled: true,
        isQuickQuestionsLoading: false,
        isInitialLoad: false,
        pendingMessages: [],
        renderingScheduled: false
      });
      
      this.enhancedInputManager.currentState = {
        isExpanded: false,
        hasScrolled: false,
        lineCount: 1
      };
    }
  },
  
  mounted() {
    this.$nextTick(() => {
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.style.height = `${this.enhancedInputManager.minHeight}px`;
        this.applyInputVisualFeedback();
      }
    });
    
    this.startMemoryMonitoring();
    
    if (this.isDevelopment) {
      document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'd') {
          this.showDevInfo = !this.showDevInfo;
        }
      });
    }
    
    // 외부 클릭 이벤트 리스너 추가
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeDestroy() {
    this.stopLoadingMessages();
    this.stopMemoryMonitoring();
    
    if (this.batchUpdateTimeout) {
      clearTimeout(this.batchUpdateTimeout);
      this.batchUpdateTimeout = null;
    }
    
    // 외부 클릭 이벤트 리스너 제거
    document.removeEventListener('click', this.handleClickOutside);
    
    Object.assign(this, {
      messages: [],
      currentMessage: '',
      pendingMessages: [],
      renderingScheduled: false,
      loadingMessageId: null,
      loadingInterval: null,
      memoryMonitorInterval: null
    });
  }
};
</script>

<style scoped>
.chat-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface-light);
  position: relative;
}

.no-persona-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--space-xl);
}

.persona-selection-guide {
  text-align: center;
  max-width: 320px;
}

.guide-icon {
  margin-bottom: var(--space-lg);
  color: var(--color-text-muted);
}

.guide-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.guide-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface-white);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg) var(--space-xl) var(--space-md);
  scroll-behavior: smooth;
  background: var(--color-surface-light);
}

.messages-container.smooth-scroll {
  scroll-behavior: smooth;
}

.messages-container.initial-loading {
  scroll-behavior: auto;
}

.loading-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  margin-bottom: var(--space-xl);
}

.welcome-content {
  text-align: center;
  max-width: 400px;
}

.welcome-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.persona-avatar {
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  color: var(--color-text-light);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
}

.welcome-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.welcome-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.input-area {
  background: var(--color-surface-white);
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-md) var(--space-xl) var(--space-lg);
  z-index: 5;
  position: relative;
}

/* 빠른 질문 드롭다운 스타일 */
.quick-questions-dropdown {
  position: absolute;
  top: -8px;
  left: var(--space-xl);
  right: var(--space-xl);
  background: var(--color-surface-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-moderate);
  z-index: 10;
  transform: translateY(-100%);
}

.quick-questions-list {
  max-height: 200px;
  overflow-y: auto;
}

.quick-question-item {
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  border-bottom: 1px solid var(--color-border-light);
  transition: background-color var(--motion-fast);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.quick-question-item:last-child {
  border-bottom: none;
}

.quick-question-item:hover {
  background-color: var(--color-accent-subtle);
}

.quick-question-item:active {
  background-color: var(--color-accent-medium);
}

.input-container {
  padding: var(--space-sm);
  transition: all var(--motion-fast);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-container.enhanced-input--focused {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
  transform: translateY(-1px);
}

.input-container.enhanced-input--expanded {
  border-color: var(--color-accent-secondary);
}

.input-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.message-textarea {
  width: 100%;
  height: 38px;
  min-height: 38px;
  max-height: 400px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background: var(--color-surface-white);
  resize: none;
  outline: none;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  line-height: 1.5;
  padding: var(--space-sm);
  margin: 0;
  transition: none;
  overflow: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
  border-radius: var(--radius-md);
}

.message-textarea::placeholder {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  opacity: 0.7;
}

.message-textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-text {
  margin-left: 4px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
}

.quick-questions-generate-btn,
.continuous-chat-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm) !important;
  transition: all 0.2s ease;
  border-radius: var(--radius-md);
  background: transparent !important;
  border: none !important;
}

.quick-questions-generate-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
}

.continuous-chat-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.15);
}

.send-button-enhanced {
  position: relative;
}

.send-button-enhanced.loading {
  animation: pulse-send-enhanced 1.8s ease-in-out infinite;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-border-light);
  border-top: 2px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse-send-enhanced {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}

.dev-info-tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: var(--color-text-primary);
  color: var(--color-text-light);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  z-index: 1000;
  margin-bottom: var(--space-sm);
  border: 1px solid var(--color-border-medium);
  box-shadow: var(--shadow-moderate);
  font-family: 'Monaco', 'Menlo', 'SF Mono', 'Consolas', 'Courier New', monospace;
  backdrop-filter: blur(var(--blur-strong));
  -webkit-backdrop-filter: blur(var(--blur-strong));
}

.dev-info-header {
  font-weight: 600;
  margin-bottom: var(--space-xs);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: var(--space-xs);
}

.dev-info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dev-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
}

.dev-label {
  opacity: 0.8;
}

.dev-value {
  font-weight: 600;
  color: var(--color-accent-secondary);
}

.dev-value--active {
  color: var(--color-success) !important;
  position: relative;
}

.dev-value--active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--color-success);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 0.7;
    transform: translateY(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-50%) scale(1.2);
    box-shadow: 0 0 8px var(--color-success);
  }
}

.input-container.enhanced-input--scrolling::after {
  content: "↕️ 스크롤하여 전체 내용 확인";
  position: absolute;
  bottom: -22px;
  right: 0;
  font-size: 10px;
  color: var(--color-text-muted);
  background: var(--color-surface-white);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--color-border-light);
  z-index: 5;
}

@media (max-width: 768px) {
  .quick-questions-generate-btn,
  .continuous-chat-btn {
    min-width: auto;
    padding: var(--space-sm) !important;
  }
  
  .btn-text {
    display: none;
  }
}

@media (max-width: 640px) {
  .input-area {
    padding: var(--space-sm) var(--space-md) var(--space-sm);
  }
  
  .input-container {
    padding: 6px;
  }
  
  .input-box {
    gap: 6px;
  }
  
  .message-textarea {
    height: 21px;
    min-height: 21px;
  }
  
  .left-actions {
    gap: 4px;
  }
  
  .dev-info-tooltip {
    font-size: 10px;
    min-width: 140px;
  }

  .dev-info-header,
  .dev-label,
  .dev-value {
    font-size: 9px;
  }
  
  .quick-questions-dropdown {
    left: var(--space-md);
    right: var(--space-md);
  }
}

/* 채팅 헤더 스타일 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface-white);
  border-bottom: 1px solid var(--color-border-light);
  min-height: 56px;
}

.persona-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.persona-badge {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}
</style>