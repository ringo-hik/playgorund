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
      <div class="chat-header">
        <div class="persona-info">
          <div class="persona-badge" @mouseenter="showDevInfo = true" @mouseleave="showDevInfo = false">
            <LucideIcon :name="getPersonaIconName(selectedPersona)" fill="white" :width="16" :height="16" />
            <span>{{ getPersonaDisplayName(selectedPersona) }}</span>
          </div>

          <div v-if="showDevInfo" class="dev-info-tooltip-avatar" @mouseenter="showDevInfo = true"
            @mouseleave="showDevInfo = false">
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
                <span class="dev-value" :class="{ 'dev-value--active': pendingMessages.length > 0 }">{{
                  pendingMessages.length }}</span>
              </div>
              <div class="dev-info-item">
                <span class="dev-label">Rendering:</span>
                <span class="dev-value" :class="{ 'dev-value--active': renderingScheduled }">{{ renderingScheduled ?
                  'Yes'
                  : 'No' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <button @click="$emit('go-persona-list')"
            class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only" title="Change persona">
            <LucideIcon name="refresh-cw" :width="14" :height="14" :interactive="true" />
          </button>

          <button @click="$emit('go-home')" class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="Go home">
            <LucideIcon name="home" :width="14" :height="14" :interactive="true" />
          </button>

          <button @click="clearChatHistory" class="btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
            title="Delete messages">
            <LucideIcon name="trash" :width="14" :height="14" :interactive="true" />
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
              <h2 class="welcome-title">
                {{ selectedPersona ? getPersonaDisplayName(selectedPersona) : '' }}
              </h2>
            </div>
            <div class="welcome-message" v-if="formattedWelcomeMessage" v-html="formattedWelcomeMessage"></div>
            <p class="welcome-description" v-else>{{ getText('welcomeTip') || '' }}</p>
          </div>
        </div>

        <div class="messages-list">
          <Elements v-for="message in messages" :key="message.id" component-type="message" :message="message"
            :title="'복사'" :persona="selectedPersona" :current-language="currentLanguage" :timestamp="message.timestamp"
            @copy-message="handleCopyMessage" @regenerate-message="handleRegenerateMessage"
            @feedback-message="handleFeedbackMessage" />
        </div>
      </div>

      <div class="input-area" ref="inputArea">
        <div v-if="showQuickQuestions && quickQuestions.length > 0" class="quick-questions-dropdown"
          ref="quickQuestionsDropdown">
          <div class="quick-questions-list">
            <div v-for="(question, index) in quickQuestions" :key="index" @click="sendQuickQuestion(question)"
              class="quick-question-item">
              {{ question }}
            </div>
          </div>
        </div>

        <div class="input-container card-system">
          <div class="input-box">
            <textarea v-model="currentMessage" ref="messageInput" :placeholder="getText('inputPlaceholder')"
              @keydown="handleKeyDown" @input="handleInput" @focus="handleFocus" :disabled="isProcessing"
              class="message-textarea input-system input-system--textarea" />

            <div class="input-bottom-row">
              <div class="left-actions">
                <button @click="generateQuickQuestions" :disabled="isProcessing || isQuickQuestionsLoading"
                  class="btn-system btn-system--ghost btn-system--sm quick-questions-generate-btn"
                  :title="getText('generateQuestions') || 'Generate questions'">
                  <Elements v-if="isQuickQuestionsLoading" component-type="spinner" size="sm" />
                  <LucideIcon v-else name="lightbulb" :width="12" :height="12" :interactive="true" />
                </button>

                <button @click="toggleContinuousChat" :disabled="isProcessing" :class="[
                  'btn-system',
                  'btn-system--sm',
                  'continuous-chat-btn',
                  continuousChatEnabled ? 'btn-system--success' : 'btn-system--ghost'
                ]" :title="continuousChatEnabled ? 'Switch to single chat' : 'Switch to continuous chat'">
                  <LucideIcon :name="continuousChatEnabled ? 'layers' : 'message-square'" :width="12" :height="12"
                    :interactive="true" />
                </button>
              </div>

              <button @click="sendMessage" :disabled="!canSendMessage" :class="[
                'btn-system',
                'btn-system--send',
                'btn-system--sm',
                'btn-system--icon-only',
                'send-button-enhanced',
                { 'loading': isProcessing }
              ]" title="Send message">
                <Elements v-if="isProcessing" component-type="spinner" size="sm" color="accent" />
                <LucideIcon v-else name="send-horizontal" fill="currentColor" :width="14" :height="14"
                  :interactive="true" />
              </button>
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
import aiChatOpsService from '../service/aiChatOpsService.js';

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
      loadingMessageId: null,
      showQuickQuestions: false,
      quickQuestions: [],
      continuousChatEnabled: true,
      isQuickQuestionsLoading: false,
      isInitialLoad: false,
      maxSessionMessages: 30,
      memoryUsage: { used: 0, total: 0 },
      memoryMonitorInterval: null,
      isDevelopment: true,
      showDevInfo: false,
      debugMode: true,
      renderingStates: [],
      lastApiCall: null,

      pendingMessages: [],
      renderingScheduled: false,
      batchUpdateTimeout: null,

      activeTimers: new Set(),
      activeIntervals: new Set(),

      formattedWelcomeMessage: '',

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
      return this.currentMessage.length > 0 && !this.isProcessing && this.selectedPersona;
    },

    recentConversations() {
      if (!this.continuousChatEnabled || !this.messages?.length) return [];

      const cacheKey = `${this.messages.length}-${this.continuousChatEnabled}`;
      if (this._conversationCache?.key === cacheKey) {
        return this._conversationCache.data;
      }

      const conversationPairs = [];
      for (let i = this.messages.length - 2; i >= 0 && conversationPairs.length < 5; i -= 2) {
        if (this.messages[i]?.type === 'user' && this.messages[i + 1]?.type === 'ai') {
          conversationPairs.unshift({
            question: this.messages[i].content,
            answer: this.messages[i + 1].content
          });
        }
      }

      this._conversationCache = { key: cacheKey, data: conversationPairs };
      return conversationPairs;
    },

    messagesClasses() {
      const isLoading = this.loadingHistory;
      const canScroll = !isLoading && !this.isInitialLoad && !this.renderingScheduled;

      return {
        'smooth-scroll': canScroll,
        'initial-loading': isLoading
      };
    },

    isExpanded() {
      return this.windowSize?.width > 600 || this.windowSize?.height > 800;
    }
  },

  watch: {
    currentLanguage() {
      this.$nextTick(() => {
        this.trackInputChanges();
      });
    },

    isProcessing(newVal, oldVal) {
      if (!newVal) {
        this.stopLoadingMessages();
      }
      if (newVal) {
        this.showQuickQuestions = false;
      }
    },

    selectedPersona: {
      handler(newPersona, oldPersona) {

        if (newPersona) {
          this.loadPersonaHistory();
          this.formatWelcomeMessage();
        } else {
          this.messages = [];
          this.formattedWelcomeMessage = '';
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

    getPersonaWelcomeMessage(persona) {
      if (!persona || !persona.welcomeMsg) return null;
      return persona.welcomeMsg;
    },

    // Format welcome message for display
    async formatWelcomeMessage() {
      const message = this.getPersonaWelcomeMessage(this.selectedPersona);
      if (!message) {
        this.formattedWelcomeMessage = '';
        return;
      }

      try {
        this.formattedWelcomeMessage = await aiChatOpsService.formatContentMarkdown(message);
      } catch (error) {
        this.formattedWelcomeMessage = message;
      }
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
        return;
      }

      this.loadingHistory = true;
      this.isInitialLoad = true;

      try {
        const response = await aiChatOpsService.getConversations(this.selectedPersona.personaCode);

        if (response.success && response.conversations && Array.isArray(response.conversations)) {
          this.messages = [];
          this.pendingMessages = [];

          const normalizedConversations = response.conversations.map(conv => ({
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
          } else {
            this.checkPersonaAutoQuery();
          }
        } else {
          this.checkPersonaAutoQuery();
        }
      } catch (error) {
        this.addErrorMessage('Failed to load conversation history.');
        this.checkPersonaAutoQuery();
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

    // Start memory monitoring at 60-second intervals
    startMemoryMonitoring() {
      if (performance.memory) {
        this.stopMemoryMonitoring();
        this.memoryMonitorInterval = this.safeSetInterval(() => {
          this.measureMemoryUsage();
        }, 60000);
        this.measureMemoryUsage();
      }
    },

    stopMemoryMonitoring() {
      if (this.memoryMonitorInterval) {
        this.safeClearInterval(this.memoryMonitorInterval);
        this.memoryMonitorInterval = null;
      }
    },

    safeSetTimeout(callback, delay) {
      const timerId = setTimeout(() => {
        this.activeTimers.delete(timerId);
        if (typeof callback === 'function') {
          callback();
        }
      }, delay);
      this.activeTimers.add(timerId);
      return timerId;
    },

    safeSetInterval(callback, interval) {
      const intervalId = setInterval(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, interval);
      this.activeIntervals.add(intervalId);
      return intervalId;
    },

    safeClearTimeout(timerId) {
      if (timerId && this.activeTimers.has(timerId)) {
        clearTimeout(timerId);
        this.activeTimers.delete(timerId);
      }
    },

    safeClearInterval(intervalId) {
      if (intervalId && this.activeIntervals.has(intervalId)) {
        clearInterval(intervalId);
        this.activeIntervals.delete(intervalId);
      }
    },

    clearAllTimers() {
      this.activeTimers.forEach(timerId => {
        clearTimeout(timerId);
      });
      this.activeTimers.clear();

      this.activeIntervals.forEach(intervalId => {
        clearInterval(intervalId);
      });
      this.activeIntervals.clear();

      if (this.memoryMonitorInterval) {
        clearInterval(this.memoryMonitorInterval);
        this.memoryMonitorInterval = null;
      }
      if (this.batchUpdateTimeout) {
        clearTimeout(this.batchUpdateTimeout);
        this.batchUpdateTimeout = null;
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
        this.safeSetTimeout(() => {
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

      if (!this.canSendMessage || !this.selectedPersona) {
        return;
      }

      const messageContent = this.currentMessage;
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

        this.lastApiCall = {
          timestamp: new Date(),
          data: messageData,
          status: 'sent'
        };

        this.$emit('message-sent', messageData);

      } catch (error) {
        this.lastApiCall = {
          timestamp: new Date(),
          error: error,
          status: 'failed'
        };

        this.addAiResponse({
          success: false,
          message: 'Failed to send message.'
        });
      }
    },

    sendQuickQuestion(question) {
      this.currentMessage = question;
      this.showQuickQuestions = false;
      this.quickQuestions = [];

      this.$nextTick(() => {
        this.sendMessage();
      });
    },

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
        const aiResponseContent = response.data.aiResponse || response.data.data;

        responseMessage = {
          id: `ai-${this.generateUniqueId()}`,
          type: 'ai',
          content: aiResponseContent,
          timestamp: new Date(),
          isLoading: false,
          conversationId: response.data.conversationId
        };
      } else {
        const errorContent = response.message || response.errorMessage || this.getText('aiError');

        responseMessage = {
          id: `error-${this.generateUniqueId()}`,
          type: 'ai',
          content: errorContent,
          timestamp: new Date(),
          isError: true,
          isLoading: false
        };
      }


      this.addMessageWithLimit(responseMessage);

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
          this.displayQuickQuestionsResponse(response.data);
        } else {
          throw new Error(response.message || response.errorMessage);
        }

      } catch (error) {
        this.quickQuestions = this.getDefaultQuickQuestions();
        this.showQuickQuestions = true;
      } finally {
        this.isQuickQuestionsLoading = false;
      }
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
              .map(q => q.replace(/^[-\*\xE2\x80\xA2]\s*/, '').trim())
              .slice(0, 5);
          }
        } else if (Array.isArray(responseData)) {
          questionsList = responseData.slice(0, 5);
        } else if (responseData && typeof responseData === 'object') {
          questionsList = responseData.questions || responseData.data || [];
          if (typeof questionsList === 'string') {
            questionsList = [questionsList];
          }
        }

        questionsList = questionsList.filter(q => q && q.trim()).slice(0, 5);

        if (questionsList.length > 0) {
          this.quickQuestions = questionsList;
          this.showQuickQuestions = true;
        } else {
          throw new Error('Quick questions list is empty.');
        }

      } catch (error) {
        this.quickQuestions = this.getDefaultQuickQuestions();
        this.showQuickQuestions = true;
      }
    },

    getDefaultQuickQuestions() {
      return [
        '당신은 무엇을 잘 합니까?',
      ];
    },

    startLoadingMessages() {
      if (this.loadingMessageId) return;

      const loadingMessage = {
        id: `loading-${this.generateUniqueId()}`,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };

      this.addMessageWithLimit(loadingMessage);
      this.loadingMessageId = loadingMessage.id;
    },

    stopLoadingMessages() {
      this.loadingMessageId = null;
    },

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

          this.safeSetTimeout(() => {
            container.style.scrollBehavior = 'smooth';
          }, 100);
        }
      });
    },

    async handleCopyMessage(message) {
      try {
        const textToCopy = aiChatOpsService.convertHtmlToMarkdown(message.content);
        await navigator.clipboard.writeText(textToCopy);
      } catch (error) {
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

    handleClickOutside(event) {
      if (this.showQuickQuestions) {
        const dropdown = this.$refs.quickQuestionsDropdown;
        const inputArea = this.$refs.inputArea;
        const generateBtn = event.target.closest('.quick-questions-generate-btn');

        if (generateBtn) {
          return;
        }

        if (dropdown && !dropdown.contains(event.target) &&
          inputArea && !inputArea.contains(event.target)) {
          this.showQuickQuestions = false;
        }
      }
    },

    clearChatHistory() {
      if (!this.selectedPersona) return;

      const confirmed = confirm(`Delete all conversation history for ${this.selectedPersona.title}?\n\nDeleted conversations cannot be recovered.`);

      if (!confirmed) return;

      aiChatOpsService.deleteConversations(this.selectedPersona.personaCode)
        .then(response => {
          if (response.success) {
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
        });
    },

    resetToInitialState() {
      this.stopLoadingMessages();
      this.stopMemoryMonitoring();

      Object.assign(this, {
        currentMessage: '',
        messages: [],
        loadingHistory: false,
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
    },

    // Universal auto-query system for personas
    checkPersonaAutoQuery() {
      if (!this.selectedPersona?.personaCode || this.messages.length > 0) {
        return;
      }

      const autoQueryConfig = this.getPersonaAutoQueryConfig(this.selectedPersona.personaCode);

      if (autoQueryConfig) {
        this.$nextTick(() => {
          this.currentMessage = autoQueryConfig.query;
          this.sendMessage();
        });
      }
    },

    // Get auto query configuration for specific persona
    getPersonaAutoQueryConfig(personaCode) {
      const autoQueryMap = {
        'jql_reporter': {
          query: 'Generate weekly JQL report for development team',
          description: 'Automatically generates weekly development metrics',
          enabled: true
        },
        'project_manager': {
          query: 'Show me current project status and sprint progress',
          description: 'Displays current project overview and team metrics',
          enabled: true
        },
        'system_admin': {
          query: 'Check system performance and infrastructure health',
          description: 'Provides system monitoring and performance metrics',
          enabled: true
        },
        'data_analyst': {
          query: 'Generate weekly data analytics and business insights',
          description: 'Shows KPIs, user behavior, and predictive analytics',
          enabled: true
        },
        'personal_assistant': {
          query: 'Show me weekly task progress and upcoming priorities',
          description: 'Displays personal productivity metrics and schedule',
          enabled: false // Disabled for personal assistant to allow manual interaction
        },
        'business_analyst': {
          query: 'Analyze current business requirements and processes',
          description: 'Provides business analysis and improvement recommendations',
          enabled: false // Disabled for business analyst to allow requirement gathering
        }
      };

      const config = autoQueryMap[personaCode];
      return (config && config.enabled) ? config : null;
    },

    handleMessageContainerClick(event) {
      const button = event.target.closest('.copy-code-btn');
      if (button) {
        const pre = button.closest('.markdown-code-block').querySelector('pre');
        if (pre) {
          navigator.clipboard.writeText(pre.innerText).then(() => {
            button.textContent = 'Copied!';
            button.classList.add('copied');
            this.safeSetTimeout(() => {
              button.textContent = 'Copy';
              button.classList.remove('copied');
            }, 2000);
          });
        }
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.style.height = `${this.enhancedInputManager.minHeight}px`;
        this.applyInputVisualFeedback();
      }
      const messagesContainer = this.$refs.messagesContainer;
      if (messagesContainer) {
        messagesContainer.addEventListener('click', this.handleMessageContainerClick);
      }
    });

    this.startMemoryMonitoring();

    document.addEventListener('click', this.handleClickOutside);
  },

  beforeDestroy() {
    const messagesContainer = this.$refs.messagesContainer;
    if (messagesContainer) {
      messagesContainer.removeEventListener('click', this.handleMessageContainerClick);
    }

    this.clearAllTimers();
    this.stopLoadingMessages();

    document.removeEventListener('click', this.handleClickOutside);

    Object.assign(this, {
      messages: [],
      currentMessage: '',
      pendingMessages: [],
      renderingScheduled: false,
      loadingMessageId: null,
      memoryMonitorInterval: null
    });
  }
};
</script>

<style scoped>
/* Component-specific layout only - all styling moved to centralized system */

/* Quick Questions position override */
.quick-questions-dropdown {
  position: absolute;
  top: -8px;
  left: var(--space-xl);
  right: var(--space-xl);
  z-index: 10;
  transform: translateY(-100%);
}

/* Enhanced input focus states - component-specific behavior */
.input-container.enhanced-input--focused {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
  transform: translateY(-1px);
}

.input-container.enhanced-input--expanded {
  border-color: var(--color-accent-secondary);
}

/* Developer tooltip positioning - unique to ChatTab */
.dev-info-tooltip-avatar {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--dev-tooltip-bg);
  color: var(--color-text-light);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  z-index: 1000;
  margin-top: var(--space-sm);
  border: 1px solid var(--dev-tooltip-border);
  box-shadow: var(--shadow-moderate);
  font-family: 'Monaco', 'Menlo', 'SF Mono', 'Consolas', 'Courier New', monospace;
  backdrop-filter: blur(var(--blur-strong));
  animation: fadeInUp 0.2s ease-out;
}

/* Scroll indicator - specific to textarea */
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

/* Send button loading animation - component-specific */
@keyframes pulse-send-enhanced {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}

.send-button-enhanced.loading {
  animation: pulse-send-enhanced 1.8s ease-in-out infinite;
}
</style>