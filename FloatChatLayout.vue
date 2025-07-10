<template>
  <div class="float-chat">
    <div 
      class="float-chat-button" 
      :class="{ 'is-active': isOpen }" 
      @click="toggleChat"
    >
      <unicon 
        v-if="!isOpen" 
        name="comment" 
        fill="white" 
        :width="28" 
        :height="28"
      />
      <unicon 
        v-else 
        name="times" 
        fill="white" 
        :width="26" 
        :height="26"
      />
    </div>

    <div 
      v-show="isOpen && isInitialized" 
      class="float-chat-window" 
      :class="windowClasses"
      ref="chatWindow"
    >
      <div class="chat-header">
        <div class="bot-info">
          <div class="avatar">
            <unicon name="comment" fill="white" :width="20" :height="20" />
          </div>
          <div class="details">
            <span class="name">SWP Float Chat</span>
            <div class="status" :class="{ offline: !isConnected }">
              <span class="dot"></span>
              <span>{{ isConnected ? getText('online') : getText('offline') }}</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button @click="openRandomEasterEgg" class="easter-egg-trigger" title="✨">
            <span class="easter-dot"></span>
          </button>
          <ThemeManager :current-language="currentLanguage" />
          <button @click="toggleLanguage" class="action-btn">
            <span>{{ currentLanguage === 'ko' ? 'EN' : 'KR' }}</span>
          </button>
          
          <div class="window-controls">
            <button @click="minimizeWindow" class="window-control-btn" title="최소화">
              <div class="control-icon minimize"></div>
            </button>
            <button @click="toggleMaximizeWindow" class="window-control-btn" title="최대화/복원">
              <div class="control-icon" :class="windowState === 'maximized' ? 'restore' : 'maximize'"></div>
            </button>
            <button @click="closeChat" class="window-control-btn" title="닫기">
              <div class="control-icon close"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- 카테고리 선택 화면 -->
        <div v-if="currentView === 'categorySelect'" class="category-select">
          <!-- 웰컴 메시지 섹션 -->
          <div class="welcome-section">
            <div class="welcome-icon">
              <unicon name="heart" fill="#318CE7" :width="32" :height="32" />
            </div>
            <div class="welcome-content">
              <h3>{{ getText('welcomeTitle') }}</h3>
              <p>{{ getText('welcomeMessage') }}</p>
            </div>
          </div>
          
          <div class="category-grid">
            <CategoryCard
              category="personal"
              icon="user"
              :title="getText('personalCategory')"
              :description="getText('personalCategoryDesc')"
              :disabled="chatProcessingCount > 0"
              @select="selectCategory('personal')"
            />
            <CategoryCard
              category="user"
              icon="users-alt"
              :title="getText('userCategory')"
              :description="getText('userCategoryDesc')"
              :disabled="chatProcessingCount > 0"
              @select="selectCategory('user')"
            />
            <CategoryCard
              category="devops"
              icon="cog"
              :title="getText('devopsCategory')"
              :description="getText('devopsCategoryDesc')"
              :disabled="chatProcessingCount > 0"
              @select="selectCategory('devops')"
            />
          </div>
          
          <div class="feedback-section">
            <LuxuryButton 
              @click="goToFeedback" 
              variant="luxury-cyan"
              icon="heart"
              :text="getText('sendFeedback')"
              :disabled="chatProcessingCount > 0"
            />
          </div>
        </div>

        <!-- 페르소나 리스트 화면 -->
        <div v-if="currentView === 'personaList'" class="persona-list-tab">
          <div class="persona-header">
            <button @click="goToCategorySelect" class="back-btn">
              <unicon name="arrow-left" fill="#318CE7" :width="16" :height="16" />
              <span>{{ getText('back') }}</span>
            </button>
            
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
              <LoadingSpinner 
                size="large" 
                variant="luxury" 
                :text="getText('loadingPersonas')"
              />
            </div>

            <div v-else-if="filteredPersonas.length === 0" class="no-personas">
              <unicon name="info-circle" fill="#6B7280" :width="48" :height="48" />
              <h4>{{ getText('noPersonas') }}</h4>
              <p>{{ getText('noPersonasDesc') }}</p>
              <LuxuryButton 
                @click="goToCategorySelect" 
                variant="luxury-cyan"
                icon="home"
                :text="getText('goHome')"
              />
            </div>

            <div v-else class="persona-grid">
              <PersonaCard
                v-for="persona in filteredPersonas" 
                :key="persona.personaCode"
                :icon="getPersonaIconName(persona)"
                :title="persona.title || persona.personaCode"
                :description="getPersonaDescription(persona)"
                :disabled="loadingPersonas"
                @select="selectPersona(persona)"
              />
            </div>
          </div>
        </div>

        <!-- 채팅 화면 -->
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
        
        <!-- 피드백 화면 -->
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
            @click="triggerEasterEgg(1)" 
            class="easter-egg-btn"
            title=""
          ></button>
          <button 
            @click="triggerEasterEgg(2)" 
            class="easter-egg-btn"
            title=""
          ></button>
          <button 
            @click="triggerEasterEgg(3)" 
            class="easter-egg-btn"
            title=""
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@style/dwp/custom/customMarkdown.css';
import '@style/dwp/custom/FloatChat.css';
import floatChatService from '@service/floatChatService';
import ChatTab from './ChatTab.vue';
import FeedbackTab from './FeedbackTab.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import LuxuryButton from './components/LuxuryButton.vue';
import CategoryCard from './CategoryCard.vue';
import PersonaCard from './PersonaCard.vue';
import ThemeManager from './ThemeManager.vue';

export default {
  name: 'FloatChatLayout',
  components: { ChatTab, FeedbackTab, LoadingSpinner, LuxuryButton, CategoryCard, PersonaCard, ThemeManager },
  
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
      
      personaSessionMap: {},
      windowState: 'normal',
      windowSize: {
        width: 455,
        height: 676
      },
      chatProcessingCount: 0,
      pendingRequests: new Map(),
      healthCheckInterval: null
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
    },
    
    texts() {
      return {
        ko: {
          online: '온라인', 
          offline: '오프라인',
          welcomeTitle: '안녕하세요. 학습형 SWP Float Chat 입니다.',
          welcomeMessage: '다양한 서비스를 이용해보세요. 많이 사용하고, 피드백 주실 수록 향상된 결과를 얻을 수 있습니다.',
          personalCategory: '개인 특화',
          personalCategoryDesc: '개인 맞춤형 AI 어시스턴트',
          userCategory: '일반 문의',
          userCategoryDesc: '사용자 지원 및 문의 응답',
          devopsCategory: '운영/관리',
          devopsCategoryDesc: '시스템 운영 및 관리 지원',
          sendFeedback: '피드백 보내기',
          back: '뒤로',
          selectPersonaDesc: 'Persona(전문가)를 선택해주세요',
          loadingPersonas: 'Persona 목록 불러오는 중...',
          noPersonas: '사용 가능한 Persona가 없습니다',
          noPersonasDesc: '이 카테고리에는 아직 Persona가 없습니다',
          goHome: '홈으로 가기',
          defaultPersonaDesc: '전문적인 도움을 제공합니다',
          aiError: '응답 생성 중 오류가 발생했어요.', 
          networkError: '일시적인 오류가 발생했어요. 다시 시도해주세요.'
        },
        en: {
          online: 'Online', 
          offline: 'Offline',
          welcomeTitle: 'Hello. Welcome to Learning SWP Float Chat.',
          welcomeMessage: 'Try various services. The more you use and provide feedback, the better results you can get.',
          personalCategory: 'Personal',
          personalCategoryDesc: 'Personalized AI assistant',
          userCategory: 'General Support',
          userCategoryDesc: 'User support and inquiry response',
          devopsCategory: 'Operations',
          devopsCategoryDesc: 'System operation and management support',
          sendFeedback: 'Send Feedback',
          back: 'Back',
          selectPersonaDesc: 'Choose your Persona (Expert)',
          loadingPersonas: 'Loading persona list...',
          noPersonas: 'No personas available',
          noPersonasDesc: 'There are no personas in this category yet',
          goHome: 'Go Home',
          defaultPersonaDesc: 'Provides professional assistance',
          aiError: 'An error occurred while generating the response.', 
          networkError: 'A temporary error occurred. Please try again.'
        }
      }[this.currentLanguage];
    }
  },
  
  methods: {
    getText(key) { 
      return this.texts[key] || key; 
    },
    
    getInitialLanguage() {
      try {
        return localStorage.getItem('float-chat-lang') || 'ko';
      } catch (error) {
        return 'ko';
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
        ko: {
          'personal': '개인 특화',
          'user': '일반 문의',
          'devops': '운영/관리'
        },
        en: {
          'personal': 'Personal',
          'user': 'General Support', 
          'devops': 'Operations'
        }
      };
      
      return displayNames[this.currentLanguage][category] || category;
    },
    
    getPersonaIconName(persona) {
      return floatChatService.getPersonaIcon(persona.personaCode, persona.iconPath);
    },
    
    getPersonaDescription(persona) {
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
        localStorage.setItem('float-chat-lang', this.currentLanguage);
      } catch (error) {
      }
    },
    
    triggerEasterEgg(number) {
      alert(`이스터애그${number}!`);
    },
    
    openRandomEasterEgg() {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      const easterEggUrl = `/playground/easter-egg${randomNumber}.html`;
      window.open(easterEggUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    },
    
    
    
    
    
    loadPersonas() {
      if (this.loadingPersonas) return Promise.resolve();
      
      this.loadingPersonas = true;
      
      return floatChatService.getPersonas()
        .then(response => {
          if (response.success) {
            this.personas = response.data || [];
          }
        })
        .catch(error => {
          console.error('Personas loading failed:', error);
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
        const sessionInfo = this.personaSessionMap[data.personaCode];
        data.sessionId = typeof sessionInfo === 'object' ? sessionInfo.sessionId : sessionInfo;
      }
      
      floatChatService.sendMessage(data, true)
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
        this.personaSessionMap[data.personaCode] = {
          sessionId: response.sessionId,
          timestamp: Date.now()
        };
        try {
          localStorage.setItem('float-chat-sessions', JSON.stringify(this.personaSessionMap));
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
      floatChatService.sendFeedback(feedbackData)
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
        const sessionData = localStorage.getItem('float-chat-sessions');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          const now = Date.now();
          const sessionExpiry = 24 * 60 * 60 * 1000; // 24시간
          
          // 만료된 세션 필터링
          const validSessions = {};
          Object.keys(parsedData).forEach(personaCode => {
            const sessionInfo = parsedData[personaCode];
            if (sessionInfo && typeof sessionInfo === 'object') {
              if (sessionInfo.timestamp && (now - sessionInfo.timestamp < sessionExpiry)) {
                validSessions[personaCode] = sessionInfo;
              }
            } else if (typeof sessionInfo === 'string') {
              // 기존 형식 호환성을 위해 24시간 후 만료로 간주
              validSessions[personaCode] = {
                sessionId: sessionInfo,
                timestamp: now
              };
            }
          });
          
          this.personaSessionMap = validSessions;
          
          // 정리된 세션 데이터 저장
          if (Object.keys(validSessions).length !== Object.keys(parsedData).length) {
            localStorage.setItem('float-chat-sessions', JSON.stringify(validSessions));
          }
        }
      } catch (error) {
        this.personaSessionMap = {};
        localStorage.removeItem('float-chat-sessions');
      }
    },
    
    startHealthCheck() {
      this.healthCheckInterval = setInterval(() => {
        floatChatService.healthCheck()
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
  },
  
  beforeDestroy() {
    this.stopHealthCheck();
    this.cancelAllPendingRequests();
  }
};
</script>

<style scoped>
:root {
  transition: all 0.5s ease;
}

* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.float-chat {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: var(--font-family);
}

.float-chat-button {
  width: var(--float-size);
  height: var(--float-size);
  background: var(--primary-blue);
  border: 2px solid var(--surface-white);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-smooth);
  position: relative;
  overflow: hidden;
}

.float-chat-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: opacity var(--transition-smooth);
}

.float-chat-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: var(--shadow-lg), 0 16px 32px rgba(49, 140, 231, 0.4);
  border-color: var(--primary-gold);
}

.float-chat-button:hover::before {
  opacity: 1;
}

.float-chat-button.is-active {
  transform: scale(0.95);
  background: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.float-chat-window {
  position: absolute;
  right: 0;
  bottom: calc(var(--float-size) + 16px);
  width: var(--chat-width);
  height: var(--chat-height);
  background: var(--surface-white);
  backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid var(--primary-gray);
  border-radius: 15px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: float-window-enter 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.float-chat-window.minimized {
  height: var(--header-height);
}

.float-chat-window.maximized {
  width: min(810px, 85vw);
  height: min(750px, 90vh);
  bottom: calc(var(--float-size) + 24px);
  right: 24px;
}

.chat-header {
  background: var(--primary-navy);
  padding: 16px 20px;
  border-bottom: 1px solid var(--primary-gray);
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
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--primary-gold) 50%, transparent 100%);
  opacity: 0.6;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--primary-gold);
  border: 2px solid var(--primary-gray);
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
  font-size: 15px;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 2px;
  letter-spacing: -0.01em;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-light);
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

.easter-egg-trigger {
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;
}

.easter-egg-trigger:hover {
  transform: scale(1.2);
}

.easter-dot {
  width: 6px;
  height: 6px;
  background: #8B5CF6;
  border-radius: 50%;
  position: relative;
  animation: sparkle 2s infinite;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

.easter-dot::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-glow 2s infinite alternate;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.8);
  }
}

@keyframes pulse-glow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

.theme-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--primary-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--primary-gold);
  transform: translateY(-1px) scale(1.05);
  box-shadow: var(--shadow-sm);
}

.theme-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.theme-indicator.default {
  background: linear-gradient(45deg, #4A90E2 0%, #D4B896 50%, #2C3E50 100%);
}

.theme-indicator.gucci {
  background: linear-gradient(45deg, #2E8B57 0%, #E6D7C3 50%, #9B1C31 100%);
}

.theme-indicator.hermes {
  background: linear-gradient(45deg, #D2691E 0%, #F0E5D0 50%, #8B4513 100%);
}

.theme-indicator.harry-winston {
  background: linear-gradient(45deg, #1E3A8A 0%, #E5E7EB 50%, #0F172A 100%);
}

.theme-indicator.bugatti {
  background: linear-gradient(45deg, #2563EB 0%, #FED7AA 50%, #1E293B 100%);
}

.theme-indicator::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.3;
  filter: blur(2px);
  z-index: -1;
}

.action-btn,
.window-control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--primary-gray);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  position: relative;
  overflow: hidden;
}

.action-btn:hover,
.window-control-btn:hover {
  background: rgba(200, 162, 87, 0.2);
  border-color: var(--primary-gold);
  color: var(--primary-gold);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.window-controls {
  display: flex;
  gap: 4px;
}

.control-icon {
  width: 12px;
  height: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-icon.minimize::after {
  content: '';
  width: 10px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.control-icon.maximize {
  width: 10px;
  height: 10px;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.control-icon.restore::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  border-radius: 1px;
}

.control-icon.restore::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  background: var(--primary-navy);
  border-radius: 1px;
}

.control-icon.close::before,
.control-icon.close::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.control-icon.close::before {
  transform: rotate(45deg);
}

.control-icon.close::after {
  transform: rotate(-45deg);
}

.content {
  flex: 1;
  overflow: hidden;
}



/* 페르소나 카드 스타일이 FloatChat.css로 이동됨 */



.chat-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(203, 209, 218, 0.1);
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  flex-shrink: 0;
}

.easter-eggs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.easter-egg-btn {
  width: 4px;
  height: 4px;
  background: rgba(203, 209, 218, 0.3);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.3;
}

.easter-egg-btn:hover {
  background: rgba(203, 209, 218, 0.6);
  transform: scale(1.5);
  opacity: 0.7;
}

@media (max-width: 640px) {
  .float-chat {
    bottom: 16px;
    right: 16px;
  }
  
  .float-chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
    max-width: none;
    max-height: none;
  }
  
  .category-select,
  .persona-list-tab {
    padding: 16px 12px;
  }
  
  .welcome-section {
    margin-bottom: 16px;
    padding: 10px 0;
  }
  
  .welcome-content h3 {
    font-size: 15px;
  }
  
  .welcome-content p {
    font-size: 12px;
  }
  
  .category-card,
  .persona-card {
    padding: 14px 16px; /* 모바일에서도 상하 패딩 조정 */
    gap: 12px;
  }
  
  .category-icon,
  .persona-icon {
    width: 40px;
    height: 40px;
  }
  
  .category-card h4,
  .persona-info h4 {
    font-size: 15px;
  }
  
  .category-card p,
  .persona-info p {
    font-size: 12px;
  }
  
  .theme-btn {
    width: 20px;
    height: 20px;
  }
  
  .theme-indicator {
    width: 10px;
    height: 10px;
  }
}
</style>