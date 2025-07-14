<template>
  <div class="chat-tab">
    <div class="chat-area">
      <div class="chat-header">
        <div class="persona-info">
          <div 
            class="badge"
            @mouseenter="showDevInfo = true"
            @mouseleave="showDevInfo = false"
          >
            <unicon 
              :name="getPersonaIconName(selectedPersona)" 
              fill="white" 
              :width="14" 
              :height="14"
            />
            {{ selectedPersona ? selectedPersona.title : getText('selectPersona') }}
            
            <div v-if="showDevInfo && isDevelopment" class="dev-info-tooltip">
              <div class="dev-info-header">
                <unicon name="code-branch" fill="#4ade80" :width="12" :height="12" />
                <span>Developer Info</span>
              </div>
              <div class="dev-info-content">
                <div class="dev-info-item">
                  <span class="dev-label">Memory:</span>
                  <span class="dev-value">{{ memoryUsage.used }}MB</span>
                </div>
                <div class="dev-info-item">
                  <span class="dev-label">Messages:</span>
                  <span class="dev-value">{{ messages.length }}/{{ maxSessionMessages }}</span>
                </div>
                <div class="dev-info-item">
                  <span class="dev-label">Status:</span>
                  <span class="dev-value dev-value--active">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="controls">
          <button
            @click="clearAllMessages" 
            :disabled="isProcessing || !selectedPersona" 
            class="btn-system btn-system--danger btn-system--sm btn-system--icon-only clear-btn"
            title="전체 삭제"
          >
            <unicon name="trash" fill="currentColor" :width="12" :height="12" />
          </button>
          <button
            @click="resetPersona" 
            :disabled="isProcessing" 
            class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="페르소나 변경"
          >
            <unicon name="redo" fill="currentColor" :width="12" :height="12" />
          </button>
          <button
            @click="$emit('go-home')" 
            :disabled="isProcessing" 
            class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="홈으로 가기"
          >
            <unicon name="home" fill="currentColor" :width="12" :height="12" />
          </button>
        </div>
      </div>

      <div class="messages-container">
        <div class="messages" :class="messagesClasses" ref="messagesContainer" @scroll="handleScroll">
          <div v-if="!selectedPersona" class="no-persona">
            <unicon name="grid" fill="var(--color-primary)" :width="48" :height="48" />
            <h4>{{ getText('noPersonaSelected') }}</h4>
            <p>{{ getText('noPersonaDesc') }}</p>
            <button
              @click="$emit('go-home')"
              class="btn-system btn-system--primary btn-system--md go-home-btn"
            >
              <unicon name="home" fill="currentColor" :width="16" :height="16" />
              {{ getText('goHome') }}
            </button>
          </div>
          
          <div v-else-if="selectedPersona && messages.length === 0 && !isProcessing && !loadingHistory" class="welcome">
            <unicon name="star" fill="var(--color-primary)" :width="36" :height="36" />
            <h4>
              {{ getText('welcomeChat', { persona: selectedPersona.title }) }}
            </h4>
            <p class="welcome-desc">{{ getPersonaDescription(selectedPersona) }}</p>
            <div class="welcome-tip">
              <unicon name="info-circle" fill="var(--accent-primary)" :width="14" :height="14" />
              <span>{{ getText('welcomeTip') }}</span>
            </div>
          </div>

          <!-- 🔧 FIX: 로딩 히스토리도 v-show 사용 -->
          <div v-show="loadingHistory" class="loading-history">
            <Elements component-type="spinner" size="md" />
            <span>{{ getText('loadingHistory') }}</span>
          </div>

          <Elements
            v-for="(message, index) in messages" 
            :key="message.id"
            component-type="message"
            :message-type="message.type"
            :content="message.content"
            :loading="message.isLoading"
            :loading-message="currentLoadingMessage"
            :is-error="message.isError"
            :copy-status="message.copyStatus"
            @copy="copyMessage(message)"
          />
        </div>
      </div>

      <div v-if="selectedPersona" class="input-area">
        <!-- 🔧 FIX: 빠른 질문도 v-show 사용 -->
        <div v-show="showQuickQuestions && quickQuestions.length > 0" class="quick-dropdown card-system">
          <div class="quick-questions">
            <button
              v-for="q in quickQuestions" 
              :key="q" 
              @click="sendQuickQuestion(q)" 
              class="btn-system btn-system--ghost btn-system--sm quick-item"
            >
              {{ q }}
            </button>
          </div>
        </div>
        
        <div class="input-container card-system">
          <div class="input-box">
            <textarea 
              v-model="currentMessage" 
              ref="messageInput" 
              :placeholder="getText('inputPlaceholder')"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="handleShiftEnter"
              @input="handleInput"
              @focus="handleFocus"
              :disabled="isProcessing" 
              class="message-textarea form-input enhanced-input"
            />
            
            <div class="input-bottom-row">
              <div class="left-actions">
                <button
                  @click="generateQuickQuestions" 
                  :disabled="isProcessing"
                  class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
                  title="질문 생성하기"
                >
                  <unicon name="lightbulb-alt" fill="currentColor" :width="12" :height="12" />
                </button>
                <button
                  @click="toggleQuickQuestions" 
                  :disabled="isProcessing"
                  :class="['btn-system', 'btn-system--ghost', 'btn-system--sm', 'btn-system--icon-only', { 'btn-system--accent': showQuickQuestions }]"
                  title="빠른 질문"
                >
                  <unicon name="bolt" fill="currentColor" :width="12" :height="12" />
                </button>
                <button
                  @click="toggleContinuousChat" 
                  :disabled="isProcessing"
                  :class="['btn-system', 'btn-system--ghost', 'btn-system--sm', 'btn-system--icon-only', 'continuous-chat-btn', { 'btn-system--success': continuousChatEnabled }]"
                  title="연속 대화"
                >
                  <unicon name="exchange-alt" fill="currentColor" :width="12" :height="12" />
                </button>
              </div>
              
              <button
                @click="sendMessage" 
                :disabled="!canSendMessage" 
                :class="['btn-system', 'btn-system--primary', 'btn-system--sm', 'btn-system--icon-only', 'send-button', { 'loading': isProcessing }]"
                title="메시지 전송"
              >
                <Elements v-if="isProcessing" component-type="spinner" size="sm" color="accent" />
                <unicon v-else name="message" fill="currentColor" :width="14" :height="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import aiChatOpsService from '@/service/aiChatOpsService.js';
import { getText, getTextArray } from '../utils/i18n.js';
import Elements from './Elements.vue';

export default {
  name: 'ChatTab',
  components: {
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
      continuousChatEnabled: false,
      isInitialLoad: false,
      maxSessionMessages: 30,
      memoryUsage: { used: 0, total: 0 },
      memoryMonitorInterval: null,
      isDevelopment: process.env.NODE_ENV === 'development',
      showDevInfo: false,
      
      // 🔧 FIX: 배치 처리를 위한 상태 추가
      pendingMessages: [],
      renderingScheduled: false,
      batchUpdateTimeout: null,
      
      // 🔧 Enhanced Input Manager
      enhancedInputManager: {
        minHeight: 21,
        maxHeight: 400,           // 200px → 400px 확장
        scrollThreshold: 300,     // 300px에서 스크롤 시작
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
    
    quickQuestions() {
      if (!this.selectedPersona) return [];
      return aiChatOpsService.getQuickQuestions(this.selectedPersona.personaCode, this.currentLanguage);
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
    }
  },
  
  methods: {
    getText(key, params = {}) {
      return getText(this.currentLanguage, key, params);
    },
    
    getPersonaIconName(persona) {
      if (!persona) return 'comment';
      return aiChatOpsService.getPersonaIcon(persona.personaCode, persona.iconPath);
    },
    
    getPersonaDescription(persona) {
      if (!persona) return '';
      if (this.currentLanguage === 'en' && persona.descriptionEn) {
        return persona.descriptionEn;
      }
      return persona.description || this.getText('defaultPersonaDesc');
    },

    generateUniqueId() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    // 🔧 FIX: 메시지 추가 배치 처리 시스템
    addMessageWithLimit(newMessage) {
      // 즉시 DOM 조작 대신 배치로 처리
      this.pendingMessages.push(newMessage);
      this.scheduleBatchUpdate();
    },

    scheduleBatchUpdate() {
      if (this.renderingScheduled) return;
      
      this.renderingScheduled = true;
      
      // 마이크로태스크 큐에 등록하여 다른 동기 작업들과 함께 처리
      this.$nextTick(() => {
        this.processBatchMessages();
        this.renderingScheduled = false;
      });
    },

    processBatchMessages() {
      if (this.pendingMessages.length === 0) return;

      // 모든 대기 중인 메시지를 한 번에 추가
      this.messages.push(...this.pendingMessages);
      
      // 메시지 수 제한 처리
      if (this.messages.length > this.maxSessionMessages) {
        const excessCount = this.messages.length - this.maxSessionMessages;
        const removeCount = Math.ceil(excessCount / 2) * 2;
        this.messages.splice(0, removeCount);
      }
      
      // 배치 정리
      this.pendingMessages = [];
      
      // 스크롤은 DOM 업데이트 후 처리
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
      // 렌더링 중이면 스크롤 지연
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
    
    toggleQuickQuestions() {
      this.showQuickQuestions = !this.showQuickQuestions;
    },
    
    toggleContinuousChat() {
      this.continuousChatEnabled = !this.continuousChatEnabled;
    },
    
    generateQuickQuestions() {
      this.currentMessage = '[Make Quick Questions]';
      this.showQuickQuestions = false;
      this.sendMessage();
    },
    
    handleShiftEnter(event) {
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });
    },
    
    handleInput(event) {
      // 강화된 입력 처리
      this.trackInputChanges();
    },
    
    handleFocus(event) {
      const textarea = this.$refs.messageInput;
      if (textarea && !this.currentMessage.trim()) {
        textarea.style.height = '21px';
      }
    },
    
    loadPersonaHistory() {
      if (!this.selectedPersona) return;
      
      this.loadingHistory = true;
      this.isInitialLoad = true;
      
      this.setInitialScrollPosition();
      
      setTimeout(() => {
        aiChatOpsService.getConversations(this.selectedPersona.personaCode)
          .then(response => {
            if (response.success && response.data) {
              // 🔧 FIX: 히스토리 로딩 시에도 배치 처리 적용
              const convertedMessages = aiChatOpsService.convertConversationsToMessages(response.data);
              this.messages = convertedMessages;
            }
          })
          .catch(error => {
            console.log('Error loading history:', error);
          })
          .finally(() => {
            this.loadingHistory = false;
            
            if (this.isInitialLoad) {
              this.scrollToBottomInstantly();
              setTimeout(() => {
                this.isInitialLoad = false;
              }, 200);
            }
            
            this.$nextTick(() => {
              this.$refs.messageInput?.focus();
              const textarea = this.$refs.messageInput;
              if (textarea) {
                textarea.style.height = `${this.enhancedInputManager.minHeight}px`;
                this.applyInputVisualFeedback();
              }
            });
          });
      }, 100);
    },
    
    resetPersona() {
      this.$emit('go-persona-list');
    },
    
    clearAllMessages() {
      if (!this.selectedPersona) return;
      
      aiChatOpsService.deleteConversations(this.selectedPersona.personaCode)
        .then(response => {
          if (response.success) {
            // 🔧 FIX: 상태 일괄 정리
            Object.assign(this, {
              messages: [],
              currentMessage: '',
              showQuickQuestions: false,
              continuousChatEnabled: false,
              pendingMessages: [],
              renderingScheduled: false
            });
            
            this.stopLoadingMessages();
            this.$nextTick(() => {
              const textarea = this.$refs.messageInput;
              if (textarea) {
                textarea.style.height = `${this.enhancedInputManager.minHeight}px`;
                this.applyInputVisualFeedback();
              }
            });
          }
        })
        .catch(error => {
          console.log('Error clearing messages:', error);
        });
    },
    
    resetToInitialState() {
      // 🔧 FIX: 상태 일괄 초기화
      Object.assign(this, {
        messages: [],
        currentMessage: '',
        showQuickQuestions: false,
        continuousChatEnabled: false,
        pendingMessages: [],
        renderingScheduled: false
      });
      
      this.stopLoadingMessages();
      this.stopMemoryMonitoring();
      
      if (this.batchUpdateTimeout) {
        clearTimeout(this.batchUpdateTimeout);
        this.batchUpdateTimeout = null;
      }
      
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.style.height = `${this.enhancedInputManager.minHeight}px`;
          textarea.style.overflowY = 'hidden';
          this.enhancedInputManager.currentState.isExpanded = false;
          this.enhancedInputManager.currentState.hasScrolled = false;
          this.applyInputVisualFeedback();
          textarea.blur();
        }
      });
    },
    
    // 🔧 FIX: 메시지 전송 최적화
    sendMessage() {
      if (!this.canSendMessage) return;
      
      const messageContent = this.currentMessage.trim();
      const timestamp = Date.now();
      
      // 🔧 FIX: 메시지 객체들을 미리 생성
      const userMessage = {
        id: `user-${this.generateUniqueId()}`,
        type: 'user', 
        content: messageContent,
        timestamp,
        isLoading: false
      };
      
      this.loadingMessageId = `ai-${this.generateUniqueId()}`;
      const loadingMessage = {
        id: this.loadingMessageId,
        type: 'ai',
        content: '',
        timestamp: timestamp + 1,
        isLoading: true
      };
      
      // 🔧 FIX: UI 상태 업데이트를 배치로 처리
      Object.assign(this, {
        currentMessage: '',
        showQuickQuestions: false
      });
      
      // 🔧 FIX: 메시지들을 배치로 추가
      this.pendingMessages.push(userMessage, loadingMessage);
      this.scheduleBatchUpdate();
      
      // 텍스트에어리어 높이 조정
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.style.height = `${this.enhancedInputManager.minHeight}px`;
          textarea.style.overflowY = 'hidden';
          this.enhancedInputManager.currentState.isExpanded = false;
          this.enhancedInputManager.currentState.hasScrolled = false;
          this.applyInputVisualFeedback();
        }
      });
      
      this.startLoadingMessages();
      
      let finalUserQuestion = messageContent;
      
      if (this.continuousChatEnabled && this.recentConversations.length > 0) {
        const contextHistory = this.recentConversations.map(conv => 
          `Q: ${conv.question}\nA: ${conv.answer}`
        ).join('\n\n');
        
        finalUserQuestion = `[이전 대화 내역]\n${contextHistory}\n\n[현재 질문]\n${messageContent}`;
      }
      
      this.$emit('message-sent', {
        personaCode: this.selectedPersona.personaCode,
        userQuestion: finalUserQuestion
      });
    },
    
    sendQuickQuestion(question) {
      this.currentMessage = question;
      this.showQuickQuestions = false;
      this.$nextTick(() => {
        this.trackInputChanges();
      });
      this.sendMessage();
    },
    
    addAiResponse(response) {
      // 🔧 FIX: 로딩 메시지 제거도 배치 처리
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
        responseMessage = {
          id: `ai-${this.generateUniqueId()}`,
          type: 'ai',
          content: response.aiResponse || response.message || '응답을 받았습니다.',
          timestamp: Date.now(),
          isLoading: false,
          conversationId: response.conversationId,
          copyStatus: null
        };
      } else {
        responseMessage = {
          id: `error-${this.generateUniqueId()}`,
          type: 'ai',
          content: response.message || this.getText('aiError'),
          timestamp: Date.now(),
          isLoading: false,
          isError: true,
          copyStatus: null
        };
      }
      
      // 🔧 FIX: 응답 메시지도 배치 처리
      this.addMessageWithLimit(responseMessage);
    },
    
    startLoadingMessages() {
      const messages = getTextArray(this.currentLanguage, 'loadingMessages');
      let index = 0;
      
      this.currentLoadingMessage = messages[index];
      
      this.loadingInterval = setInterval(() => {
        index = (index + 1) % messages.length;
        this.currentLoadingMessage = messages[index];
      }, 2000);
    },
    
    stopLoadingMessages() {
      if (this.loadingInterval) {
        clearInterval(this.loadingInterval);
        this.loadingInterval = null;
      }
      this.currentLoadingMessage = '';
    },
    
    copyMessage(message) {
      if (!message || !message.content) return;

      let textToCopy = '';
      if (message.content.includes('markdown-table')) {
        textToCopy = aiChatOpsService.htmlToMarkdown(message.content);
      } else {
        textToCopy = aiChatOpsService.htmlToPlainText(message.content);
      }
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            this.showCopySuccess(message);
          })
          .catch(err => {
            this.fallbackCopyTextToClipboard(textToCopy, message);
          });
      } else {
        this.fallbackCopyTextToClipboard(textToCopy, message);
      }
    },
    
    fallbackCopyTextToClipboard(text, message) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.showCopySuccess(message);
        }
      } catch (err) {
        console.log('Fallback copy failed:', err);
      }
      
      document.body.removeChild(textArea);
    },
    
    showCopySuccess(message) {
      this.$set(message, 'copyStatus', 'copied');
      
      setTimeout(() => {
        this.$set(message, 'copyStatus', null);
      }, 3000);
    },
    
    // 🔧 Enhanced: 강화된 텍스트에어리어 높이 조절
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      if (!textarea) return;
      
      const manager = this.enhancedInputManager;
      
      if (!textarea.value.trim()) {
        // 빈 내용일 때 최소 높이로 설정
        textarea.style.height = `${manager.minHeight}px`;
        textarea.style.overflowY = 'hidden';
        manager.currentState.isExpanded = false;
        manager.currentState.hasScrolled = false;
        manager.currentState.lineCount = 1;
        return;
      }
      
      // 높이 자동 계산
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineCount = (textarea.value.match(/\n/g) || []).length + 1;
      
      // 상태 업데이트
      manager.currentState.lineCount = lineCount;
      manager.currentState.isExpanded = lineCount > 1;
      
      if (scrollHeight <= manager.scrollThreshold) {
        // 스크롤 임계점 이하: 높이 자동 조절
        const newHeight = Math.max(manager.minHeight, Math.min(scrollHeight, manager.maxHeight));
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = 'hidden';
        manager.currentState.hasScrolled = false;
      } else {
        // 스크롤 임계점 초과: 고정 높이 + 스크롤
        textarea.style.height = `${manager.scrollThreshold}px`;
        textarea.style.overflowY = 'auto';
        manager.currentState.hasScrolled = true;
        
        // 자동으로 맨 아래로 스크롤
        this.$nextTick(() => {
          textarea.scrollTop = textarea.scrollHeight;
        });
      }
      
      // 시각적 피드백 적용
      this.applyInputVisualFeedback();
    },
    
    // 🔧 NEW: 입력창 시각적 피드백
    applyInputVisualFeedback() {
      const textarea = this.$refs.messageInput;
      const container = textarea?.closest('.input-container');
      if (!textarea || !container) return;
      
      const manager = this.enhancedInputManager;
      
      // 확장 상태 클래스 적용
      if (manager.currentState.isExpanded) {
        container.classList.add('enhanced-input--expanded');
      } else {
        container.classList.remove('enhanced-input--expanded');
      }
      
      // 스크롤 상태 클래스 적용
      if (manager.currentState.hasScrolled) {
        container.classList.add('enhanced-input--scrolling');
      } else {
        container.classList.remove('enhanced-input--scrolling');
      }
    },
    
    // 🔧 Enhanced: 입력 상태 추적
    trackInputChanges() {
      this.adjustTextareaHeight();
      
      // 키보드 단축키 처리
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.addEventListener('keydown', this.handleKeyboardShortcuts);
      }
    },
    
    // 🔧 NEW: 키보드 단축키 지원
    handleKeyboardShortcuts(event) {
      // Ctrl + A: 전체 선택 (기본 동작 유지)
      if (event.ctrlKey && event.key === 'a') {
        // 기본 동작 허용
        return;
      }
      
      // Ctrl + Enter: 강제 전송  
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        this.sendMessage();
      }
    },
    
    handleScroll() {
      
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
  },
  
  beforeDestroy() {
    this.stopLoadingMessages();
    this.stopMemoryMonitoring();
    
    // 🔧 FIX: 배치 처리 관련 정리
    if (this.batchUpdateTimeout) {
      clearTimeout(this.batchUpdateTimeout);
      this.batchUpdateTimeout = null;
    }
    
    // 상태 일괄 정리
    Object.assign(this, {
      messages: [],
      currentMessage: '',
      pendingMessages: [],
      renderingScheduled: false,
      loadingMessageId: null,
      loadingInterval: null,
      memoryMonitorInterval: null
    });
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
  }
};
</script>

<style scoped>
/* 🔧 FIX: GPU 가속 및 플리커링 방지 스타일 추가 */
.chat-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--color-surface-light);
  scroll-behavior: smooth;
  padding: 0;
  position: relative;
  z-index: 1;
  min-height: 0;
  
  /* 🔧 FIX: 부드러운 스크롤을 위한 GPU 가속 */
  transform: translateZ(0);
  will-change: scroll-position;
}

.messages.smooth-scroll {
  scroll-behavior: smooth;
}

.messages.initial-loading {
  overflow: hidden;
}

.messages.initial-loading::-webkit-scrollbar {
  display: none;
}

/* 🔧 FIX: 렌더링 최적화를 위한 레이어 분리 */
.input-area {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.quick-dropdown {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 기존 스타일들 유지... */
.chat-header {
  padding: var(--space-md) var(--space-xl);
  background: var(--color-surface-white);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  z-index: 5;
}

.chat-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--space-xl);
  right: var(--space-xl);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%);
  opacity: 0.4;
}

.persona-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  position: relative;
}

.badge {
  background: var(--color-primary);
  color: white;
  padding: 6px var(--space-md);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-soft);
  transition: all var(--motion-normal);
  border: 1px solid var(--color-accent);
  line-height: 1;
  position: relative;
  cursor: pointer;
}

.badge:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-gentle);
  border-radius: 24px;
}

.dev-info-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 12px;
  background: var(--dev-tooltip-bg);
  color: white;
  padding: 0;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  z-index: 1000;
  box-shadow: var(--shadow-floating);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  min-width: 160px;
  backdrop-filter: blur(var(--blur-strong));
  border: 1px solid var(--dev-tooltip-border);
  overflow: hidden;
}

.dev-info-tooltip::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 16px;
  width: 12px;
  height: 12px;
  background: var(--dev-tooltip-bg);
  border: 1px solid var(--dev-tooltip-border);
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
}

.dev-info-header {
  background: var(--dev-header-bg);
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--dev-border);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dev-info-content {
  padding: var(--space-sm) var(--space-md);
}

.dev-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: 4px;
}

.dev-info-item:last-child {
  margin-bottom: 0;
}

.dev-label {
  color: var(--dev-text-muted);
  font-size: 10px;
}

.dev-value {
  color: var(--dev-text-success);
  font-weight: 600;
  font-size: 10px;
}

.dev-value--active {
  color: var(--dev-text-active);
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
  background: var(--dev-text-active);
  border-radius: var(--radius-full);
  box-shadow: 0 0 4px var(--dev-text-active);
  animation: pulse-dot var(--duration-pulse) infinite;
}

.controls {
  display: flex;
  gap: 6px;
}

.clear-btn {
  background: var(--color-error) !important;
  border-color: var(--color-error) !important;
  color: white !important;
}

.clear-btn:hover:not(:disabled) {
  background: #B91C1C !important;
  border-color: #B91C1C !important;
}

.messages-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.loading-history {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.welcome {
  text-align: center;
  padding: 48px var(--space-xl);
}

.welcome h4 {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: var(--space-lg) 0 var(--space-sm) 0;
  line-height: 1.5;
}

.welcome-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-md) 0;
  line-height: 1.4;
}

.welcome-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-accent-subtle);
  border: 1px solid var(--color-accent-medium);
  border-radius: 20px;
  display: inline-flex;
}

.no-persona {
  text-align: center;
  padding: 48px var(--space-xl);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-persona h4 {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: var(--space-lg) 0 var(--space-sm) 0;
  line-height: 1.5;
}

.no-persona p {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-xl) 0;
  line-height: 1.4;
}

.go-home-btn {
  padding: var(--space-md) var(--space-xl) !important;
}

.input-area {
  padding: var(--space-md) var(--space-lg) var(--space-md);
  background: var(--color-surface-white);
  border-top: 1px solid var(--color-border-light);
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.quick-dropdown {
  position: absolute;
  bottom: 100%;
  left: var(--space-lg);
  right: var(--space-lg);
  margin-bottom: var(--space-sm);
  background: var(--color-surface-white);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-sm);
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick-item {
  width: 100% !important;
  text-align: left !important;
  padding: var(--space-sm) var(--space-md) !important;
  justify-content: flex-start !important;
  line-height: 1.4;
  font-size: var(--font-size-sm) !important;
}

.quick-item:hover {
  background: var(--color-surface-light) !important;
  transform: translateX(2px);
}

.input-container {
  transition: all var(--motion-normal);
  padding: var(--space-sm);
  background: var(--color-surface-white);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
}

.input-container:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.input-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* === ENHANCED INPUT SYSTEM === */
.enhanced-input {
  resize: none;
  overflow-y: auto;
  scroll-behavior: smooth;
  transition: all var(--motion-normal);
  
  /* 사용자 정의 스크롤바 */
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent) var(--color-surface-light);
}

.enhanced-input::-webkit-scrollbar {
  width: 8px;
}

.enhanced-input::-webkit-scrollbar-track {
  background: var(--color-surface-light);
  border-radius: 4px;
}

.enhanced-input::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 4px;
  opacity: 0.6;
  transition: opacity var(--motion-fast);
}

.enhanced-input::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}

/* 확장 상태 표시 */
.input-container.enhanced-input--expanded {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
  background: var(--color-surface-white);
}

/* 스크롤 활성 상태 */
.input-container.enhanced-input--scrolling {
  position: relative;
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

.message-textarea {
  width: 100%;
  height: 21px;
  min-height: 21px;
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

/* btn-system 재정의 - 채팅 액션 버튼 전용 */
.chat-input-controls .btn-system--sm.btn-system--icon-only {
  width: 28px !important;
  height: 28px !important;
  min-height: 28px !important;
}

.continuous-chat-btn.btn-system--success {
  background: var(--color-success-subtle) !important;
  border-color: var(--color-success) !important;
  color: var(--color-success) !important;
}

/* btn-system 재정의 - 전송 버튼 전용 */
.send-button.btn-system--sm.btn-system--icon-only {
  width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
}

.send-button.loading {
  animation: pulse-send 1.8s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-50%) scale(var(--transform-subtle));
  }
}

@keyframes pulse-send {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--color-primary-subtle);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(37, 99, 235, 0);
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
  
  .chat-input-controls .btn-system--sm.btn-system--icon-only {
    width: 24px !important;
    height: 24px !important;
    min-height: 24px !important;
  }
  
  .send-button.btn-system--sm.btn-system--icon-only {
    width: 28px !important;
    height: 28px !important;
    min-height: 28px !important;
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