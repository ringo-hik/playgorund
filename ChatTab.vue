<template>
  <div class="chat-tab">
    <div v-if="!selectedCategory" class="category-select">
      <h3>{{ getText('selectCategory') }}</h3>
      <div v-if="loadingCategories" class="loading">
        <div class="spinner"></div>
        <p>{{ getText('loadingCategories') }}</p>
      </div>
      <div v-else class="categories">
        <div v-for="category in categories" :key="category.categoryId" 
             @click="selectCategory(category)" class="category">
          <i :class="'uil uil-' + getCategoryIconName(category)" style="color: #2C5AA0; font-size: 24px;"></i>
          <div class="info">
            <div class="name">{{ currentLanguage === 'ko' ? category.description : category.descriptionEn }}</div>
            <div class="desc">{{ currentLanguage === 'ko' ? category.description : category.descriptionEn }}</div>
          </div>
          <i class="uil uil-angle-right" style="color: #9AA0A6; font-size: 16px;"></i>
        </div>
      </div>
    </div>

    <div v-else class="chat-area">
      <div class="chat-header">
        <div class="category-info">
          <div class="badge">
            <i :class="'uil uil-' + getCategoryIconName(selectedCategory)" style="color: #2C5AA0; font-size: 14px;"></i>
            {{ currentLanguage === 'ko' ? selectedCategory.description : selectedCategory.descriptionEn }}
          </div>
        </div>
        <div class="controls">
          <button @click="resetCategory" :disabled="isProcessing" class="btn-text">
            <i class="uil uil-redo" style="color: #9AA0A6; font-size: 12px;"></i>
            {{ getText('change') }}
          </button>
        </div>
      </div>

      <div class="messages" ref="messagesContainer" @scroll="handleScroll">
        <div v-if="messages.length === 0 && !isProcessing && !loadingHistory" class="welcome">
          <i class="uil uil-sparkles" style="color: #2C5AA0; font-size: 36px;"></i>
          <h4>{{ getText('welcomeTitle').replace('{category}', currentLanguage === 'ko' ? selectedCategory.description : selectedCategory.descriptionEn) }}</h4>
        </div>

        <div v-if="loadingHistory" class="loading-history">
          <div class="spinner"></div>
          <span>{{ getText('loadingHistory') }}</span>
        </div>

        <div v-for="(message, index) in messages" 
             :key="message.id"
             :class="['message', message.type]"
             ref="messageElements">
          <div class="bubble" :class="{ 'loading': message.isLoading }">
            <template v-if="message.isLoading">
              <div class="dots"><span></span><span></span><span></span></div>
              <div class="text">{{ currentLoadingMessage }}</div>
            </template>
            
            <template v-else>
              <div class="content" v-html="formatMessageContent(message.content)"></div>
              
              <button v-if="message.type === 'ai'" 
                      @click="copyMessage(message)" 
                      class="copy">
                <i class="uil uil-copy" style="color: #9AA0A6; font-size: 12px;"></i>
              </button>

              <button v-if="message.type === 'ai' && !message.isError" 
                      @click="showImprovePrompt(message)" 
                      class="improve">
                <i class="uil uil-setting" style="color: #9AA0A6; font-size: 12px;"></i>
              </button>
            </template>
          </div>

          <div v-if="message.showImproveInput" class="engineeringPrompt-input-container">
            <div class="engineering-prompt-input-box">
              <textarea 
                v-model="improvePromptText"
                class="engineering-prompt-textarea"
                :placeholder="getText('improvePlaceholder')"
                maxlength="1000"
                @keydown.enter.ctrl="submitImprovePrompt"
                ref="improveTextarea"></textarea>
              <div class="engineering-prompt-actions">
                <button @click="cancelImprovePrompt" class="engineering-prompt-cancel">
                  {{ getText('cancel') }}
                </button>
                <button @click="submitImprovePrompt" 
                        :disabled="!improvePromptText.trim() || isSubmittingImprove" 
                        class="engineering-prompt-submit">
                  <div v-if="isSubmittingImprove" class="spinner"></div>
                  <template v-else>{{ getText('improve') }}</template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div v-if="quickQuestions.length > 0 && !isProcessing" class="quick-questions">
          <button v-for="q in quickQuestions" :key="q" @click="sendQuickQuestion(q)" class="quick-btn">
            <i class="uil uil-bolt" style="color: #2C5AA0; font-size: 12px;"></i>
            {{ q }}
          </button>
        </div>
        <div class="input-box">
          <textarea v-model="currentMessage" 
                    ref="messageInput" 
                    :placeholder="getText('inputPlaceholder')"
                    @keydown.enter.exact.prevent="sendMessage" 
                    @input="adjustTextareaHeight"
                    :disabled="isProcessing" 
                    maxlength="1000"></textarea>
          <button @click="sendMessage" :disabled="!canSendMessage" class="send">
            <div v-if="isProcessing" class="loading-spinner"></div>
            <i v-else class="uil uil-message" style="color: #FFFFFF; font-size: 18px;"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Use require for http-vue-loader compatibility
const floatChatService = window.floatChatService;
const llmContextService = window.llmContextService;

export default {
  name: 'ChatTab',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    loadingCategories: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      selectedCategory: null,
      currentMessage: '',
      messages: [],
      loadingHistory: false,
      currentLoadingMessage: '',
      loadingInterval: null,
      loadingMessageId: null,
      improvePromptText: '',
      isSubmittingImprove: false,
      currentImproveMessage: null
    };
  },
  computed: {
    texts() {
      return {
        ko: {
          selectCategory: '어떤 도움이 필요하신가요?',
          loadingCategories: '카테고리 로딩 중...',
          loadingHistory: '대화 기록 불러오는 중...',
          change: '변경',
          welcomeTitle: '{category} 전문가, SWP Float Chat입니다!',
          inputPlaceholder: '질문을 입력하세요...',
          improvePlaceholder: '어떤 부분이 개선되었으면 좋겠는지 알려주세요...',
          cancel: '취소',
          improve: '개선하기'
        },
        en: {
          selectCategory: 'How can I help you?',
          loadingCategories: 'Loading categories...',
          loadingHistory: 'Loading conversation history...',
          change: 'Change',
          welcomeTitle: 'I am SWP Float Chat, an expert in {category}!',
          inputPlaceholder: 'Enter your question...',
          improvePlaceholder: 'Let me know what you would like to improve...',
          cancel: 'Cancel',
          improve: 'Improve'
        }
      }[this.currentLanguage];
    },
    
    canSendMessage() {
      return this.currentMessage.trim().length > 0 && !this.isProcessing;
    },
    
    quickQuestions() {
      if (!this.selectedCategory) return [];
      return floatChatService.getQuickQuestions(this.selectedCategory.categoryCode, this.currentLanguage);
    }
  },
  methods: {
    getText(key) { 
      return this.texts[key] || key; 
    },
    
    getCategoryIconName(category) {
      if (!category) return 'comment';
      return floatChatService.getCategoryIcon(category.categoryCode, category.iconPath);
    },
    
    selectCategory(category) {
      this.selectedCategory = category;
      this.messages = [];
      this.loadingHistory = true;
      
      floatChatService.getConversations(category.categoryCode)
        .then(response => {
          if (response.success && response.data) {
            this.messages = floatChatService.convertConversationsToMessages(response.data);
          }
        })
        .catch(error => {
          
        })
        .finally(() => {
          this.loadingHistory = false;
          this.$nextTick(() => {
            this.scrollToBottom();
            this.$refs.messageInput?.focus();
          });
        });
    },
    
    resetCategory() {
      this.selectedCategory = null;
      this.messages = [];
      this.currentMessage = '';
      this.stopLoadingMessages();
      this.cancelImprovePrompt();
    },
    
    resetToInitialState() {
      this.selectedCategory = null;
      this.messages = [];
      this.currentMessage = '';
      this.stopLoadingMessages();
      this.cancelImprovePrompt();
    },
    
    sendMessage() {
      if (!this.canSendMessage) return;
      
      const messageContent = this.currentMessage.trim();
      const timestamp = Date.now();
      
      const userMessage = {
        id: `user-${timestamp}`,
        type: 'user', 
        content: messageContent,
        timestamp,
        isLoading: false
      };
      
      this.messages.push(userMessage);
      
      this.loadingMessageId = `ai-${timestamp}`;
      const loadingMessage = {
        id: this.loadingMessageId,
        type: 'ai',
        content: '',
        timestamp: timestamp + 1,
        isLoading: true
      };
      
      this.messages.push(loadingMessage);
      
      this.currentMessage = '';
      this.adjustTextareaHeight();
      this.scrollToBottom();
      this.startLoadingMessages();
      
      this.$emit('message-sent', {
        categoryCode: this.selectedCategory.categoryCode,
        userQuestion: messageContent
      });
    },
    
    sendQuickQuestion(question) {
      this.currentMessage = question;
      this.sendMessage();
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
      
      if (response.success) {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: response.aiResponse || response.message || '응답을 받았습니다.',
          timestamp: Date.now(),
          isLoading: false,
          conversationId: response.conversationId
        };
        
        this.messages.push(aiMessage);
      } else {
        const errorMessage = {
          id: `error-${Date.now()}`,
          type: 'ai',
          content: response.message || '응답 생성 중 오류가 발생했습니다.',
          timestamp: Date.now(),
          isLoading: false,
          isError: true
        };
        
        this.messages.push(errorMessage);
      }
      
      this.scrollToBottom();
    },
    
    formatMessageContent(content) {
      if (!content) return '';
      return floatChatService.convertMarkdownTableToHtml(content);
    },
    
    showImprovePrompt(message) {
      this.cancelImprovePrompt();
      this.currentImproveMessage = message;
      this.$set(message, 'showImproveInput', true);
      this.improvePromptText = '';
      
      this.$nextTick(() => {
        if (this.$refs.improveTextarea && this.$refs.improveTextarea[0]) {
          this.$refs.improveTextarea[0].focus();
        }
      });
    },
    
    cancelImprovePrompt() {
      if (this.currentImproveMessage) {
        this.$set(this.currentImproveMessage, 'showImproveInput', false);
        this.currentImproveMessage = null;
      }
      this.improvePromptText = '';
      this.isSubmittingImprove = false;
    },
    
    submitImprovePrompt() {
      if (!this.improvePromptText.trim() || this.isSubmittingImprove) return;
      
      this.isSubmittingImprove = true;
      
      const lastUserMessage = this.messages
        .slice()
        .reverse()
        .find(msg => msg.type === 'user');
      
      const feedbackData = {
        categoryCode: this.selectedCategory.categoryCode,
        feedbackContent: this.improvePromptText.trim(),
        originalQuestion: lastUserMessage ? lastUserMessage.content : '',
        originalAnswer: this.currentImproveMessage ? this.currentImproveMessage.content : ''
      };
      
      llmContextService.contextImproveFromFeedback(feedbackData)
        .then(response => {
          if (response.success) {
            const improveMessage = {
              id: `improve-${Date.now()}`,
              type: 'ai',
              content: response.data.message || '피드백을 반영하여 프롬프트가 개선되었습니다.',
              timestamp: Date.now(),
              isLoading: false,
              isImproveResult: true
            };
            
            this.messages.push(improveMessage);
            this.scrollToBottom();
          } else {
            const errorMessage = {
              id: `improve-error-${Date.now()}`,
              type: 'ai',
              content: response.errorMessage || '프롬프트 개선 중 오류가 발생했습니다.',
              timestamp: Date.now(),
              isLoading: false,
              isError: true
            };
            
            this.messages.push(errorMessage);
            this.scrollToBottom();
          }
        })
        .catch(error => {
          const errorMessage = {
            id: `improve-error-${Date.now()}`,
            type: 'ai',
            content: '프롬프트 개선 중 네트워크 오류가 발생했습니다.',
            timestamp: Date.now(),
            isLoading: false,
            isError: true
          };
          
          this.messages.push(errorMessage);
          this.scrollToBottom();
        })
        .finally(() => {
          this.isSubmittingImprove = false;
          this.cancelImprovePrompt();
        });
    },
    
    startLoadingMessages() {
      const loadingMessages = {
        ko: [
          '분석 중입니다',
          '정보를 수집하고 있습니다',
          '응답을 준비하고 있습니다'
        ],
        en: [
          'Analyzing...',
          'Gathering information...',
          'Preparing response...'
        ]
      };
      
      const messages = loadingMessages[this.currentLanguage];
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
    },
    
    copyMessage(message) {
      const textToCopy = floatChatService.convertMessageToText(message);
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            
          })
          .catch(err => {
            this.fallbackCopyTextToClipboard(textToCopy);
          });
      } else {
        this.fallbackCopyTextToClipboard(textToCopy);
      }
    },
    
    fallbackCopyTextToClipboard(text) {
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
          
        } else {
          
        }
      } catch (err) {
        
      }
      
      document.body.removeChild(textArea);
    },
    
    adjustTextareaHeight() {
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.style.height = 'auto';
          const newHeight = Math.min(textarea.scrollHeight, 100);
          textarea.style.height = `${newHeight}px`;
        }
      });
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    handleScroll() {
      
    }
  },
  
  beforeDestroy() {
    this.stopLoadingMessages();
  },
  
  watch: {
    currentLanguage() {
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });
    },
    
    isProcessing(newVal) {
      if (!newVal) {
        this.stopLoadingMessages();
      }
    }
  }
};
</script>