<template>
  <div class="ai-chatops-chat">
    <button :class="['ai-chatops-chat-button', { 'is-active': isOpen }]" @click="toggleChat">
      <Elements v-if="isLoading" component-type="spinner" size="md" />
      <LucideIcon v-if="!isLoading && isOpen" name="x" fill="currentColor" :width="28" :height="28" :interactive="true"
        key="close-icon" />
      <LucideIcon v-if="!isLoading && !isOpen" name="robot" fill="currentColor" :width="28" :height="28"
        :interactive="true" key="chat-icon" />
    </button>

    <div v-show="isOpen && isInitialized" class="ai-chatops-chat-window" :class="[windowClasses, currentTheme]"
      ref="chatWindow">
      <div class="chat-header">
        <div class="bot-info">
          <div class="avatar">
            <LucideIcon name="robot" fill="white" :width="26" :height="26" />
          </div>
          <div class="details">
            <span class="name">{{ getText('aiChatOpsTitle') }}</span>
            <div class="status" :class="{ offline: !isConnected }">
              <span class="status-dot"></span>
              <span>{{ isConnected ? getText('online') : getText('offline') }}</span>
            </div>
          </div>
          <button class="conversation-history-btn header-btn header-btn--md" @click="openConversationAnalytics"
            title="대화분석">
            <LucideIcon name="bar-chart-3" fill="currentColor" :width="16" :height="16" />
          </button>
        </div>

        <div class="actions">
          <div class="easter-egg-trigger" @click="openRandomEasterEgg">
            <LucideIcon name="sparkles" fill="currentColor" :width="4" :height="4" />
          </div>

          <button class="system-admin-btn header-btn header-btn--md" @click="openSystemAdmin" title="시스템 관리">
            <LucideIcon name="shield" fill="currentColor" :width="16" :height="16" />
          </button>

          <button class="theme-selector header-btn header-btn--md" @click="cycleTheme" :title="getCurrentThemeName()">
            <span class="theme-indicator">{{ getThemeDisplayName() }}</span>
          </button>

          <button class="language-btn header-btn header-btn--md" @click="toggleLanguage">
            <span>{{ currentLanguage === 'ko' ? 'KO' : 'EN' }}</span>
          </button>

          <div class="window-controls">
            <button class="window-control-btn header-btn" @click="minimizeWindow">
              <LucideIcon name="minus" fill="currentColor" :width="12" :height="12" :interactive="true" />
            </button>
            <button class="window-control-btn header-btn" @click="toggleMaximizeWindow">
              <LucideIcon :name="windowState === 'maximized' ? 'minimize-2' : 'maximize-2'" fill="currentColor"
                :width="12" :height="12" :interactive="true" />
            </button>
            <button class="window-control-btn header-btn" @click="closeChat">
              <LucideIcon name="x" fill="currentColor" :width="12" :height="12" :interactive="true" />
            </button>
          </div>
        </div>
      </div>

      <div class="content">
        <div v-show="currentView === 'categorySelect'" class="category-select">
          <div class="welcome-section">
            <div class="welcome-icon">
              <LucideIcon name="heart" fill="var(--color-primary)" :width="28" :height="28" />
            </div>
            <div class="welcome-content">
              <h3>{{ getText('welcomeTitle') }}</h3>
              <p>{{ getText('welcomeMessage') }}</p>
            </div>
          </div>

          <div class="category-container">
            <div class="category-grid">
              <div v-for="category in categories" :key="category.key" @click="selectCategory(category.key)"
                class="category-card card-system card-system--interactive"
                :class="{ disabled: chatProcessingCount > 0 }">
                <div class="category-icon" :class="`category-icon--${category.key}`">
                  <LucideIcon :name="category.icon" fill="white" :width="20" :height="20" />
                </div>
                <div class="category-content">
                  <h4>{{ getText(category.titleKey) }}</h4>
                  <p>{{ getText(category.descKey) }}</p>
                </div>
                <div class="category-arrow">
                  <LucideIcon name="chevron-right" fill="currentColor" :width="14" :height="14" />
                </div>
              </div>
            </div>

            <div class="feedback-section">
              <button @click="goToFeedback" :disabled="chatProcessingCount > 0"
                class="feedback-btn btn-system btn-system--accent btn-system--md">
                <LucideIcon name="heart" fill="currentColor" :width="16" :height="16" />
                {{ getText('sendFeedback') }}
              </button>
            </div>
          </div>
        </div>

        <div v-show="currentView === 'personaList'" class="persona-list-tab">
          <div class="persona-header">
            <button @click="goToCategorySelect" class="back-btn btn-system btn-system--ghost btn-system--sm">
              <LucideIcon name="arrow-left" fill="currentColor" :width="14" :height="14" />
              {{ getText('back') }}
            </button>

            <div class="header-content">
              <div class="category-badge">
                <LucideIcon :name="getCategoryIcon(selectedCategory)" fill="white" :width="16" :height="16" />
                <span>{{ getCategoryDisplayName(selectedCategory) }}</span>
              </div>
              <h3>{{ getText('selectPersonaDesc') }}</h3>
            </div>
          </div>

          <div class="persona-content">
            <div v-show="loadingPersonas" class="loading-container">
              <Elements component-type="spinner" size="lg" centered />
              <span>{{ getText('loadingPersonas') }}</span>
            </div>

            <div v-show="!loadingPersonas && filteredPersonas.length === 0" class="no-personas">
              <LucideIcon name="info" fill="var(--text-muted)" :width="40" :height="40" />
              <h4>{{ getText('noPersonas') }}</h4>
              <p>{{ getText('noPersonasDesc') }}</p>
              <button @click="goToCategorySelect" class="btn-system btn-system--primary btn-system--md">
                <LucideIcon name="home-heart" fill="currentColor" :width="16" :height="16" />
                {{ getText('goHome') }}
              </button>
            </div>

            <div v-show="!loadingPersonas && filteredPersonas.length > 0" class="persona-grid">
              <div v-for="(persona, index) in filteredPersonas" :key="persona.personaCode"
                @click="selectPersona(persona)" class="persona-card card-system card-system--interactive"
                :class="{ disabled: loadingPersonas }" data-testid="persona-card">
                <div class="persona-card-content">
                  <div class="persona-icon"
                    :style="{ backgroundColor: getPersonaColor(index, getPersonaDescription(persona)) }">
                    <LucideIcon :name="getPersonaIconName(persona)" fill="white" :width="20" :height="20" />
                  </div>

                  <div class="persona-info">
                    <h4 class="persona-title">{{ persona.title || persona.personaCode }}</h4>
                    <p class="persona-description">{{ getPersonaDescription(persona) }}</p>
                  </div>

                  <div class="persona-arrow">
                    <LucideIcon name="chevron-right" fill="currentColor" :width="14" :height="14" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChatTab v-if="currentView === 'chat' && isInitialized" ref="chatTab" :selected-persona="selectedPersona"
          :is-processing="chatProcessingCount > 0" :current-language="currentLanguage" :window-size="windowSize"
          :selected-category="selectedCategory" @message-sent="handleMessageSent"
          @processing-state-changed="handleProcessingStateChanged" @go-persona-list="goToPersonaList"
          @go-home="goToCategorySelect" />

        <FeedbackTab v-if="currentView === 'feedback' && isInitialized" ref="feedbackTab"
          :current-language="currentLanguage" @feedback-sent="handleFeedbackSent" @go-home="goToCategorySelect" />

      </div>
    </div>
  </div>
</template>

<script>
import aiChatOpsService from './service/aiChatOpsService.js';
import { getText } from './utils/i18n.js';
import ChatTab from './components/ChatTab.vue';
import FeedbackTab from './components/FeedbackTab.vue';
import Elements from './components/Elements.vue';
import LucideIcon from './components/LucideIcon.vue';

export default {
  name: 'AIChatOpsLayout',
  components: {
    ChatTab,
    FeedbackTab,
    Elements,
    LucideIcon
  },

  data() {
    return {
      isOpen: false,
      isInitialized: false,
      isLoading: false,
      isInitializing: false,
      isClosing: false,
      currentView: 'categorySelect',
      selectedCategory: null,
      selectedPersona: null,
      personas: [],
      loadingPersonas: false,
      isConnected: true,
      currentLanguage: this.getInitialLanguage(),
      currentTheme: this.getInitialTheme(),
      personaSessionMap: {},
      personaMessageCache: new Map(),
      cacheAccessOrder: [],
      maxMessagesPerPersona: 10,
      windowState: 'normal',
      windowSize: {
        width: 455,
        height: 676
      },
      chatProcessingCount: 0,
      pendingRequests: new Map(),
      healthCheckInterval: null,
      cacheCleanupInterval: null,

      activeTimers: new Set(),
      activeIntervals: new Set(),
      availableThemes: [
        { key: 'theme-ai-chatops', name: 'AI-ChatOps', displayName: 'AI' },
        { key: 'theme-heritage', name: 'Heritage', displayName: 'HT' },
        { key: 'theme-classic', name: 'classic', displayName: 'NY' },
        { key: 'theme-retro', name: 'retro', displayName: 'RT' }
      ],
      personaColors: [
        '#8B7FD6', '#7FB069', '#D4A574', '#9B8AA0', '#6B9BD2',
        '#C49A9A', '#85A392', '#D6B85A', '#A084C2', '#6FAADB',
        '#C5906D', '#9A9FD4', '#7DC4A8', '#E0A458', '#B39BC7',
        '#6DB4D6', '#D9976B', '#8FA8D3', '#A8D4A8', '#E8B86D',
        '#C2A2D6', '#7ACFD6', '#D4A285', '#98B6E8', '#B8D4B8',
        '#F0C570', '#D0A8E8', '#85D4D4', '#E8C085', '#A8C0F0'
      ],
      categories: [
        {
          key: 'personal',
          icon: 'user',
          titleKey: 'personalCategory',
          descKey: 'personalCategoryDesc'
        },
        {
          key: 'general',
          icon: 'users',
          titleKey: 'generalCategory',
          descKey: 'generalCategoryDesc'
        },
        {
          key: 'operation',
          icon: 'settings',
          titleKey: 'operationCategory',
          descKey: 'operationCategoryDesc'
        }
      ]
    };
  },

  computed: {
    windowClasses() {
      return {
        'minimized': this.windowState === 'minimized',
        'maximized': this.windowState === 'maximized'
      };
    },

    filteredPersonas() {
      if (!this.selectedCategory || !Array.isArray(this.personas)) {
        return [];
      }

      const cacheKey = `${this.selectedCategory}-${this.personas.length}`;
      if (this._personaFilterCache?.key === cacheKey) {
        return this._personaFilterCache.data;
      }

      const filtered = this.personas.filter(persona =>
        persona?.category === this.selectedCategory
      );

      this._personaFilterCache = { key: cacheKey, data: filtered };
      return filtered;
    }
  },

  methods: {
    getText(key, params = {}) {
      return getText(this.currentLanguage, key, params);
    },

    getInitialLanguage() {
      try {
        return localStorage.getItem('ai-chatops-chat-lang') || 'ko';
      } catch (error) {
        return 'ko';
      }
    },

    getInitialTheme() {
      try {
        return localStorage.getItem('ai-chatops-chat-theme') || 'theme-ai-chatops';
      } catch (error) {
        return 'theme-ai-chatops';
      }
    },

    cycleTheme() {
      const currentIndex = this.availableThemes.findIndex(theme => theme.key === this.currentTheme);
      const nextIndex = (currentIndex + 1) % this.availableThemes.length;
      const nextTheme = this.availableThemes[nextIndex];

      this.currentTheme = nextTheme.key;
      this.applyTheme(nextTheme.key);
      this.saveThemePreference(nextTheme.key);
    },

    // Apply theme classes to body and chat window
    applyTheme(themeKey) {
      const body = document.body;
      const chatWindow = this.$refs.chatWindow;

      this.availableThemes.forEach(theme => {
        body.classList.remove(theme.key);
        if (chatWindow) {
          chatWindow.classList.remove(theme.key);
        }
      });

      body.classList.add(themeKey);
      if (chatWindow) {
        chatWindow.classList.add(themeKey);
      }
    },

    getCurrentThemeName() {
      const theme = this.availableThemes.find(t => t.key === this.currentTheme);
      return theme ? theme.name : 'Default';
    },

    getThemeDisplayName() {
      const theme = this.availableThemes.find(t => t.key === this.currentTheme);
      return theme ? theme.displayName : 'D';
    },

    saveThemePreference(themeKey) {
      try {
        localStorage.setItem('ai-chatops-chat-theme', themeKey);
      } catch (error) {
      }
    },

    getCategoryIcon(category) {
      const iconMap = {
        'operation': 'settings',
        'general': 'users',
        'personal': 'user',
        'systemAdmin': 'shield'
      };
      return iconMap[category] || 'grid';
    },

    getCategoryDisplayName(category) {
      const displayNames = {
        'personal': 'personalCategory',
        'general': 'generalCategory',
        'operation': 'operationCategory',
        'systemAdmin': 'systemAdminCategory'
      };

      return this.getText(displayNames[category] || category);
    },

    getPersonaIconName(persona) {
      if (!persona) return 'message-square-heart';
      return aiChatOpsService.getPersonaIcon(persona.personaCode);
    },

    getPersonaDescription(persona) {
      if (!persona) return '';
      if (this.currentLanguage === 'en' && persona.descriptionEn) {
        return persona.descriptionEn;
      }
      return persona.description || this.getText('defaultPersonaDesc');
    },

    getPersonaColor(index, description = '') {
      const descLength = description.length || 1;
      const colorIndex = (index + descLength) % this.personaColors.length;
      return this.personaColors[colorIndex];
    },

    async toggleChat() {
      if (!this.isOpen) {
        if (this.isInitializing || this.isClosing) {
          return;
        }

        this.isInitializing = true;

        const newState = {
          windowState: 'normal',
          currentView: 'categorySelect',
          isOpen: true,
          isInitialized: true
        };

        Object.assign(this, newState);

        await this.$nextTick();

        this.applyTheme(this.currentTheme);

        this.$nextTick(() => {
          Promise.all([
            this.loadPersonas(),
          ]).catch(() => { });
        });

        this.isInitializing = false;

      } else {
        if (this.isClosing) {
          return;
        }

        this.isClosing = true;
        this.isOpen = false;

        this.safeSetTimeout(() => {
          this.isInitialized = false;
          this.isClosing = false;
        }, 150);
      }
    },

    closeChat() {
      // body 스크롤 복원
      document.body.style.overflow = '';

      Object.assign(this, {
        isOpen: false,
        currentView: 'categorySelect',
        selectedCategory: null,
        selectedPersona: null,
        windowState: 'normal'
      });

      this.cancelAllPendingRequests();

      this.$nextTick(() => {
        this.saveCurrentMessages();
        if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();

        this.safeSetTimeout(() => {
          this.isInitialized = false;
        }, 150);
      });
    },

    minimizeWindow() {
      if (this.windowState === 'minimized') {
        this.windowState = 'normal';
      } else {
        this.windowState = 'minimized';
      }
    },

    toggleMaximizeWindow() {
      if (this.windowState === 'maximized') {
        this.windowState = 'normal';
      } else {
        this.windowState = 'maximized';
      }
    },

    goToCategorySelect() {
      this.saveCurrentMessages();

      // 시스템 관리 모드에서 나가는 경우 body 스크롤 복원
      if (this.currentView === 'systemAdmin') {
        document.body.style.overflow = '';
      }

      Object.assign(this, {
        currentView: 'categorySelect',
        selectedCategory: null,
        selectedPersona: null
      });

      if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();
    },

    goToPersonaList() {
      this.saveCurrentMessages();

      Object.assign(this, {
        currentView: 'personaList',
        selectedPersona: null
      });

      if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();
    },

    goToFeedback() {
      this.currentView = 'feedback';
    },

    selectCategory(category) {
      if (category === 'systemAdmin') {
        Object.assign(this, {
          currentView: 'systemAdmin',
          selectedCategory: category
        });
      } else {
        Object.assign(this, {
          selectedCategory: category,
          currentView: 'personaList'
        });
      }
    },

    selectPersona(persona) {
      this.saveCurrentMessages();

      Object.assign(this, {
        selectedPersona: persona,
        currentView: 'chat'
      });

      this.$nextTick(() => {
        if (this.$refs.chatTab) {
          if (!this.loadCachedMessages(persona.personaCode)) {
            this.$refs.chatTab.loadPersonaHistory();
          }
        }
      });
    },

    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
      try {
        localStorage.setItem('ai-chatops-chat-lang', this.currentLanguage);
      } catch (error) {
      }
    },

    openRandomEasterEgg() {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      const easterEggUrl = `/playground/easter-egg${randomNumber}.html`;
      window.open(easterEggUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    },

    openSystemAdmin() {
      // 시스템 관리 페이지를 새 창에서 전체화면으로 열기
      const adminUrl = '/admin.html';
      window.open(adminUrl, '_blank', 'fullscreen=yes,scrollbars=yes');
    },

    openConversationAnalytics() {
      // 대화 분석 페이지를 새 창에서 전체화면으로 열기
      const analyticsUrl = '/analytics.html';
      window.open(analyticsUrl, '_blank', 'fullscreen=yes,scrollbars=yes');
    },

    saveCurrentMessages() {
      if (this.selectedPersona && this.$refs.chatTab && this.$refs.chatTab.messages.length > 0) {
        const currentMessages = this.$refs.chatTab.messages;
        const messagesToSave = currentMessages.slice(-this.maxMessagesPerPersona);
        this.setCache(this.selectedPersona.personaCode, messagesToSave);
      }
    },

    loadCachedMessages(personaCode) {
      const cachedMessages = this.getCache(personaCode);
      if (cachedMessages && cachedMessages.length > 0) {
        this.$refs.chatTab.messages = [...cachedMessages];
        this.$refs.chatTab.scrollToBottomInstantly();
        return true;
      }
      return false;
    },

    accessCache(personaCode) {
      if (this.cacheAccessOrder) {
        const index = this.cacheAccessOrder.indexOf(personaCode);
        if (index > -1) {
          this.cacheAccessOrder.splice(index, 1);
        }
        this.cacheAccessOrder.push(personaCode);
      }
    },

    setCache(personaCode, messages) {
      const maxCacheSize = this.maxMessagesPerPersona || 10;

      if (this.personaMessageCache.size >= maxCacheSize && !this.personaMessageCache.has(personaCode)) {
        const oldestKey = this.cacheAccessOrder?.[0];
        if (oldestKey) {
          this.personaMessageCache.delete(oldestKey);
          this.cacheAccessOrder.shift();
        }
      }

      this.personaMessageCache.set(personaCode, messages);
      this.accessCache(personaCode);
    },

    getCache(personaCode) {
      if (this.personaMessageCache.has(personaCode)) {
        this.accessCache(personaCode);
        return this.personaMessageCache.get(personaCode);
      }
      return null;
    },

    cleanupCache() {
      const maxSize = this.maxMessagesPerPersona || 10;
      if (this.personaMessageCache.size > maxSize) {
        const excessCount = this.personaMessageCache.size - maxSize;
        const keysToRemove = this.cacheAccessOrder?.slice(0, excessCount) || [];

        keysToRemove.forEach(key => {
          this.personaMessageCache.delete(key);
          const index = this.cacheAccessOrder.indexOf(key);
          if (index > -1) {
            this.cacheAccessOrder.splice(index, 1);
          }
        });
      }
    },

    startCacheCleanup() {
      this.stopCacheCleanup();
      this.cacheCleanupInterval = this.safeSetInterval(() => {
        this.cleanupCache();
      }, 300000);
    },

    stopCacheCleanup() {
      if (this.cacheCleanupInterval) {
        this.safeClearInterval(this.cacheCleanupInterval);
        this.cacheCleanupInterval = null;
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

      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }
      if (this.cacheCleanupInterval) {
        clearInterval(this.cacheCleanupInterval);
        this.cacheCleanupInterval = null;
      }
    },

    // Load personas from API
    loadPersonas() {
      if (this.loadingPersonas) {
        return Promise.resolve();
      }

      this.loadingPersonas = true;

      return aiChatOpsService.getPersonas()
        .then(response => {
          if (response.success) {
            this.personas = response.data.data || response.data || [];
          }
        })
        .catch(error => {
        })
        .finally(() => {
          this.loadingPersonas = false;
        });
    },

    handleMessageSent(data) {
      const requestId = `${data.personaCode}-${Date.now()}-${Math.random()}`;
      this.pendingRequests.set(requestId, {
        personaCode: data.personaCode,
        startTime: Date.now()
      });

      this.updateProcessingState();

      if (!data.sessionId && this.personaSessionMap[data.personaCode]) {
        data.sessionId = this.personaSessionMap[data.personaCode];
      }

      aiChatOpsService.sendMessage(data)
        .then(response => {
          if (response.success) {
            this.handleSuccessResponse(data, response);
          } else {
            this.handleErrorResponse(response.errorMessage || this.getText('aiError'));
          }
        })
        .catch(error => {
          this.handleErrorResponse(this.getText('networkError'));
          this.isConnected = false;
        })
        .finally(() => {
          this.pendingRequests.delete(requestId);
          this.updateProcessingState();
        });
    },

    // Handle successful API response
    handleSuccessResponse(data, response) {
      if (response.sessionId) {
        this.personaSessionMap[data.personaCode] = response.sessionId;
        try {
          localStorage.setItem('ai-chatops-chat-sessions', JSON.stringify(this.personaSessionMap));
        } catch (error) {
        }
      }

      if (this.$refs.chatTab) {
        this.$refs.chatTab.addAiResponse(response);
      }

      this.isConnected = true;
    },

    handleErrorResponse(errorMessage) {
      if (this.$refs.chatTab) {
        this.$refs.chatTab.addAiResponse({
          success: false,
          message: errorMessage
        });
      }
    },

    updateProcessingState() {
      const newCount = this.pendingRequests.size;
      const oldCount = this.chatProcessingCount;
      this.chatProcessingCount = newCount;

      if (oldCount !== newCount) {
        this.$emit('processing-state-changed', newCount > 0);
      }
    },

    handleProcessingStateChanged(isProcessing) {

    },

    cancelAllPendingRequests() {
      this.pendingRequests.clear();
      this.updateProcessingState();
      this.chatProcessingCount = 0;
    },

    handleFeedbackSent(feedbackData) {
      aiChatOpsService.sendFeedback(feedbackData)
        .then(response => {
          if (response.success) {
            if (this.$refs.feedbackTab) {
              this.$refs.feedbackTab.showSuccess(response.message);
            }
          } else {
            if (this.$refs.feedbackTab) {
              this.$refs.feedbackTab.showError(response.errorMessage || 'An error occurred while sending feedback.');
            }
          }
        })
        .catch(error => {
          if (this.$refs.feedbackTab) {
            this.$refs.feedbackTab.showError('An error occurred while sending feedback.');
          }
        });
    },

    loadStoredSessions() {
      try {
        const sessionData = localStorage.getItem('ai-chatops-chat-sessions');
        if (sessionData) {
          this.personaSessionMap = JSON.parse(sessionData);
        }
      } catch (error) {
        this.personaSessionMap = {};
      }
    },

    startHealthCheck() {
      if (this.healthCheckInterval) {
        this.safeClearInterval(this.healthCheckInterval);
      }
      this.healthCheckInterval = this.safeSetInterval(() => {
        aiChatOpsService.healthCheck()
          .then(response => {
            this.isConnected = response.success;
          })
          .catch(() => {
            this.isConnected = false;
          });
      }, 30000);
    },

    stopHealthCheck() {
      if (this.healthCheckInterval) {
        this.safeClearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }
    },

    cleanup() {
      this.clearAllTimers();
      this.stopHealthCheck();
      this.stopCacheCleanup();
    }
  },

  mounted() {
    this.loadStoredSessions();
    this.startHealthCheck();
    this.startCacheCleanup();

    this.$nextTick(() => {
      this.applyTheme(this.currentTheme);
    });
  },

  beforeDestroy() {
    this.cleanup();
    this.cancelAllPendingRequests();
    this.personas = [];
    this.selectedPersona = null;
    this.selectedCategory = null;
    this.pendingRequests.clear();
    this.personaMessageCache.clear();
    this.personaSessionMap = {};

    if (this.$refs.chatTab) {
      this.$refs.chatTab.resetToInitialState();
    }
    if (this.$refs.feedbackTab) {
      this.$refs.feedbackTab.resetForm();
    }
  }
};
</script>

<style>
@import './styles/aiChatOps.css';
@import './styles/customMarkdown.css';
</style>

<style scoped>
/* Component-specific layout only - centralized CSS handles styling */

/* Persona description text clamping - component-specific */
.persona-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  hyphens: auto;
}

/* Easter egg trigger - unique positioning */
.easter-egg-trigger {
  opacity: 0.3;
  width: 1px;
  height: 1px;
  border-radius: 50%;
  background: var(--color-text-muted);
  position: relative;
}

.easter-egg-trigger:hover {
  opacity: 0.5;
  transform: scale(1.5);
}
</style>