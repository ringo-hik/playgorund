<template>
  <div class="float-chat">
    <div class="float-chat-button" 
         :class="{ 'is-active': isOpen }" 
         @click="toggleChat">
      <i v-if="!isOpen" class="uil uil-comment" style="color: #FFFFFF; font-size: 24px;"></i>
      <i v-else class="uil uil-times" style="color: #FFFFFF; font-size: 22px;"></i>
    </div>

    <div v-if="isOpen" 
         class="float-chat-window" 
         :class="{ 
           'minimized': windowState === 'minimized',
           'maximized': windowState === 'maximized'
         }"
         ref="chatWindow">
      <div class="header">
        <div class="bot-info">
          <div class="avatar">
            <i class="uil uil-comment" style="color: #FFFFFF; font-size: 20px;"></i>
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
          <button @click="toggleLanguage" class="action-btn">
            <span>{{ currentLanguage === 'ko' ? 'EN' : 'KR' }}</span>
          </button>
          
          <div class="window-controls">
            <button @click="minimizeWindow" class="window-control-btn minimize" title="최소화">
              <div class="window-control-icon minimize"></div>
            </button>
            <button @click="toggleMaximizeWindow" class="window-control-btn maximize" title="최대화/복원">
              <div class="window-control-icon" :class="windowState === 'maximized' ? 'restore' : 'maximize'"></div>
            </button>
            <button @click="closeChat" class="window-control-btn close" title="닫기">
              <div class="window-control-icon close"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button @click="setActiveTab('chat')" :class="{ active: activeTab === 'chat' }" class="tab">
          <i class="uil uil-comment" :style="{ color: activeTab === 'chat' ? '#2C5AA0' : '#8E99AD', fontSize: '16px' }"></i>
          <span>{{ getText('chat') }}</span>
          <span v-if="chatProcessingCount > 0" class="indicator"></span>
        </button>
        <button @click="setActiveTab('feedback')" :class="{ active: activeTab === 'feedback' }" :disabled="chatProcessingCount > 0" class="tab">
          <i class="uil uil-thumbs-up" :style="{ color: activeTab === 'feedback' ? '#2C5AA0' : '#8E99AD', fontSize: '16px' }"></i>
          <span>{{ getText('feedback') }}</span>
        </button>
      </div>

      <div class="content">
        <ChatTab v-if="activeTab === 'chat'" 
                 ref="chatTab" 
                 :categories="categories" 
                 :loading-categories="loadingCategories" 
                 :is-processing="chatProcessingCount > 0" 
                 :current-language="currentLanguage" 
                 :window-size="windowSize"
                 @message-sent="handleMessageSent" 
                 @processing-state-changed="handleProcessingStateChanged" />
        <FeedbackTab v-if="activeTab === 'feedback'" 
                     ref="feedbackTab" 
                     :current-language="currentLanguage" 
                     @feedback-sent="handleFeedbackSent" />
      </div>
    </div>
  </div>
</template>

<script>
// Use window globals for http-vue-loader compatibility
const floatChatService = window.floatChatService;

module.exports = {
  name: 'FloatChatLayout',
  components: { 
    ChatTab: httpVueLoader('./ChatTab.vue'),
    FeedbackTab: httpVueLoader('./FeedbackTab.vue')
  },
  data() {
    return {
      isOpen: false,
      activeTab: 'chat',
      categories: [],
      loadingCategories: false,
      isConnected: true,
      currentLanguage: this.getInitialLanguage(),
      categorySessionMap: {},
      
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
    texts() {
      return {
        ko: {
          online: '온라인', offline: '오프라인', chat: '채팅', 
          feedback: '피드백', aiError: '응답 생성 중 오류가 발생했어요.', 
          networkError: '일시적인 오류가 발생했어요. 다시 시도해주세요.'
        },
        en: {
          online: 'Online', offline: 'Offline', chat: 'Chat', 
          feedback: 'Feedback', aiError: 'An error occurred while generating the response.', 
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
    
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.initializeChatData();
        this.windowState = 'normal';
      }
    },
    
    closeChat() {
      this.isOpen = false;
      this.activeTab = 'chat';
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
    
    setActiveTab(tab) {
      if (this.chatProcessingCount > 0 && tab !== 'chat') return;
      this.activeTab = tab;
    },
    
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
      try {
        localStorage.setItem('float-chat-lang', this.currentLanguage);
      } catch (error) {
        
      }
    },
    
    initializeChatData() {
      if (this.categories.length === 0) this.loadCategories();
    },
    
    loadCategories() {
      if (this.loadingCategories) return;
      this.loadingCategories = true;
      
      floatChatService.getCategories()
        .then(response => {
          if (response.success) {
            this.categories = response.data || [];
          }
        })
        .catch(error => {
          
        })
        .finally(() => {
          this.loadingCategories = false;
        });
    },
    
    handleMessageSent(data) {
      const requestId = Date.now() + Math.random();
      
      this.pendingRequests.set(requestId, {
        categoryCode: data.categoryCode,
        startTime: Date.now()
      });
      this.updateProcessingState();
      
      if (!data.sessionId && this.categorySessionMap[data.categoryCode]) {
        data.sessionId = this.categorySessionMap[data.categoryCode];
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
        this.categorySessionMap[data.categoryCode] = response.sessionId;
        try {
          localStorage.setItem('float-chat-sessions', JSON.stringify(this.categorySessionMap));
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
          this.categorySessionMap = JSON.parse(sessionData);
        }
      } catch (error) {
        this.categorySessionMap = {};
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