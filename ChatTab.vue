<template>
  <div class="chat-tab">
    <div class="chat-area">
      <div class="chat-header">
        <div class="persona-info">
          <div class="badge">
            <unicon 
              :name="getPersonaIconName(selectedPersona)" 
              fill="white" 
              :width="14" 
              :height="14"
            />
            {{ selectedPersona ? selectedPersona.title : getText('selectPersona') }}
          </div>
        </div>
        <div class="controls">
          <button 
            @click="clearAllMessages" 
            :disabled="isProcessing || !selectedPersona" 
            class="icon-btn clear-btn"
            :title="getText('clearAll')"
          >
            <unicon name="trash" fill="var(--surface-white)" :width="14" :height="14" />
          </button>
          <button 
            @click="resetPersona" 
            :disabled="isProcessing" 
            class="icon-btn"
            :title="getText('change')"
          >
            <unicon name="redo" fill="var(--primary-gold)" :width="14" :height="14" />
          </button>
          <button 
            @click="$emit('go-home')" 
            :disabled="isProcessing" 
            class="icon-btn"
            :title="getText('home')"
          >
            <unicon name="home" fill="var(--primary-gold)" :width="14" :height="14" />
          </button>
        </div>
      </div>

      <div class="messages" ref="messagesContainer" @scroll="handleScroll">
        <div v-if="!selectedPersona" class="no-persona">
          <unicon name="grid" fill="#318CE7" :width="48" :height="48" />
          <h4>{{ getText('noPersonaSelected') }}</h4>
          <p>{{ getText('noPersonaDesc') }}</p>
          <button @click="$emit('go-home')" class="btn-luxury-cyan go-home-btn">
            <unicon name="home" fill="white" :width="16" :height="16" />
            <span>{{ getText('goHome') }}</span>
          </button>
        </div>
        
        <div v-else-if="selectedPersona && messages.length === 0 && !isProcessing && !loadingHistory" class="welcome">
          <unicon name="sparkle" fill="#318CE7" :width="36" :height="36" />
          <h4>
            {{ getText('welcomeTitle').replace('{persona}', selectedPersona.title) }}
          </h4>
          <p class="welcome-desc">{{ selectedPersona.description }}</p>
          <div class="welcome-tip">
            <unicon name="info-circle" fill="#C8A257" :width="14" :height="14" />
            <span>{{ getText('welcomeTip') }}</span>
          </div>
        </div>

        <div v-if="loadingHistory" class="loading-history">
          <LoadingSpinner 
            size="medium" 
            variant="luxury" 
            :text="getText('loadingHistory')"
          />
        </div>

        <div 
          v-for="(message, index) in messages" 
          :key="message.id"
          :class="['message', message.type]"
          ref="messageElements"
        >
          <div class="bubble" :class="{ 'loading': message.isLoading }">
            <template v-if="message.isLoading">
              <LoadingSpinner 
                size="small" 
                dots 
                :text="currentLoadingMessage"
              />
            </template>
            
            <template v-else>
              <div class="content" v-html="message.content"></div>
              
              <button 
                v-if="message.type === 'ai'" 
                @click="copyMessage(message)" 
                class="message-action copy"
                :class="{ 'copied': message.copyStatus === 'copied' }"
                :title="message.copyStatus === 'copied' ? '복사됨!' : '복사'"
              >
                <unicon 
                  v-if="message.copyStatus === 'copied'" 
                  name="check" 
                  fill="#10B981" 
                  :width="12" 
                  :height="12" 
                />
                <unicon 
                  v-else 
                  name="copy" 
                  fill="#0033A0" 
                  :width="12" 
                  :height="12" 
                />
              </button>

              <button 
                v-if="message.type === 'ai' && !message.isError" 
                @click="showImprovePrompt(message)" 
                class="message-action improve"
                title="개선"
              >
                <unicon name="edit" fill="#0033A0" :width="12" :height="12" />
              </button>
            </template>
          </div>

          <div v-if="message.showImproveInput" class="improve-input-container">
            <div class="improve-input-box">
              <textarea 
                v-model="improvePromptText"
                class="improve-textarea form-textarea"
                :placeholder="getText('improvePlaceholder')"
                maxlength="1000"
                @keydown.enter.ctrl="submitImprovePrompt"
                ref="improveTextarea"
              />
              <div class="improve-actions">
                <button @click="cancelImprovePrompt" class="btn-cancel">
                  {{ getText('cancel') }}
                </button>
                <button 
                  @click="submitImprovePrompt" 
                  :disabled="!improvePromptText.trim() || isSubmittingImprove" 
                  class="btn-submit btn-luxury-cyan"
                >
                  <LoadingSpinner v-if="isSubmittingImprove" size="small" variant="white" />
                  <template v-else>{{ getText('improve') }}</template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedPersona" class="input-area">
        <div v-if="showQuickQuestions && quickQuestions.length > 0" class="quick-dropdown">
          <div class="quick-questions">
            <button 
              v-for="q in quickQuestions" 
              :key="q" 
              @click="sendQuickQuestion(q)" 
              class="quick-item"
            >
              {{ q }}
            </button>
          </div>
        </div>
        
        <div class="input-container">
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
              maxlength="1000"
              class="message-textarea"
            />
            
            <div class="input-bottom-row">
              <div class="left-actions">
                <button 
                  @click="generateQuickQuestions" 
                  :disabled="isProcessing"
                  class="action-btn"
                  :title="getText('generateQuestions')"
                >
                  <unicon name="lightbulb-alt" fill="var(--text-muted)" :width="12" :height="12" />
                </button>
                <button 
                  @click="toggleQuickQuestions" 
                  :disabled="isProcessing"
                  class="action-btn"
                  :class="{ active: showQuickQuestions }"
                  :title="getText('quickQuestions')"
                >
                  <unicon name="bolt" fill="var(--text-muted)" :width="12" :height="12" />
                </button>
              </div>
              
              <button 
                @click="sendMessage" 
                :disabled="!canSendMessage" 
                class="send-button"
              >
                <LoadingSpinner v-if="isProcessing" size="small" variant="white" />
                <unicon v-else name="message" fill="white" :width="14" :height="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ResultMessage 
      v-if="showCopyToast"
      type="success"
      :message="getText('copySuccess')"
      :show="showCopyToast"
      :auto-hide="2000"
      :dismissible="false"
      size="small"
      @dismiss="showCopyToast = false"
    />
  </div>
</template>

<script>
import floatChatService from '@service/floatChatService';
import LoadingSpinner from './components/LoadingSpinner.vue';
import LuxuryButton from './components/LuxuryButton.vue';
import FormField from './components/FormField.vue';
import ResultMessage from './components/ResultMessage.vue';
import llmContextService from '@service/llmContext';

export default {
  name: 'ChatTab',
  components: { LoadingSpinner, LuxuryButton, FormField, ResultMessage },
  
  props: {
    personas: {
      type: Array,
      default: () => []
    },
    loadingPersonas: {
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
    },
    selectedMode: {
      type: String,
      default: null
    }
  },
  
  data() {
    return {
      selectedPersona: null,
      currentMessage: '',
      messages: [],
      loadingHistory: false,
      currentLoadingMessage: '',
      loadingInterval: null,
      loadingMessageId: null,
      improvePromptText: '',
      isSubmittingImprove: false,
      currentImproveMessage: null,
      showQuickQuestions: false,
      showCopyToast: false,
      copyToastTimeout: null
    };
  },
  
  computed: {
    texts() {
      return {
        ko: {
          selectPersona: '페르소나를 선택해주세요',
          loadingPersonas: '페르소나 로딩 중...',
          loadingHint: '잠시만 기다려주세요.',
          loadingHistory: '대화 기록 불러오는 중...',
          change: '변경',
          home: '홈',
          clearAll: '전체 삭제',
          quickQuestions: '빠른 질문',
          generateQuestions: '질문 생성하기',
          noPersonaSelected: '페르소나를 선택해주세요',
          noPersonaDesc: '홈 화면에서 원하는 페르소나를 선택하여 시작하세요',
          goHome: '홈으로 가기',
          welcomeTitle: '{persona} 전문가, SWP Float Chat입니다!',
          welcomeTip: '빠른 질문을 통해서 다양한 질문을 해보세요',
          inputPlaceholder: '질문을 입력하세요...',
          improvePlaceholder: '어떤 부분이 개선되었으면 좋겠는지 알려주세요...',
          cancel: '취소',
          improve: '개선하기',
          copySuccess: '클립보드에 복사되었습니다!'
        },
        en: {
          selectPersona: 'Please select a persona',
          loadingPersonas: 'Loading personas...',
          loadingHint: 'Please wait a moment.',
          loadingHistory: 'Loading conversation history...',
          change: 'Change',
          home: 'Home',
          clearAll: 'Clear All',
          quickQuestions: 'Quick Questions',
          generateQuestions: 'Generate Questions',
          noPersonaSelected: 'Please select a persona',
          noPersonaDesc: 'Choose your desired persona from the home screen to get started',
          goHome: 'Go Home',
          welcomeTitle: 'I am SWP Float Chat, an expert in {persona}!',
          welcomeTip: 'Try various questions through quick questions',
          inputPlaceholder: 'Enter your question...',
          improvePlaceholder: 'Let me know what you would like to improve...',
          cancel: 'Cancel',
          improve: 'Improve',
          copySuccess: 'Copied to clipboard!'
        }
      }[this.currentLanguage];
    },
    
    canSendMessage() {
      return this.currentMessage.trim().length > 0 && !this.isProcessing;
    },
    
    quickQuestions() {
      if (!this.selectedPersona) return [];
      return floatChatService.getQuickQuestions(this.selectedPersona.personaCode, this.currentLanguage);
    }
  },
  
  methods: {
    getText(key) { 
      return this.texts[key] || key; 
    },
    
    getPersonaIconName(persona) {
      if (!persona) return 'comment';
      return floatChatService.getPersonaIcon(persona.personaCode, persona.iconPath);
    },
    
    setPersonas(personas) {
      if (personas && personas.length > 0) {
        this.selectedPersona = personas[0];
        this.loadPersonaHistory();
      }
    },
    
    toggleQuickQuestions() {
      this.showQuickQuestions = !this.showQuickQuestions;
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
      if (this.currentMessage.includes('
')) {
        this.adjustTextareaHeight();
      } else {
        const textarea = this.$refs.messageInput;
        if (textarea && textarea.style.height !== '21px') {
          textarea.style.height = '21px';
        }
      }
    },
    
    handleFocus(event) {
      const textarea = this.$refs.messageInput;
      if (textarea && !this.currentMessage.trim()) {
        textarea.style.height = '21px';
      }
    },
    
    selectPersona(persona) {
      this.selectedPersona = persona;
      this.messages = [];
      this.showQuickQuestions = false;
      this.loadPersonaHistory();
    },
    
    loadPersonaHistory() {
      if (!this.selectedPersona) return;
      
      this.loadingHistory = true;
      
      setTimeout(() => {
        floatChatService.getConversations(this.selectedPersona.personaCode)
          .then(response => {
            if (response.success && response.data) {
              this.messages = floatChatService.convertConversationsToMessages(response.data);
            }
          })
          .catch(error => {
            console.error('Conversation loading failed:', error);
          })
          .finally(() => {
            this.loadingHistory = false;
            this.$nextTick(() => {
              this.scrollToBottom();
              this.$refs.messageInput?.focus();
              const textarea = this.$refs.messageInput;
              if (textarea) {
                textarea.style.height = '21px';
              }
            });
          });
      }, 100);
    },
    
    resetPersona() {
      this.$emit('go-home');
    },
    
    clearAllMessages() {
      if (!this.selectedPersona) return;
      
      floatChatService.deleteConversations(this.selectedPersona.personaCode)
        .then(response => {
          if (response.success) {
            this.messages = [];
            this.currentMessage = '';
            this.showQuickQuestions = false;
            this.stopLoadingMessages();
            this.cancelImprovePrompt();
            this.$nextTick(() => {
              const textarea = this.$refs.messageInput;
              if (textarea) {
                textarea.style.height = '21px';
              }
            });
          }
        })
        .catch(error => {
          console.error('Conversation deletion failed:', error);
        });
    },
    
    resetToInitialState() {
      this.selectedPersona = null;
      this.messages = [];
      this.currentMessage = '';
      this.showQuickQuestions = false;
      this.stopLoadingMessages();
      this.cancelImprovePrompt();
      this.hideCopyToast();
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.style.height = '21px';
        }
      });
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
      this.showQuickQuestions = false;
      this.$nextTick(() => {
        const textarea = this.$refs.messageInput;
        if (textarea) {
          textarea.style.height = '21px';
        }
      });
      this.scrollToBottom();
      this.startLoadingMessages();
      
      this.$emit('message-sent', {
        personaCode: this.selectedPersona.personaCode,
        userQuestion: messageContent
      });
    },
    
    sendQuickQuestion(question) {
      this.currentMessage = question;
      this.showQuickQuestions = false;
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });
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
          conversationId: response.conversationId,
          copyStatus: null
        };
        
        this.messages.push(aiMessage);
      } else {
        const errorMessage = {
          id: `error-${Date.now()}`,
          type: 'ai',
          content: response.message || '응답 생성 중 오류가 발생했습니다.',
          timestamp: Date.now(),
          isLoading: false,
          isError: true,
          copyStatus: null
        };
        
        this.messages.push(errorMessage);
      }
      
      this.scrollToBottom();
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
        personaCode: this.selectedPersona.personaCode,
        feedbackContent: this.improvePromptText.trim(),
        originalQuestion: lastUserMessage ? lastUserMessage.content : '',
        originalAnswer: this.currentImproveMessage ? this.currentImproveMessage.content : ''
      };
      
      llmContextService.contextImproveFromFeedback(feedbackData)
        .then(response => {
          const message = response.success 
            ? (response.data?.message || '피드백을 반영하여 프롬프트가 개선되었습니다.')
            : (response.errorMessage || '프롬프트 개선 중 오류가 발생했습니다.');
          
          const improveMessage = {
            id: `improve-${Date.now()}`,
            type: 'ai',
            content: message,
            timestamp: Date.now(),
            isLoading: false,
            isImproveResult: true,
            isError: !response.success,
            copyStatus: null
          };
          
          this.messages.push(improveMessage);
          this.scrollToBottom();
        })
        .catch(error => {
          const errorMessage = {
            id: `improve-error-${Date.now()}`,
            type: 'ai',
            content: '프롬프트 개선 중 네트워크 오류가 발생했습니다.',
            timestamp: Date.now(),
            isLoading: false,
            isError: true,
            copyStatus: null
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
      if (!message || !message.content) return;

      let textToCopy = '';
      if (message.content.includes('markdown-table')) {
        textToCopy = floatChatService.htmlToMarkdown(message.content);
      } else {
        textToCopy = floatChatService.htmlToPlainText(message.content);
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
        console.error('Copy failed:', err);
      }
      
      document.body.removeChild(textArea);
    },
    
    showCopySuccess(message) {
      this.$set(message, 'copyStatus', 'copied');
      this.showCopyToast = true;
      
      setTimeout(() => {
        this.$set(message, 'copyStatus', null);
      }, 3000);
      
      this.hideCopyToast();
    },
    
    hideCopyToast() {
      if (this.copyToastTimeout) {
        clearTimeout(this.copyToastTimeout);
      }
      
      this.copyToastTimeout = setTimeout(() => {
        this.showCopyToast = false;
      }, 2000);
    },
    
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      if (!textarea) return;
      
      const lineHeight = 21;
      const maxHeight = 200;
      
      if (!textarea.value.trim()) {
        if (textarea.style.height !== `${lineHeight}px`) {
          textarea.style.height = `${lineHeight}px`;
        }
        return;
      }
      
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      
      const newHeight = Math.max(lineHeight, Math.min(scrollHeight, maxHeight));
      textarea.style.height = `${newHeight}px`;
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
  
  mounted() {
    this.$nextTick(() => {
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.style.height = '21px';
      }
    });
  },
  
  beforeDestroy() {
    this.stopLoadingMessages();
    this.hideCopyToast();
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
      if (newVal) {
        this.showQuickQuestions = false;
      }
    },
    
    personas: {
      handler(newPersonas) {
        if (newPersonas && newPersonas.length > 0 && !this.selectedPersona) {
          this.setPersonas(newPersonas);
        }
      },
      immediate: true
    }
  }
};
</script>
