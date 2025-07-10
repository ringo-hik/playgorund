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
          <button @click="changeColorTheme" class="theme-btn" :title="getCurrentThemeName()">
            <span class="theme-indicator" :class="currentTheme"></span>
          </button>
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
            <button 
              @click="selectCategory('personal')" 
              class="category-card personal"
              :disabled="chatProcessingCount > 0"
            >
              <div class="category-icon personal">
                <unicon name="user" fill="white" :width="24" :height="24" />
              </div>
              <h4>{{ getText('personalCategory') }}</h4>
              <p>{{ getText('personalCategoryDesc') }}</p>
            </button>
            
            <button 
              @click="selectCategory('user')" 
              class="category-card user"
              :disabled="chatProcessingCount > 0"
            >
              <div class="category-icon user">
                <unicon name="users-alt" fill="white" :width="24" :height="24" />
              </div>
              <h4>{{ getText('userCategory') }}</h4>
              <p>{{ getText('userCategoryDesc') }}</p>
            </button>
            
            <button 
              @click="selectCategory('devops')" 
              class="category-card devops"
              :disabled="chatProcessingCount > 0"
            >
              <div class="category-icon devops">
                <unicon name="cog" fill="white" :width="24" :height="24" />
              </div>
              <h4>{{ getText('devopsCategory') }}</h4>
              <p>{{ getText('devopsCategoryDesc') }}</p>
            </button>
          </div>
          
          <div class="feedback-section">
            <button 
              @click="goToFeedback" 
              class="feedback-btn"
              :disabled="chatProcessingCount > 0"
            >
              <unicon name="heart" fill="white" :width="16" :height="16" />
              <span>{{ getText('sendFeedback') }}</span>
            </button>
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
              <div class="spinner"></div>
              <span>{{ getText('loadingPersonas') }}</span>
            </div>

            <div v-else-if="filteredPersonas.length === 0" class="no-personas">
              <unicon name="info-circle" fill="#6B7280" :width="48" :height="48" />
              <h4>{{ getText('noPersonas') }}</h4>
              <p>{{ getText('noPersonasDesc') }}</p>
              <button @click="goToCategorySelect" class="btn-luxury-cyan">
                <unicon name="home" fill="white" :width="16" :height="16" />
                <span>{{ getText('goHome') }}</span>
              </button>
            </div>

            <div v-else class="persona-grid">
              <button 
                v-for="persona in filteredPersonas" 
                :key="persona.personaCode"
                @click="selectPersona(persona)"
                class="persona-card"
                :disabled="loadingPersonas"
              >
                <div class="persona-icon">
                  <unicon 
                    :name="getPersonaIconName(persona)" 
                    fill="var(--primary-gold)" 
                    :width="24" 
                    :height="24"
                  />
                </div>
                
                <div class="persona-info">
                  <h4>{{ persona.title || persona.personaCode }}</h4>
                  <p>{{ getPersonaDescription(persona) }}</p>
                </div>
                
                <div class="arrow-icon">
                  <unicon name="angle-right" fill="#CBD1DA" :width="16" :height="16" />
                </div>
              </button>
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

export default {
  name: 'FloatChatLayout',
  components: { ChatTab, FeedbackTab },
  
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
    
    getInitialTheme() {
      try {
        return localStorage.getItem('float-chat-theme') || 'default';
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
    
    changeColorTheme() {
      const themes = ['default', 'gucci', 'hermes'];
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      this.currentTheme = themes[nextIndex];
      
      this.applyTheme(this.currentTheme);
      
      try {
        localStorage.setItem('float-chat-theme', this.currentTheme);
      } catch (error) {
      }
    },
    
    getCurrentThemeName() {
      const themeNames = {
        ko: {
          'default': '기본 테마',
          'gucci': '구찌 테마',
          'hermes': '에르메스 테마'
        },
        en: {
          'default': 'Default Theme',
          'gucci': 'Gucci Theme', 
          'hermes': 'Hermès Theme'
        }
      };
      
      return themeNames[this.currentLanguage][this.currentTheme] || '테마 변경';
    },
    
    applyTheme(themeName) {
      const root = document.documentElement;
      
      // 기존 테마 클래스 제거
      root.classList.remove('theme-default', 'theme-gucci', 'theme-hermes');
      
      // 새 테마 클래스 추가
      root.classList.add(`theme-${themeName}`);
      
      const themeColors = {
        default: {
          // 기본 레이아웃 변수
          '--float-size': '60px',
          '--chat-width': '455px', 
          '--chat-height': '676px',
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px',
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 색상 변수
          '--primary-blue': '#318CE7',
          '--primary-navy': '#0C2340',
          '--primary-gold': '#C8A257',
          '--primary-gray': '#CBD1DA',
          '--surface-white': '#FFFFFF',
          '--surface-light': '#F8FAFC',
          '--bg-light': '#F1F5F9',
          '--bg-medium': '#E2E8F0',
          '--text-primary': '#0F172A',
          '--text-secondary': '#334155',
          '--text-muted': '#64748B',
          '--text-light': '#FFFFFF',
          '--border-light': '#E2E8F0',
          '--border-gray': '#CBD5E1',
          '--luxury-emerald': '#00A86B',
          '--luxury-emerald-dark': '#008A5A',
          '--luxury-burgundy': '#800020',
          '--luxury-burgundy-dark': '#6B001B',
          '--luxury-sapphire': '#0F52BA',
          '--luxury-sapphire-dark': '#0A4399',
          '--luxury-cyan': '#00B4D8',
          '--luxury-cyan-dark': '#0096B8',
          '--success-color': '#059669',
          '--error-color': '#DC2626',
          '--delete-color': '#EF4444',
          '--delete-hover': '#DC2626'
        },
        gucci: {
          // 기본 레이아웃 변수 (동일)
          '--float-size': '60px',
          '--chat-width': '455px',
          '--chat-height': '676px', 
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px',
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(13, 91, 60, 0.15), 0 10px 10px -5px rgba(13, 91, 60, 0.08)',
          '--shadow-md': '0 4px 6px -1px rgba(13, 91, 60, 0.12), 0 2px 4px -1px rgba(13, 91, 60, 0.08)',
          '--shadow-sm': '0 1px 2px 0 rgba(13, 91, 60, 0.06)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 구찌 색상 변수
          '--primary-blue': '#0D5B3C',
          '--primary-navy': '#0A3D29',
          '--primary-gold': '#F4E4BC',
          '--primary-gray': '#E8F2E8',
          '--surface-white': '#FEFEFE',
          '--surface-light': '#F9FDF9',
          '--bg-light': '#F0F8F0',
          '--bg-medium': '#E1F0E1',
          '--text-primary': '#1A3A1A',
          '--text-secondary': '#2D5A2D',
          '--text-muted': '#5A7A5A',
          '--text-light': '#FFFFFF',
          '--border-light': '#D1E7D1',
          '--border-gray': '#B8D8B8',
          '--luxury-emerald': '#0D5B3C',
          '--luxury-emerald-dark': '#0A3D29',
          '--luxury-burgundy': '#8B0000',
          '--luxury-burgundy-dark': '#6B0000',
          '--luxury-sapphire': '#228B22',
          '--luxury-sapphire-dark': '#1C6B1C',
          '--luxury-cyan': '#2E8B57',
          '--luxury-cyan-dark': '#256B47',
          '--success-color': '#0D5B3C',
          '--error-color': '#8B0000',
          '--delete-color': '#CD5C5C',
          '--delete-hover': '#B22222'
        },
        hermes: {
          // 기본 레이아웃 변수 (동일)
          '--float-size': '60px',
          '--chat-width': '455px',
          '--chat-height': '676px',
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px', 
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(243, 112, 33, 0.15), 0 10px 10px -5px rgba(243, 112, 33, 0.08)',
          '--shadow-md': '0 4px 6px -1px rgba(243, 112, 33, 0.12), 0 2px 4px -1px rgba(243, 112, 33, 0.08)',
          '--shadow-sm': '0 1px 2px 0 rgba(243, 112, 33, 0.06)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 에르메스 색상 변수
          '--primary-blue': '#F37021',
          '--primary-navy': '#8B4513',
          '--primary-gold': '#F5F5DC',
          '--primary-gray': '#FAF0E6',
          '--surface-white': '#FFFEF7',
          '--surface-light': '#FDF8F0',
          '--bg-light': '#FBF5E8',
          '--bg-medium': '#F5EBDC',
          '--text-primary': '#5D4037',
          '--text-secondary': '#795548',
          '--text-muted': '#8D6E63',
          '--text-light': '#FFFFFF',
          '--border-light': '#E6D7C8',
          '--border-gray': '#D7C4B0',
          '--luxury-emerald': '#A0522D',
          '--luxury-emerald-dark': '#8B4513',
          '--luxury-burgundy': '#CD853F',
          '--luxury-burgundy-dark': '#B8751F',
          '--luxury-sapphire': '#D2691E',
          '--luxury-sapphire-dark': '#B8541A',
          '--luxury-cyan': '#F37021',
          '--luxury-cyan-dark': '#E55A00',
          '--success-color': '#A0522D',
          '--error-color': '#CD5C5C',
          '--delete-color': '#DC7633',
          '--delete-hover': '#CA6F1E'
        }
      };
      
      const colors = themeColors[themeName] || themeColors.default;
      
      // CSS 변수 적용
      Object.keys(colors).forEach(property => {
        root.style.setProperty(property, colors[property]);
      });
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
        data.sessionId = this.personaSessionMap[data.personaCode];
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
        this.personaSessionMap[data.personaCode] = response.sessionId;
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
          this.personaSessionMap = JSON.parse(sessionData);
        }
      } catch (error) {
        this.personaSessionMap = {};
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
    this.applyTheme(this.currentTheme);
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
  background: linear-gradient(45deg, #318CE7 0%, #C8A257 50%, #0C2340 100%);
}

.theme-indicator.gucci {
  background: linear-gradient(45deg, #0D5B3C 0%, #F4E4BC 50%, #8B0000 100%);
}

.theme-indicator.hermes {
  background: linear-gradient(45deg, #F37021 0%, #F5F5DC 50%, #8B4513 100%);
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

/* 카테고리 선택 스타일 */
.category-select {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--bg-light);
}

/* 웰컴 메시지 섹션 */
.welcome-section {
  text-align: center;
  margin-bottom: 18px;
  padding: 12px 0;
}

.welcome-icon {
  margin-bottom: 12px;
}

.welcome-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.welcome-content p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  padding: 0 8px;
}

.category-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 13px; /* 기존 14px에서 13px로 조정 */
}

.category-card {
  width: 100%;
  background: var(--surface-white);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 20px; /* 상하 패딩을 20px에서 16px로 줄임 */
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all var(--transition-smooth);
  text-align: left;
  box-shadow: var(--shadow-sm);
}

.category-card:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.category-card.personal {
  border-color: var(--luxury-emerald);
}

.category-card.personal:hover:not(:disabled) {
  border-color: var(--luxury-emerald-dark);
  background: rgba(0, 168, 107, 0.02);
}

.category-card.user {
  border-color: var(--luxury-sapphire);
}

.category-card.user:hover:not(:disabled) {
  border-color: var(--luxury-sapphire-dark);
  background: rgba(15, 82, 186, 0.02);
}

.category-card.devops {
  border-color: var(--luxury-burgundy);
}

.category-card.devops:hover:not(:disabled) {
  border-color: var(--luxury-burgundy-dark);
  background: rgba(128, 0, 32, 0.02);
}

.category-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.category-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  border-radius: 12px;
}

.category-icon.personal {
  background: var(--luxury-emerald);
}

.category-icon.user {
  background: var(--luxury-sapphire);
}

.category-icon.devops {
  background: var(--luxury-burgundy);
}

.category-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.category-card p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.feedback-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
  text-align: center;
}

.feedback-btn {
  background: var(--luxury-cyan);
  color: white;
  border: 1px solid var(--luxury-cyan);
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-smooth);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
}

.feedback-btn:hover:not(:disabled) {
  background: var(--luxury-cyan-dark);
  border-color: var(--luxury-cyan-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.feedback-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 페르소나 리스트 스타일 */
.persona-list-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-light);
}

.persona-header {
  padding: 16px 20px;
  background: var(--bg-light);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-blue);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  padding: 6px 0;
}

.back-btn:hover {
  color: var(--primary-navy);
  transform: translateX(-2px);
}

.header-content {
  text-align: center;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
  box-shadow: var(--shadow-sm);
}

.category-badge.personal {
  background: var(--luxury-emerald);
}

.category-badge.user {
  background: var(--luxury-sapphire);
}

.category-badge.devops {
  background: var(--luxury-burgundy);
}

.header-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.persona-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  min-height: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.loading-container .spinner {
  width: 32px;
  height: 32px;
  margin-bottom: 0;
}

.no-personas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  text-align: center;
  gap: 16px;
}

.no-personas h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.no-personas p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.persona-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.persona-card {
  width: 100%;
  background: var(--surface-white);
  border: 2px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all var(--transition-smooth);
  text-align: left;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.persona-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: var(--primary-blue);
  transition: width 0.3s ease;
}

.persona-card:hover:not(:disabled) {
  border-color: var(--primary-gold);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.persona-card:hover:not(:disabled)::before {
  width: 4px;
}

.persona-card:hover:not(:disabled) .arrow-icon unicon {
  fill: var(--primary-blue) !important;
  transform: translateX(2px);
}

.persona-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.persona-icon {
  width: 48px;
  height: 48px;
  background: rgba(200, 162, 87, 0.1);
  border: 1px solid rgba(200, 162, 87, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all var(--transition-smooth);
}

.persona-card:hover:not(:disabled) .persona-icon {
  background: rgba(200, 162, 87, 0.2);
  border-color: var(--primary-gold);
  transform: scale(1.05);
}

.persona-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.persona-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.persona-info p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.arrow-icon {
  position: relative;
  z-index: 1;
  transition: all var(--transition-smooth);
}

.arrow-icon unicon {
  transition: all var(--transition-smooth);
}

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