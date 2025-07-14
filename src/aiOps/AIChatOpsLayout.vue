<template>
  <div class="ai-chatops-chat">
    <button
      :class="['ai-chatops-chat-button', 'btn-system', 'btn-system--icon-only', { 'is-active': isOpen }]"
      @click="toggleChat"
    >
      <Elements v-if="isLoading" component-type="spinner" size="md" />
      <unicon v-else :name="isOpen ? 'times' : 'comment'" fill="currentColor" :width="28" :height="28" />
    </button>

    <!-- 🔧 FIX: v-if → v-show 최적화 적용 -->
    <div 
      v-show="isOpen && isInitialized" 
      class="ai-chatops-chat-window" 
      :class="[windowClasses, currentTheme]"
      ref="chatWindow"
    >
      <div class="chat-header">
        <div class="bot-info">
          <div class="avatar">
            <unicon name="comment" fill="white" :width="26" :height="26" />
          </div>
          <div class="details">
            <span class="name">{{ getText('aiChatOpsTitle') }}</span>
            <div class="status" :class="{ offline: !isConnected }">
              <span class="status-dot"></span>
              <span>{{ isConnected ? getText('online') : getText('offline') }}</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <div class="easter-egg-trigger btn-system btn-system--icon-only btn-system--sm" @click="openRandomEasterEgg">
            <span class="easter-dot"></span>
          </div>
          
          <button 
            class="theme-selector btn-system btn-system--ghost btn-system--sm" 
            @click="cycleTheme" 
            :title="getCurrentThemeName()"
          >
            <span class="theme-indicator">{{ getThemeDisplayName() }}</span>
          </button>
          
          <button
            class="language-btn btn-system btn-system--ghost btn-system--sm"
            @click="toggleLanguage"
          >
            <span>{{ currentLanguage === 'ko' ? 'EN' : 'KR' }}</span>
          </button>
          
          <div class="window-controls">
            <button
              class="window-control-btn btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
              @click="minimizeWindow"
            >
              <unicon name="minus" fill="currentColor" :width="12" :height="12" />
            </button>
            <button
              class="window-control-btn btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
              @click="toggleMaximizeWindow"
            >
              <unicon :name="windowState === 'maximized' ? 'compress-arrows-alt' : 'expand-arrows-alt'" fill="currentColor" :width="12" :height="12" />
            </button>
            <button
              class="window-control-btn btn-system btn-system--ghost btn-system--sm btn-system--icon-only"
              @click="closeChat"
            >
              <unicon name="times" fill="currentColor" :width="12" :height="12" />
            </button>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- 🔧 FIX: v-if → v-show 최적화 적용 -->
        <div v-show="currentView === 'categorySelect'" class="category-select">
          <div class="welcome-section">
            <div class="welcome-icon">
              <unicon name="heart" fill="var(--color-primary)" :width="28" :height="28" />
            </div>
            <div class="welcome-content">
              <h3>{{ getText('welcomeTitle') }}</h3>
              <p>{{ getText('welcomeMessage') }}</p>
            </div>
          </div>
          
          <div class="category-container">
            <div class="category-grid">
              <div
                v-for="category in categories"
                :key="category.key"
                @click="selectCategory(category.key)"
                class="category-card card-system card-system--interactive"
                :class="{ disabled: chatProcessingCount > 0 }"
              >
                <div class="category-icon" :class="`category-icon--${category.key}`">
                  <unicon :name="category.icon" fill="white" :width="20" :height="20" />
                </div>
                <div class="category-content">
                  <h4>{{ getText(category.titleKey) }}</h4>
                  <p>{{ getText(category.descKey) }}</p>
                </div>
                <div class="category-arrow">
                  <unicon name="angle-right" fill="currentColor" :width="14" :height="14" />
                </div>
              </div>
            </div>
            
            <div class="feedback-section">
              <button
                @click="goToFeedback"
                :disabled="chatProcessingCount > 0"
                class="feedback-btn btn-system btn-system--accent btn-system--md"
              >
                <unicon name="heart" fill="currentColor" :width="16" :height="16" />
                {{ getText('sendFeedback') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 🔧 FIX: v-if → v-show 최적화 적용 -->
        <div v-show="currentView === 'personaList'" class="persona-list-tab">
          <div class="persona-header">
            <button
              @click="goToCategorySelect"
              class="back-btn btn-system btn-system--ghost btn-system--sm"
            >
              <unicon name="arrow-left" fill="currentColor" :width="14" :height="14" />
              {{ getText('back') }}
            </button>
            
            <div class="header-content">
              <div class="category-badge">
                <unicon 
                  :name="getCategoryIcon(selectedCategory)" 
                  fill="white" 
                  :width="16" 
                  :height="16"
                />
                <span>{{ getCategoryDisplayName(selectedCategory) }}</span>
              </div>
              <h3>{{ getText('selectPersonaDesc') }}</h3>
            </div>
          </div>

          <div class="persona-content">
            <!-- 🔧 FIX: 로딩 상태도 v-show 사용 -->
            <div v-show="loadingPersonas" class="loading-container">
              <Elements component-type="spinner" size="lg" centered />
              <span>{{ getText('loadingPersonas') }}</span>
            </div>

            <div v-show="!loadingPersonas && filteredPersonas.length === 0" class="no-personas">
              <unicon name="info-circle" fill="var(--text-muted)" :width="40" :height="40" />
              <h4>{{ getText('noPersonas') }}</h4>
              <p>{{ getText('noPersonasDesc') }}</p>
              <button
                @click="goToCategorySelect"
                class="btn-system btn-system--primary btn-system--md"
              >
                <unicon name="home" fill="currentColor" :width="16" :height="16" />
                {{ getText('goHome') }}
              </button>
            </div>

            <div v-show="!loadingPersonas && filteredPersonas.length > 0" class="persona-grid">
              <div
                v-for="(persona, index) in filteredPersonas"
                :key="persona.personaCode"
                @click="selectPersona(persona)"
                class="persona-card card-system card-system--interactive"
                :class="{ disabled: loadingPersonas }"
              >
                <div class="persona-card-content">
                  <div 
                    class="persona-icon" 
                    :style="{ backgroundColor: getPersonaColor(index, getPersonaDescription(persona)) }"
                  >
                    <unicon :name="getPersonaIconName(persona)" fill="white" :width="20" :height="20" />
                  </div>
                  
                  <div class="persona-info">
                    <h4 class="persona-title">{{ persona.title || persona.personaCode }}</h4>
                    <p class="persona-description">{{ getPersonaDescription(persona) }}</p>
                  </div>
                  
                  <div class="persona-arrow">
                    <unicon name="angle-right" fill="currentColor" :width="14" :height="14" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🔧 FIX: 채팅과 피드백은 무거운 컴포넌트이므로 v-if 유지 -->
        <ChatTab 
          v-if="currentView === 'chat' && isInitialized" 
          ref="chatTab" 
          :selected-persona="selectedPersona"
          :is-processing="chatProcessingCount > 0" 
          :current-language="currentLanguage" 
          :window-size="windowSize"
          :selected-category="selectedCategory"
          @message-sent="handleMessageSent" 
          @processing-state-changed="handleProcessingStateChanged"
          @go-persona-list="goToPersonaList" 
          @go-home="goToCategorySelect" 
        />
        
        <FeedbackTab 
          v-if="currentView === 'feedback' && isInitialized" 
          ref="feedbackTab" 
          :current-language="currentLanguage" 
          @feedback-sent="handleFeedbackSent"
          @go-home="goToCategorySelect" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import aiChatOpsService from '@/service/aiChatOpsService';
import { getText } from './utils/i18n';
import ChatTab from './components/ChatTab.vue';
import FeedbackTab from './components/FeedbackTab.vue';
import Elements from './components/Elements.vue';

export default {
  name: 'AIChatOpsLayout',
  components: { 
    ChatTab, 
    FeedbackTab, 
    Elements
  },
  
  data() {
    return {
      isOpen: false,
      isInitialized: false,
      isLoading: false,
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
      maxMessagesPerPersona: 30,
      windowState: 'normal',
      windowSize: {
        width: 455,
        height: 676
      },
      chatProcessingCount: 0,
      pendingRequests: new Map(),
      healthCheckInterval: null,
      cacheCleanupInterval: null,
      availableThemes: [
        { key: 'theme-default', name: 'Default', displayName: 'D' },
        { key: 'theme-timeless', name: 'Timeless', displayName: 'T' },
        { key: 'theme-heritage', name: 'Heritage', displayName: 'H' },
        { key: 'theme-modern', name: 'Modern', displayName: 'M' },
        { key: 'theme-hermes', name: 'Hermes', displayName: 'E' }
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
          icon: 'users-alt',
          titleKey: 'generalCategory',
          descKey: 'generalCategoryDesc'
        },
        {
          key: 'operation',
          icon: 'cog',
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
      if (!this.selectedCategory || !this.personas) return [];
      return this.personas.filter(persona => 
        persona.category === this.selectedCategory ||
        (persona.tags && persona.tags.includes(this.selectedCategory))
      );
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
        return localStorage.getItem('ai-chatops-chat-theme') || 'theme-default';
      } catch (error) {
        return 'theme-default';
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
        console.log('Could not save theme preference');
      }
    },
    
    getCategoryIcon(category) {
      const iconMap = {
        'operation': 'cog',
        'general': 'users-alt',
        'personal': 'user'
      };
      return iconMap[category] || 'grid';
    },
    
    getCategoryDisplayName(category) {
      const displayNames = {
        'personal': 'personalCategory',
        'general': 'generalCategory',
        'operation': 'operationCategory'
      };
      
      return this.getText(displayNames[category] || category);
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

    getPersonaColor(index, description = '') {
      const descLength = description.length || 1;
      const colorIndex = (index + descLength) % this.personaColors.length;
      return this.personaColors[colorIndex];
    },

    // 🔧 FIX: 상태 변경 배치 처리 적용
    async toggleChat() {
      if (!this.isOpen) {
        // 상태 변경을 배치로 처리하여 플리커링 방지
        const newState = {
          windowState: 'normal',
          currentView: 'categorySelect',
          isOpen: true,
          isInitialized: true
        };
        
        // 한 번에 상태 업데이트
        Object.assign(this, newState);
        
        // 단일 nextTick으로 DOM 업데이트 최적화
        await this.$nextTick();
        
        // 테마 적용
        this.applyTheme(this.currentTheme);
        
        // 비동기 작업들은 별도로 처리 (UI 블로킹 방지)
        this.$nextTick(() => {
          Promise.all([
            this.loadPersonas(),
            this.preloadPopularPersonas()
          ]).catch(console.error);
        });
        
      } else {
        this.isOpen = false;
        setTimeout(() => {
          this.isInitialized = false;
        }, 300);
      }
    },
    
    closeChat() {
      this.saveCurrentMessages();
      
      // 배치 상태 변경으로 플리커링 방지
      Object.assign(this, {
        isOpen: false,
        currentView: 'categorySelect',
        selectedCategory: null,
        selectedPersona: null,
        windowState: 'normal'
      });
      
      setTimeout(() => {
        this.isInitialized = false;
      }, 300);
      
      this.cancelAllPendingRequests();
      if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();
    },
    
    minimizeWindow() {
      this.windowState = this.windowState === 'minimized' ? 'normal' : 'minimized';
    },
    
    toggleMaximizeWindow() {
      this.windowState = this.windowState === 'maximized' ? 'normal' : 'maximized';
    },
    
    goToCategorySelect() {
      this.saveCurrentMessages();
      
      // 배치 상태 변경
      Object.assign(this, {
        currentView: 'categorySelect',
        selectedCategory: null,
        selectedPersona: null
      });
      
      if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();
    },
    
    goToPersonaList() {
      this.saveCurrentMessages();
      
      // 배치 상태 변경
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
      // 배치 상태 변경
      Object.assign(this, {
        selectedCategory: category,
        currentView: 'personaList'
      });
    },
    
    selectPersona(persona) {
      this.saveCurrentMessages();
      
      // 배치 상태 변경
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
        console.log('Could not save language preference');
      }
    },
    
    openRandomEasterEgg() {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      const easterEggUrl = `/playground/easter-egg${randomNumber}.html`;
      window.open(easterEggUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    },

    saveCurrentMessages() {
      if (this.selectedPersona && this.$refs.chatTab && this.$refs.chatTab.messages.length > 0) {
        const currentMessages = this.$refs.chatTab.messages;
        const messagesToSave = currentMessages.slice(-this.maxMessagesPerPersona);
        this.personaMessageCache.set(this.selectedPersona.personaCode, messagesToSave);
      }
    },

    loadCachedMessages(personaCode) {
      const cachedMessages = this.personaMessageCache.get(personaCode);
      if (cachedMessages && cachedMessages.length > 0) {
        this.$refs.chatTab.messages = [...cachedMessages];
        this.$refs.chatTab.scrollToBottomInstantly();
        return true;
      }
      return false;
    },

    async preloadPopularPersonas() {
      const popularPersonas = this.personas.slice(0, 3);
      
      for (const persona of popularPersonas) {
        if (!this.personaMessageCache.has(persona.personaCode)) {
          try {
            const response = await aiChatOpsService.getConversations(persona.personaCode);
            if (response.success && response.data) {
              const messages = aiChatOpsService.convertConversationsToMessages(response.data);
              const recentMessages = messages.slice(-this.maxMessagesPerPersona);
              this.personaMessageCache.set(persona.personaCode, recentMessages);
            }
          } catch (error) {
            console.log('Error preloading persona:', persona.personaCode);
          }
        }
      }
    },

    cleanupCache() {
      if (this.personaMessageCache.size > 10) {
        const entries = Array.from(this.personaMessageCache.entries());
        const oldestEntries = entries.slice(0, this.personaMessageCache.size - 10);
        oldestEntries.forEach(([key]) => {
          this.personaMessageCache.delete(key);
        });
      }
    },

    startCacheCleanup() {
      this.cacheCleanupInterval = setInterval(() => {
        this.cleanupCache();
      }, 300000);
    },

    stopCacheCleanup() {
      if (this.cacheCleanupInterval) {
        clearInterval(this.cacheCleanupInterval);
        this.cacheCleanupInterval = null;
      }
    },
    
    loadPersonas() {
      if (this.loadingPersonas) return Promise.resolve();
      
      this.loadingPersonas = true;
      
      return aiChatOpsService.getPersonas()
        .then(response => {
          if (response.success) {
            this.personas = response.data || [];
          }
        })
        .catch(error => {
          console.log('Error loading personas:', error);
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
      
      aiChatOpsService.sendMessage(data, true)
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
    
    handleSuccessResponse(data, response) {
      if (response.sessionId) {
        this.personaSessionMap[data.personaCode] = response.sessionId;
        try {
          localStorage.setItem('ai-chatops-chat-sessions', JSON.stringify(this.personaSessionMap));
        } catch (error) {
          console.log('Could not save session data');
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
      this.healthCheckInterval = setInterval(() => {
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
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }
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
    this.stopHealthCheck();
    this.stopCacheCleanup();
    this.cancelAllPendingRequests();
    this.personas = [];
    this.selectedPersona = null;
    this.selectedCategory = null;
    this.pendingRequests.clear();
    this.personaMessageCache.clear();
    this.healthCheckInterval = null;
    this.cacheCleanupInterval = null;
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
/* 🔧 FIX: GPU 가속 트랜지션으로 플리커링 방지 */
.ai-chatops-chat-window {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
}

/* 기존 스타일 유지... */
.chat-header {
  background: var(--color-header-bg) !important;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--layout-header-height);
  position: relative;
  z-index: 10;
}

.chat-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--space-lg);
  right: var(--space-lg);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--color-header-accent) 50%, transparent 100%);
  opacity: 0.6;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--color-header-accent) !important;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
  position: relative;
}

.avatar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: var(--radius-full);
}

.details .name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-header-text) !important;
  margin-bottom: 2px;
  letter-spacing: -0.01em;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-header-text-secondary) !important;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px var(--color-success);
  animation: pulse 2s infinite;
}

.status.offline .status-dot {
  background: var(--color-error);
  box-shadow: 0 0 8px var(--color-error);
  animation: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.easter-egg-trigger {
  width: 20px !important;
  height: 20px !important;
  min-height: 20px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.easter-egg-trigger:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: var(--color-header-accent) !important;
}

.easter-dot {
  width: 6px;
  height: 6px;
  background: #8B5CF6;
  border-radius: var(--radius-full);
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.6);
  animation: sparkle 2s infinite;
}

.theme-selector {
  color: var(--color-header-text) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.theme-selector:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: var(--color-header-accent) !important;
}

.language-btn,
.window-control-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: var(--color-header-text) !important;
}

.language-btn:hover,
.window-control-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: var(--color-header-accent) !important;
}

.window-controls {
  display: flex;
  gap: 4px;
}

.content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.category-select {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-light);
  overflow: hidden;
}

.welcome-section {
  text-align: center;
  padding: var(--space-lg) var(--space-xl) var(--space-md);
  flex-shrink: 0;
}

.welcome-content h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: var(--space-md) 0 var(--space-sm) 0;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.welcome-content p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
  padding: 0 var(--space-md);
}

.category-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-xl) var(--space-lg);
  min-height: 0;
  overflow: hidden;
}

.category-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  overflow-y: auto;
}

.category-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  min-height: 64px;
  padding: var(--space-md);
}

.category-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.category-icon--personal {
  background: var(--color-primary);
}

.category-icon--general {
  background: var(--color-primary-dark);
}

.category-icon--operation {
  background: var(--color-accent);
}

.category-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  border-radius: var(--radius-lg);
}

.category-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.category-content h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.category-content p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.category-arrow {
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  transition: all var(--motion-fast);
}

.category-card:hover .category-arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}

.feedback-section {
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border-light);
  text-align: center;
  flex-shrink: 0;
}

.persona-list-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-light);
  overflow: hidden;
}

.persona-header {
  padding: var(--space-lg) var(--space-xl) var(--space-md);
  background: var(--color-surface-light);
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.header-content {
  text-align: center;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  margin-bottom: var(--space-md);
  box-shadow: var(--shadow-soft);
  background: var(--color-primary);
}

.header-content h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.persona-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md) var(--space-xl) var(--space-lg);
  min-height: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: var(--space-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
}

.no-personas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  gap: var(--space-lg);
}

.no-personas h4 {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.no-personas p {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

.persona-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.persona-card {
  padding: var(--space-md);
  min-height: 80px;
  max-height: 80px;
}

.persona-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.persona-card-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  height: 100%;
}

.persona-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.persona-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  border-radius: var(--radius-lg);
}

.persona-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
}

.persona-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.persona-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.3;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  hyphens: auto;
}

.persona-arrow {
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: all var(--motion-fast);
}

.persona-card:hover .persona-arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}

.ai-chatops-chat-button {
  width: var(--layout-float-size);
  height: var(--layout-float-size);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border: 2px solid var(--color-surface-white);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-floating);
  transition: all var(--motion-normal);
  position: relative;
  overflow: hidden;
  color: var(--color-surface-white);
}

.ai-chatops-chat-button .unicon {
  color: var(--color-surface-white) !important;
  fill: var(--color-surface-white) !important;
}

.ai-chatops-chat-button.is-active {
  transform: scale(0.95);
  background: linear-gradient(135deg, var(--color-accent) 0%, #0891b2 100%);
  box-shadow: var(--shadow-soft);
}

.ai-chatops-chat-button.is-active .unicon {
  color: var(--color-surface-white) !important;
  fill: var(--color-surface-white) !important;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@media (max-width: 640px) {
  .category-select,
  .persona-list-tab {
    padding: 0;
  }
  
  .welcome-section {
    padding: var(--space-md) var(--space-lg) var(--space-sm);
  }
  
  .category-container {
    padding: 0 var(--space-lg) var(--space-md);
  }
  
  .persona-content {
    padding: var(--space-sm) var(--space-lg) var(--space-md);
  }
  
  .category-card,
  .persona-card {
    padding: var(--space-sm);
    gap: var(--space-sm);
    min-height: 60px;
  }
  
  .persona-card {
    max-height: 60px;
  }
  
  .category-icon,
  .persona-icon {
    width: 36px;
    height: 36px;
  }
  
  .category-content h4,
  .persona-title {
    font-size: var(--font-size-sm);
  }
  
  .category-content p,
  .persona-description {
    font-size: var(--font-size-xs);
  }
}
</style>