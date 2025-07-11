<template>
  <div class="aiops-chat">
    <AIOpsComponents
      component-type="button"
      :class="['aiops-chat-button', { 'is-active': isOpen }]"
      variant="primary"
      :icon="isOpen ? 'times' : 'comment'"
      @click="toggleChat"
      size="lg"
    />

    <div 
      v-show="isOpen && isInitialized" 
      class="aiops-chat-window" 
      :class="windowClasses"
      ref="chatWindow"
    >
      <div class="chat-header">
        <div class="bot-info">
          <div class="avatar">
            <unicon name="comment" fill="white" :width="24" :height="24" />
          </div>
          <div class="details">
            <span class="name">AIOps Chat</span>
            <div class="status" :class="{ offline: !isConnected }">
              <span class="dot"></span>
              <span>{{ isConnected ? getText('online') : getText('offline') }}</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <AIOpsComponents
            component-type="button"
            variant="ghost"
            size="sm"
            @click="openRandomEasterEgg"
            class="easter-egg-trigger"
          >
            <span class="easter-dot"></span>
          </AIOpsComponents>
          
          <AIOpsComponents
            component-type="button"
            variant="ghost"
            size="sm"
            @click="changeColorTheme"
            class="theme-btn"
          >
            <span class="theme-indicator" :class="currentTheme"></span>
          </AIOpsComponents>
          
          <AIOpsComponents
            component-type="button"
            variant="ghost"
            size="sm"
            @click="toggleLanguage"
          >
            <span>{{ currentLanguage === 'ko' ? 'EN' : 'KR' }}</span>
          </AIOpsComponents>
          
          <div class="window-controls">
            <AIOpsComponents
              component-type="button"
              variant="ghost"
              size="sm"
              icon="minus"
              @click="minimizeWindow"
              class="window-control-btn"
            />
            <AIOpsComponents
              component-type="button"
              variant="ghost"
              size="sm"
              :icon="windowState === 'maximized' ? 'compress-alt' : 'expand-alt'"
              @click="toggleMaximizeWindow"
              class="window-control-btn"
            />
            <AIOpsComponents
              component-type="button"
              variant="ghost"
              size="sm"
              icon="times"
              @click="closeChat"
              class="window-control-btn"
            />
          </div>
        </div>
      </div>

      <div class="content">
        <div v-if="currentView === 'categorySelect'" class="category-select">
          <div class="welcome-section">
            <div class="welcome-icon">
              <unicon name="heart" fill="var(--primary-color)" :width="32" :height="32" />
            </div>
            <div class="welcome-content">
              <h3>{{ getText('welcomeTitle') }}</h3>
              <p>{{ getText('welcomeMessage') }}</p>
            </div>
          </div>
          
          <div class="category-grid">
            <AIOpsComponents
              component-type="button"
              v-for="category in categories"
              :key="category.key"
              @click="selectCategory(category.key)"
              :disabled="chatProcessingCount > 0"
              variant="outline"
              size="lg"
              class="category-card"
              :class="category.key"
              block
            >
              <div class="category-icon" :class="category.key">
                <unicon :name="category.icon" fill="white" :width="24" :height="24" />
              </div>
              <div class="category-info">
                <h4>{{ getText(category.titleKey) }}</h4>
                <p>{{ getText(category.descKey) }}</p>
              </div>
            </AIOpsComponents>
          </div>
          
          <div class="feedback-section">
            <AIOpsComponents
              component-type="button"
              @click="goToFeedback"
              :disabled="chatProcessingCount > 0"
              variant="accent"
              icon="heart"
              class="feedback-btn"
            >
              {{ getText('sendFeedback') }}
            </AIOpsComponents>
          </div>
        </div>

        <div v-if="currentView === 'personaList'" class="persona-list-tab">
          <div class="persona-header">
            <AIOpsComponents
              component-type="button"
              @click="goToCategorySelect"
              variant="ghost"
              icon="arrow-left"
              size="sm"
              class="back-btn"
            >
              {{ getText('back') }}
            </AIOpsComponents>
            
            <div class="header-content">
              <div class="category-badge" :class="selectedCategory">
                <unicon 
                  :name="getCategoryIcon(selectedCategory)" 
                  fill="white" 
                  :width="20" 
                  :height="20"
                />
                <span>{{ getCategoryDisplayName(selectedCategory) }}</span>
              </div>
              <h3>{{ getText('selectPersonaDesc') }}</h3>
            </div>
          </div>

          <div class="persona-content">
            <div v-if="loadingPersonas" class="loading-container">
              <AIOpsComponents component-type="spinner" size="lg" centered />
              <span>{{ getText('loadingPersonas') }}</span>
            </div>

            <div v-else-if="filteredPersonas.length === 0" class="no-personas">
              <unicon name="info-circle" fill="var(--text-muted)" :width="48" :height="48" />
              <h4>{{ getText('noPersonas') }}</h4>
              <p>{{ getText('noPersonasDesc') }}</p>
              <AIOpsComponents
                component-type="button"
                @click="goToCategorySelect"
                variant="primary"
                icon="home"
              >
                {{ getText('goHome') }}
              </AIOpsComponents>
            </div>

            <div v-else class="persona-grid">
              <AIOpsComponents
                component-type="button"
                v-for="persona in filteredPersonas"
                :key="persona.personaCode"
                @click="selectPersona(persona)"
                :disabled="loadingPersonas"
                variant="outline"
                class="persona-card"
                block
              >
                <div class="persona-icon">
                  <unicon 
                    :name="getPersonaIconName(persona)" 
                    fill="currentColor" 
                    :width="24" 
                    :height="24"
                  />
                </div>
                
                <div class="persona-info">
                  <h4>{{ persona.title || persona.personaCode }}</h4>
                  <p>{{ getPersonaDescription(persona) }}</p>
                </div>
                
                <div class="arrow-icon">
                  <unicon name="angle-right" fill="currentColor" :width="16" :height="16" />
                </div>
              </AIOpsComponents>
            </div>
          </div>
        </div>

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

      <div class="chat-footer">
        <div class="easter-eggs">
          <button 
            v-for="n in 3"
            :key="n"
            @click="triggerEasterEgg(n)" 
            class="easter-egg-btn"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './styles/customMarkdown.css';
import './styles/aiopsChat.css';
import aiopsChatService from './services/floatchatService';
import { getText } from './utils/i18n';
import ChatTab from './components/ChatTab.vue';
import FeedbackTab from './FeedbackTab.vue';
import AIOpsComponents from './components/AIOpsComponents.vue';

export default {
  name: 'AIOpsLayout',
  components: { 
    ChatTab, 
    FeedbackTab, 
    AIOpsComponents 
  },
  
  data() {
    return {
      isOpen: false,
      isInitialized: false,
      currentView: 'categorySelect',
      selectedCategory: null,
      selectedPersona: null,
      personas: [],
      loadingPersonas: false,
      isConnected: true,
      currentLanguage: this.getInitialLanguage(),
      currentTheme: this.getInitialTheme(),
      personaSessionMap: {},
      windowState: 'normal',
      windowSize: {
        width: 455,
        height: 676
      },
      chatProcessingCount: 0,
      pendingRequests: new Map(),
      categories: [
        {
          key: 'personal',
          icon: 'user',
          titleKey: 'personalCategory',
          descKey: 'personalCategoryDesc'
        },
        {
          key: 'user',
          icon: 'users-alt',
          titleKey: 'userCategory',
          descKey: 'userCategoryDesc'
        },
        {
          key: 'devops',
          icon: 'cog',
          titleKey: 'devopsCategory',
          descKey: 'devopsCategoryDesc'
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
        return localStorage.getItem('aiops-chat-lang') || 'ko';
      } catch (error) {
        return 'ko';
      }
    },
    
    getInitialTheme() {
      try {
        return localStorage.getItem('aiops-chat-theme') || 'default';
      } catch (error) {
        return 'default';
      }
    },
    
    getCategoryIcon(category) {
      const iconMap = {
        'devops': 'cog',
        'user': 'users-alt',
        'personal': 'user'
      };
      return iconMap[category] || 'grid';
    },
    
    getCategoryDisplayName(category) {
      const displayNames = {
        'personal': 'personalCategory',
        'user': 'userCategory',
        'devops': 'devopsCategory'
      };
      
      return this.getText(displayNames[category] || category);
    },
    
    getPersonaIconName(persona) {
      if (!persona) return 'comment';
      return aiopsChatService.getPersonaIcon(persona.personaCode, persona.iconPath);
    },
    
    getPersonaDescription(persona) {
      if (!persona) return '';
      if (this.currentLanguage === 'en' && persona.descriptionEn) {
        return persona.descriptionEn;
      }
      return persona.description || this.getText('defaultPersonaDesc');
    },
    
    async toggleChat() {
      if (!this.isOpen) {
        this.isOpen = true;
        this.windowState = 'normal';
        this.isInitialized = true;
        this.currentView = 'categorySelect';
        await this.loadPersonas();
      } else {
        this.isOpen = false;
        this.isInitialized = false;
      }
    },
    
    closeChat() {
      this.isOpen = false;
      this.isInitialized = false;
      this.currentView = 'categorySelect';
      this.selectedCategory = null;
      this.selectedPersona = null;
      this.windowState = 'normal';
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
      this.currentView = 'categorySelect';
      this.selectedCategory = null;
      this.selectedPersona = null;
      if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();
    },
    
    goToPersonaList() {
      this.currentView = 'personaList';
      this.selectedPersona = null;
      if (this.$refs.chatTab) this.$refs.chatTab.resetToInitialState();
    },
    
    goToFeedback() {
      this.currentView = 'feedback';
    },
    
    selectCategory(category) {
      this.selectedCategory = category;
      this.currentView = 'personaList';
    },
    
    selectPersona(persona) {
      this.selectedPersona = persona;
      this.currentView = 'chat';
      this.$nextTick(() => {
        if (this.$refs.chatTab) {
          this.$refs.chatTab.loadPersonaHistory();
        }
      });
    },
    
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
      try {
        localStorage.setItem('aiops-chat-lang', this.currentLanguage);
      } catch (error) {
        
      }
    },
    
    triggerEasterEgg(number) {
      alert(`${this.getText('easterEgg')}${number}!`);
    },
    
    openRandomEasterEgg() {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      const easterEggUrl = `/playground/easter-egg${randomNumber}.html`;
      window.open(easterEggUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    },
    
    changeColorTheme() {
      const themes = ['default', 'timeless', 'heritage', 'modern', 'hermes'];
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      this.currentTheme = themes[nextIndex];
      
      this.applyTheme(this.currentTheme);
      
      try {
        localStorage.setItem('aiops-chat-theme', this.currentTheme);
      } catch (error) {
        
      }
    },
    
    getCurrentThemeName() {
      const themeNames = {
        ko: {
          default: '기본 테마',
          timeless: '타임리스 테마',
          heritage: '헤리티지 테마',
          modern: '모던 테마',
          hermes: '에르메스 테마'
        },
        en: {
          default: 'Default Theme',
          timeless: 'Timeless Theme',
          heritage: 'Heritage Theme',
          modern: 'Modern Theme',
          hermes: 'Hermes Theme'
        }
      };
      return themeNames[this.currentLanguage][this.currentTheme] || this.getText('changeTheme');
    },
    
    applyTheme(themeName) {
      const root = document.documentElement;
      const body = document.body;
      
      const themeClasses = ['theme-default', 'theme-timeless', 'theme-heritage', 'theme-modern', 'theme-hermes'];
      
      root.classList.remove(...themeClasses);
      body.classList.remove(...themeClasses);
      
      const newThemeClass = `theme-${themeName}`;
      root.classList.add(newThemeClass);
      body.classList.add(newThemeClass);
      
      this.$nextTick(() => {
        const chatWindow = this.$refs.chatWindow;
        if (chatWindow) {
          chatWindow.classList.remove(...themeClasses);
          chatWindow.classList.add(newThemeClass);
        }
        
        const aiopsChatButton = document.querySelector('.aiops-chat-button');
        if (aiopsChatButton) {
          aiopsChatButton.classList.remove(...themeClasses);
          aiopsChatButton.classList.add(newThemeClass);
          
          aiopsChatButton.style.opacity = '0.99';
          setTimeout(() => {
            aiopsChatButton.style.opacity = '1';
          }, 10);
        }
      });
    },
    
    loadPersonas() {
      if (this.loadingPersonas) return Promise.resolve();
      
      this.loadingPersonas = true;
      
      return aiopsChatService.getPersonas()
        .then(response => {
          if (response.success) {
            this.personas = response.data || [];
          }
        })
        .catch(error => {
          
        })
        .finally(() => {
          this.loadingPersonas = false;
        });
    },
    
    handleMessageSent(data) {
      const requestId = Date.now() + Math.random();
      
      this.pendingRequests.set(requestId, {
        personaCode: data.personaCode,
        startTime: Date.now()
      });
      this.updateProcessingState();
      
      if (!data.sessionId && this.personaSessionMap[data.personaCode]) {
        data.sessionId = this.personaSessionMap[data.personaCode];
      }
      
      aiopsChatService.sendMessage(data, true)
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
          localStorage.setItem('aiops-chat-sessions', JSON.stringify(this.personaSessionMap));
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
    },
    
    handleFeedbackSent(feedbackData) {
      aiopsChatService.sendFeedback(feedbackData)
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
        const sessionData = localStorage.getItem('aiops-chat-sessions');
        if (sessionData) {
          this.personaSessionMap = JSON.parse(sessionData);
        }
      } catch (error) {
        this.personaSessionMap = {};
      }
    }
  },
  
  mounted() {
    this.loadStoredSessions();
    
    this.$nextTick(() => {
      this.applyTheme(this.currentTheme);
    });
  }
};
</script>

<style scoped>
.aiops-chat-button {
  width: var(--float-size) !important;
  height: var(--float-size) !important;
  border-radius: var(--radius-full) !important;
  min-height: var(--float-size) !important;
  position: relative;
  background: var(--primary-color) !important;
  border: 2px solid var(--surface-white) !important;
  color: var(--header-text) !important;
}

.aiops-chat-button.is-active {
  background: var(--primary-dark) !important;
  transform: scale(0.95);
}

.chat-header {
  background: var(--header-bg) !important;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  position: relative;
  z-index: 10;
}

.chat-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--spacing-xl);
  right: var(--spacing-xl);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--header-accent) 50%, transparent 100%);
  opacity: 0.6;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--header-accent) !important;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
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
  color: var(--header-text) !important;
  margin-bottom: 2px;
  letter-spacing: -0.01em;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  color: var(--header-text-secondary) !important;
  font-weight: 500;
}

.status .dot {
  width: 6px;
  height: 6px;
  background: var(--success-color);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px var(--success-color);
  animation: pulse 2s infinite;
}

.status.offline .dot {
  background: var(--error-color);
  box-shadow: 0 0 8px var(--error-color);
  animation: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.easter-egg-trigger,
.theme-btn,
.window-control-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: var(--header-text) !important;
}

.easter-egg-trigger:hover,
.theme-btn:hover,
.window-control-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: var(--header-accent) !important;
}

.easter-egg-trigger {
  width: 20px !important;
  height: 20px !important;
  min-height: 20px !important;
  border-radius: var(--radius-full) !important;
  padding: 0 !important;
}

.easter-dot {
  width: 3px;
  height: 3px;
  background: #8B5CF6;
  border-radius: var(--radius-full);
  position: relative;
  animation: sparkle 2s infinite;
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.6);
}

.theme-btn {
  width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  border-radius: var(--radius-full) !important;
  padding: 0 !important;
}

.theme-indicator {
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  position: relative;
  transition: all var(--transition-smooth);
}

.theme-indicator.default {
  background: linear-gradient(135deg, var(--aiops-primary-blue) 0%, var(--aiops-accent-cyan) 50%, var(--aiops-background) 100%);
}

.theme-indicator.timeless {
  background: linear-gradient(135deg, var(--timeless-secondary-noir) 0%, var(--timeless-accent-red) 50%, var(--timeless-background) 100%);
}

.theme-indicator.heritage {
  background: linear-gradient(135deg, var(--heritage-secondary-navy) 0%, var(--heritage-primary-camel) 50%, var(--heritage-background) 100%);
}

.theme-indicator.modern {
  background: linear-gradient(135deg, var(--modern-primary-green) 0%, var(--modern-accent-gold) 50%, var(--modern-background) 100%);
}

.theme-indicator.hermes {
  background: linear-gradient(135deg, var(--hermes-primary-orange) 0%, var(--hermes-accent-gold) 50%, var(--hermes-background) 100%);
}

.window-controls {
  display: flex;
  gap: 4px;
}

.window-control-btn {
  width: 28px !important;
  height: 28px !important;
  min-height: 28px !important;
}

.content {
  flex: 1;
  overflow: hidden;
}

.category-select {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
  background: var(--surface-light);
}

.welcome-section {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
}

.welcome-icon {
  margin-bottom: var(--spacing-lg);
}

.welcome-content h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.welcome-content p {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  padding: 0 var(--spacing-md);
}

.category-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 100%;
}

.category-card {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: var(--spacing-lg) !important;
  text-align: left !important;
  padding: var(--spacing-lg) !important;
  background: var(--surface-white) !important;
  border: 2px solid var(--border-light) !important;
  border-radius: var(--radius-lg) !important;
  min-height: 70px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  transition: all var(--transition-smooth) !important;
}

.category-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-lg) !important;
  border-color: var(--primary-color) !important;
}

.category-card.personal {
  border-color: var(--timeless-accent-red) !important;
}

.category-card.personal:hover {
  border-color: var(--timeless-accent-red) !important;
  box-shadow: 0 8px 25px rgba(195, 27, 38, 0.15) !important;
}

.category-card.user {
  border-color: var(--aiops-accent-cyan) !important;
}

.category-card.user:hover {
  border-color: var(--aiops-accent-cyan) !important;
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.15) !important;
}

.category-card.devops {
  border-color: var(--heritage-accent-oxblood) !important;
}

.category-card.devops:hover {
  border-color: var(--heritage-accent-oxblood) !important;
  box-shadow: 0 8px 25px rgba(167, 1, 0, 0.15) !important;
}

.category-icon {
  width: 48px !important;
  height: 48px !important;
  border-radius: var(--radius-lg) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  position: relative !important;
  overflow: hidden !important;
}

.category-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  border-radius: var(--radius-lg);
}

.category-icon.personal {
  background: var(--timeless-accent-red) !important;
}

.category-icon.user {
  background: var(--aiops-accent-cyan) !important;
}

.category-icon.devops {
  background: var(--heritage-accent-oxblood) !important;
}

.category-info {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  gap: 4px !important;
}

.category-info h4 {
  font-size: var(--font-size-lg) !important;
  font-weight: 600 !important;
  color: var(--text-primary) !important;
  margin: 0 !important;
  line-height: 1.2 !important;
}

.category-info p {
  font-size: var(--font-size-base) !important;
  color: var(--text-secondary) !important;
  margin: 0 !important;
  line-height: 1.4 !important;
}

.feedback-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-light);
  text-align: center;
}

.feedback-btn {
  padding: var(--spacing-lg) var(--spacing-2xl) !important;
}

.persona-list-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-light);
}

.persona-header {
  padding: var(--spacing-xl);
  background: var(--surface-light);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.back-btn {
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color) !important;
}

.header-content {
  text-align: center;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 25px;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: white;
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.category-badge.personal {
  background: var(--timeless-accent-red);
}

.category-badge.user {
  background: var(--aiops-accent-cyan);
}

.category-badge.devops {
  background: var(--heritage-accent-oxblood);
}

.header-content h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.persona-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
  min-height: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
}

.no-personas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  text-align: center;
  gap: var(--spacing-lg);
}

.no-personas h4 {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.no-personas p {
  font-size: var(--font-size-base);
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.persona-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 100%;
}

.persona-card {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: var(--spacing-lg) !important;
  text-align: left !important;
  padding: var(--spacing-lg) !important;
  background: var(--surface-white) !important;
  border: 2px solid var(--border-light) !important;
  border-radius: var(--radius-lg) !important;
  position: relative !important;
  overflow: hidden !important;
  min-height: 70px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  transition: all var(--transition-smooth) !important;
}

.persona-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.persona-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-lg) !important;
  border-color: var(--primary-color) !important;
}

.persona-card:hover::before {
  width: 4px;
}

.persona-icon {
  width: 48px !important;
  height: 48px !important;
  background: var(--accent-primary) !important;
  border: 1px solid var(--border-medium) !important;
  border-radius: var(--radius-lg) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all var(--transition-smooth) !important;
  color: var(--primary-color) !important;
}

.persona-info {
  flex: 1 !important;
  position: relative !important;
  z-index: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  gap: 4px !important;
}

.persona-info h4 {
  font-size: var(--font-size-lg) !important;
  font-weight: 600 !important;
  color: var(--text-primary) !important;
  margin: 0 !important;
  line-height: 1.2 !important;
}

.persona-info p {
  font-size: var(--font-size-base) !important;
  color: var(--text-secondary) !important;
  margin: 0 !important;
  line-height: 1.4 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.arrow-icon {
  position: relative !important;
  z-index: 1 !important;
  transition: all var(--transition-smooth) !important;
  color: var(--text-muted) !important;
}

.chat-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(203, 209, 218, 0.1);
  padding: var(--spacing-sm) var(--spacing-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  flex-shrink: 0;
}

.easter-eggs {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.easter-egg-btn {
  width: 2px;
  height: 2px;
  background: rgba(203, 209, 218, 0.2);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  opacity: 0.2;
}

.easter-egg-btn:hover {
  background: rgba(203, 209, 218, 0.4);
  transform: scale(2);
  opacity: 0.5;
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

@media (max-width: 640px) {
  .aiops-chat {
    bottom: 16px;
    right: 16px;
  }
  
  .aiops-chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
    max-width: none;
    max-height: none;
  }
  
  .category-select,
  .persona-list-tab {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .welcome-section {
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-md) 0;
  }
  
  .category-card,
  .persona-card {
    padding: var(--spacing-md) !important;
    gap: var(--spacing-md) !important;
    min-height: 60px !important;
  }
  
  .category-icon,
  .persona-icon {
    width: 40px !important;
    height: 40px !important;
  }
  
  .category-info h4,
  .persona-info h4 {
    font-size: var(--font-size-base) !important;
  }
  
  .category-info p,
  .persona-info p {
    font-size: var(--font-size-sm) !important;
  }
}
</style>