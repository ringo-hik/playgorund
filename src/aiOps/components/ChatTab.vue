<template>
  <div class="chat-tab">
    <!-- 🏠 홈 화면 또는 채팅 화면 조건부 표시 -->
    <div v-if="!selectedPersona" class="no-persona-selected">
      <div class="persona-selection-guide">
        <div class="guide-icon">
          <!-- 🎯 홈으로 돌아가라는 의미의 아이콘으로 변경 -->
          <LucideIcon name="home-heart" fill="none" stroke="currentColor" :width="24" :height="24" />
        </div>
        <h3 class="guide-title">{{ getText('noPersonaSelected') }}</h3>
        <p class="guide-description">{{ getText('noPersonaDesc') }}</p>
      </div>
    </div>

    <!-- 🤖 채팅 화면 -->
    <div v-else class="chat-interface">
      <!-- 📝 메시지 목록 영역 -->
      <div ref="messagesContainer" class="messages-container" :class="messagesClasses">
        <!-- 히스토리 로딩 상태 -->
        <div v-if="loadingHistory" class="loading-history">
          <Elements component-type="spinner" size="sm" color="accent" />
          <span class="loading-text">{{ getText('loadingHistory') }}</span>
        </div>

        <!-- 환영 메시지 -->
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

        <!-- 📬 메시지 목록 -->
        <div class="messages-list">
          <Elements
            v-for="message in messages"
            :key="message.id"
            component-type="message"
            :message="message"
            :current-language="currentLanguage"
            @copy-message="handleCopyMessage"
            @regenerate-message="handleRegenerateMessage"
            @feedback-message="handleFeedbackMessage"
          />
        </div>
      </div>

      <!-- 📝 입력 영역 -->
      <div class="input-area">
        <!-- 🎯 빠른 질문 버튼들 (통일된 네이밍) -->
        <div v-if="showQuickQuestions && quickQuestions.length > 0" class="quick-questions-section">
          <div class="quick-questions-header">
            <span class="quick-questions-title">{{ getText('quickQuestions') || '빠른 질문' }}</span>
            <button @click="showQuickQuestions = false" class="btn-system btn-system--ghost btn-system--sm">
              <LucideIcon name="x" fill="currentColor" :width="12" :height="12" />
            </button>
          </div>
          <div class="quick-questions-list">
            <button
              v-for="question in quickQuestions" 
              :key="question" 
              @click="sendQuickQuestion(question)" 
              class="btn-system btn-system--ghost btn-system--sm quick-question-item"
            >
              {{ question }}
            </button>
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
                <!-- 🎯 개선된 빠른 질문 생성 버튼 (통일된 네이밍) -->
                <button
                  @click="generateQuickQuestions" 
                  :disabled="isProcessing || isQuickQuestionsLoading"
                  :class="[
                    'btn-system', 
                    'btn-system--quick-action', 
                    'btn-system--sm', 
                    'quick-questions-generate-btn', 
                    { 
                      'btn-system--icon-only': !isExpanded, 
                      'loading': isQuickQuestionsLoading 
                    }
                  ]"
                  :title="getText('generateQuestions') || '질문 생성하기'"
                >
                  <div v-if="isQuickQuestionsLoading" class="loading-spinner"></div>
                  <LucideIcon v-else name="sparkles" fill="currentColor" :width="12" :height="12" />
                  <span v-if="isExpanded" class="btn-text-enhanced">{{ getText('generateQuestions') || '질문 생성하기' }}</span>
                </button>
                
                <!-- 🎯 연속/단일 토글 버튼 -->
                <button
                  @click="toggleContinuousChat"
                  :disabled="isProcessing"
                  :class="[
                    'btn-system',
                    continuousChatEnabled ? 'btn-system--continuous-active' : 'btn-system--ghost',
                    'btn-system--sm',
                    'continuous-chat-enhanced-btn',
                    {
                      'btn-system--icon-only': !isExpanded
                    }
                  ]"
                  :title="continuousChatEnabled ? '단일 대화로 전환' : '연속 대화로 전환'"
                >
                  <LucideIcon :name="continuousChatEnabled ? 'layers' : 'message-square'" fill="currentColor" :width="12" :height="12" />
                  <span v-if="isExpanded" class="btn-text-enhanced">
                    {{ continuousChatEnabled ? '단일 대화' : '연속 대화' }}
                  </span>
                </button>
              </div>
              
              <!-- 🎯 개선된 전송 버튼 -->
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

        <!-- 🔧 개발자 정보 (개발 모드에서만) -->
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
      // 🔧 수정: 네이밍 통일 (quickQuery → quickQuestions)
      showQuickQuestions: false,
      quickQuestions: [],
      continuousChatEnabled: true,
      // 🔧 수정: 네이밍 통일 (isQuickQueryLoading → isQuickQuestionsLoading)
      isQuickQuestionsLoading: false,
      isInitialLoad: false,
      maxSessionMessages: 30,
      memoryUsage: { used: 0, total: 0 },
      memoryMonitorInterval: null,
      isDevelopment: process.env.NODE_ENV === 'development',
      showDevInfo: false,
      
      // 🔧 배치 처리를 위한 상태
      pendingMessages: [],
      renderingScheduled: false,
      batchUpdateTimeout: null,
      
      // 🔧 Enhanced Input Manager
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
    
    // 🎯 연속 대화를 위한 최근 대화 관리
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
    
    // 반응형 UI: 채팅창 확대 상태 판단
    isExpanded() {
      if (!this.windowSize) return false;
      return this.windowSize.width > 600 || this.windowSize.height > 800;
    }
  },
  
  watch: {
    currentLanguage() {
      this.$nextTick(() => {
        this.trackInputChanges();
      });
    },
    
    isProcessing(newVal) {
      if (!newVal) {
        this.stopLoadingMessages();
      }
      if (newVal) {
        // 🔧 수정: 네이밍 통일
        this.showQuickQuestions = false;
      }
    },
    
    selectedPersona: {
      handler(newPersona) {
        if (newPersona) {
          this.loadPersonaHistory();
        }
      },
      immediate: true
    }
  },
  
  methods: {
    getText,
    
    // 🎯 페르소나 관련 유틸리티
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

    // 🎯 페르소나 히스토리 로드
    async loadPersonaHistory() {
      if (!this.selectedPersona?.personaCode) return;
      
      this.loadingHistory = true;
      this.isInitialLoad = true;
      
      try {
        const response = await aiChatOpsService.getConversations(this.selectedPersona.personaCode);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          this.messages = [];
          this.pendingMessages = [];
          
          // 🔧 수정: API 응답 정규화
          const normalizedConversations = response.data.map(conv => ({
            ...conv,
            userQuery: conv.userQuery,
            conversationId: conv.conversationId || conv.id || Date.now()
          }));
          
          const historyMessages = aiChatOpsService.convertConversationsToMessages(normalizedConversations);
          
          if (historyMessages.length > 0) {
            this.messages = historyMessages;
            this.$nextTick(() => {
              this.setInitialScrollPosition();
            });
          }
        }
      } catch (error) {
        console.error('페르소나 히스토리 로드 실패:', error);
      } finally {
        this.loadingHistory = false;
        this.isInitialLoad = false;
      }
    },

    // 🎯 메모리 모니터링 시스템
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

    // 🎯 향상된 텍스트에어리어 관리
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

    // 🎯 키보드 이벤트 처리
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

    // 🔧 수정: 함수명 통일
    toggleQuickQuestions() {
      this.showQuickQuestions = !this.showQuickQuestions;
    },
    
    toggleContinuousChat() {
      this.continuousChatEnabled = !this.continuousChatEnabled;
    },

    // 🎯 메시지 전송 (핵심 로직)
    async sendMessage() {
      if (!this.canSendMessage || !this.selectedPersona) return;
      
      const messageContent = this.currentMessage.trim();
      const plainTextContent = aiChatOpsService.htmlToPlainText(messageContent);
      
      const userMessage = {
        id: `user-${this.generateUniqueId()}`,
        type: 'user',
        content: messageContent,
        timestamp: new Date(),
        isLoading: false
      };
      
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
          question: conv.question,
          answer: conv.answer
        }));
      }
      
      try {
        const messageData = {
          personaCode: this.selectedPersona.personaCode,
          userQuery: plainTextContent, // 🔧 수정: 표준화된 필드명
          sessionId: this.getSessionId(),
          currentLanguage: this.currentLanguage
        };
        
        if (queryHistory) {
          messageData.queryHistory = queryHistory;
        }
        
        const response = await aiChatOpsService.sendMessage(messageData);
        this.addAiResponse(response);
        
      } catch (error) {
        console.error('메시지 전송 오류:', error);
        this.addAiResponse({
          success: false,
          message: '메시지 전송 중 오류가 발생했습니다.'
        });
      }
    },

    // 🔧 수정: 함수명 통일 (sendQuickQuery → sendQuickQuestion)
    sendQuickQuestion(question) {
      this.currentMessage = question;
      this.showQuickQuestions = false;
      this.quickQuestions = [];
      
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.focus();
          this.trackInputChanges();
        }
      });
    },

    // 🎯 AI 응답 추가
    addAiResponse(response) {
      if (this.loadingMessageId) {
        const loadingIndex = this.messages.findIndex(msg => msg.id === this.loadingMessageId);
        if (loadingIndex !== -1) {
          this.messages.splice(loadingIndex, 1);
        }
        this.loadingMessageId = null;
      }
      
      this.stopLoadingMessages();
      
      let responseMessage;
      
      if (response.success) {
        // 🔧 수정: API 응답 처리 표준화
        const aiResponseContent = response.data?.aiResponse || response.aiResponse || response.message || '응답을 받았습니다.';
        
        responseMessage = {
          id: `ai-${this.generateUniqueId()}`,
          type: 'ai',
          content: aiResponseContent,
          timestamp: new Date(),
          isLoading: false,
          conversationId: response.data?.conversationId || response.conversationId || response.id || Date.now()
        };
      } else {
        responseMessage = {
          id: `error-${this.generateUniqueId()}`,
          type: 'ai',
          content: response.message || response.errorMessage || this.getText('aiError'),
          timestamp: new Date(),
          isError: true,
          isLoading: false
        };
      }
      
      this.addMessageWithLimit(responseMessage);
    },

    async generateQuickQuestions() {
      if (this.isQuickQuestionsLoading || this.isProcessing) return;
      
      this.isQuickQuestionsLoading = true;
      
      try {
        const loadingMessage = {
          id: 'quick-questions-loading-' + Date.now(),
          type: 'ai',
          content: this.getLoadingMessage(),
          timestamp: new Date(),
          isLoading: true
        };
        
        this.addMessageWithLimit(loadingMessage);
        
        const questionPrompt = this.generateQuestionPrompt();
        const plainTextPrompt = aiChatOpsService.htmlToPlainText(questionPrompt);
        
        const questionData = {
          personaCode: this.selectedPersona.personaCode,
          conversationContext: plainTextPrompt,
          currentLanguage: this.currentLanguage
        };
        
        const response = await aiChatOpsService.generateQuickQuestions(questionData);
        
        const loadingIndex = this.messages.findIndex(msg => msg.id === loadingMessage.id);
        if (loadingIndex !== -1) {
          this.messages.splice(loadingIndex, 1);
        }
        
        if (response.success) {
          // 🔧 수정: API 응답 처리 표준화
          const quickQuestionsData = response.data?.questions || response.questions || response.data || response.aiResponse;
          this.displayQuickQuestionsResponse(quickQuestionsData);
        } else {
          throw new Error(response.message || response.errorMessage);
        }
        
      } catch (error) {
        console.error('빠른 질문 생성 오류:', error);
        
        const errorMessage = {
          id: 'error-' + Date.now(),
          type: 'ai',
          content: '빠른 질문 생성 중 오류가 발생했습니다. 다시 시도해 주세요.',
          timestamp: new Date(),
          isError: true
        };
        
        this.addMessageWithLimit(errorMessage);
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

    // 🔧 수정: 함수명 통일 (displayQuickQueryResponse → displayQuickQuestionsResponse)
    displayQuickQuestionsResponse(responseData) {
      try {
        let questionsList = [];
        
        if (typeof responseData === 'string') {
          const jsonMatch = responseData.match(/\\[.*\\]/);
          if (jsonMatch) {
            questionsList = JSON.parse(jsonMatch[0]);
          } else {
            questionsList = responseData.split('\n')
              .filter(q => q.trim())
              .map(q => q.replace(/^[-\*•]\\s*/, '').trim())
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
          
          const successMessage = {
            id: 'quick-questions-success-' + Date.now(),
            type: 'ai',
            content: `현재 대화에 맞는 빠른 질문 ${questionsList.length}개를 준비했습니다. 아래에서 선택해주세요!`,
            timestamp: new Date(),
            isQuickQuestions: true
          };
          
          this.addMessageWithLimit(successMessage);
        } else {
          throw new Error('빠른 질문 목록이 비어있습니다.');
        }
        
      } catch (error) {
        console.error('빠른 질문 답변 처리 오류:', error);
        
        this.quickQuestions = this.getDefaultQuickQuestions();
        this.showQuickQuestions = true;
        
        const fallbackMessage = {
          id: 'quick-questions-fallback-' + Date.now(),
          type: 'ai',
          content: '빠른 질문 생성에 실패했지만, 기본 질문들을 준비했습니다. 아래에서 선택해주세요!',
          timestamp: new Date(),
          isQuickQuestions: true
        };
        
        this.addMessageWithLimit(fallbackMessage);
      }
    },

    // 🔧 수정: 함수명 통일 (getDefaultQuickQuery → getDefaultQuickQuestions)
    getDefaultQuickQuestions() {
      return [
        '안녕하세요! 어떻게 도와드릴까요?',
        '오늘 주요 업무는 무엇인가요?',
        '업무 효율성을 높이는 방법은?',
        '현재 진행 중인 프로젝트는?',
        '추천하고 싶은 도구나 방법이 있나요?'
      ];
    },

    // 🎯 로딩 메시지 관리
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

    // 🔧 메시지 추가 배치 처리 시스템
    addMessageWithLimit(newMessage) {
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

    // 🎯 스크롤 관리 시스템
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

    // 🎯 메시지 액션 핸들러들
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

    // 🎯 초기 상태로 리셋
    resetToInitialState() {
      this.stopLoadingMessages();
      this.stopMemoryMonitoring();
      
      Object.assign(this, {
        currentMessage: '',
        messages: [],
        loadingHistory: false,
        currentLoadingMessage: '',
        loadingMessageId: null,
        // 🔧 수정: 네이밍 통일
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
  },
  
  beforeDestroy() {
    this.stopLoadingMessages();
    this.stopMemoryMonitoring();
    
    if (this.batchUpdateTimeout) {
      clearTimeout(this.batchUpdateTimeout);
      this.batchUpdateTimeout = null;
    }
    
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
/* 🎯 기본 레이아웃 (기존 스타일 유지, 클래스명만 수정) */
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
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg) var(--space-xl) var(--space-md);
  scroll-behavior: smooth;
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

/* 🔧 수정: 클래스명 통일 (quick-query → quick-questions) */
.input-area {
  background: var(--color-surface-white);
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-md) var(--space-xl) var(--space-lg);
  z-index: 5;
}

.quick-questions-section {
  margin-bottom: var(--space-md);
  background: var(--color-surface-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.quick-questions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.quick-questions-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.quick-questions-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.quick-question-item {
  flex: 0 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  text-align: left;
  font-size: var(--font-size-sm);
  transition: transform var(--motion-fast), background-color var(--motion-fast);
}

.quick-question-item:hover {
  transform: translateX(2px);
  background-color: var(--color-accent-subtle);
}

/* 🎯 나머지 스타일들은 기존과 동일하게 유지 */
.input-container {
  padding: var(--space-sm);
  transition: all var(--motion-fast);
  position: relative;
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
  border: none;
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

/* 🔧 수정: 클래스명 통일 */
.quick-questions-generate-btn {
  position: relative;
  transition: all 0.3s ease-out;
  border-radius: var(--radius-lg);
}

.quick-questions-generate-btn:not(.btn-system--icon-only) {
  padding: var(--space-sm) var(--space-lg);
  min-width: 120px;
}

.quick-questions-generate-btn .btn-text-enhanced {
  margin-left: var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
}

.quick-questions-generate-btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

.continuous-chat-enhanced-btn {
  position: relative;
  transition: all 0.3s ease-out;
  border-radius: var(--radius-lg);
}

.continuous-chat-enhanced-btn:not(.btn-system--icon-only) {
  padding: var(--space-sm) var(--space-lg);
  min-width: 100px;
}

.continuous-chat-enhanced-btn .btn-text-enhanced {
  margin-left: var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
}

.continuous-chat-enhanced-btn:hover {
  transform: translateY(-1px);
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

/* 🎯 개발자 정보 및 기타 스타일들은 기존과 동일 */
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

/* 🎯 반응형 디자인 */
@media (max-width: 768px) {
  .quick-questions-generate-btn:not(.btn-system--icon-only),
  .continuous-chat-enhanced-btn:not(.btn-system--icon-only) {
    min-width: auto;
    padding: var(--space-sm);
  }
  
  .btn-text-enhanced {
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
}
</style>