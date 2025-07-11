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
          <AIOpsComponents
            component-type="button"
            @click="clearAllMessages" 
            :disabled="isProcessing || !selectedPersona" 
            variant="danger"
            size="sm"
            icon="trash"
            class="clear-btn"
          />
          <AIOpsComponents
            component-type="button"
            @click="resetPersona" 
            :disabled="isProcessing" 
            variant="ghost"
            size="sm"
            icon="redo"
          />
          <AIOpsComponents
            component-type="button"
            @click="$emit('go-home')" 
            :disabled="isProcessing" 
            variant="ghost"
            size="sm"
            icon="home"
          />
        </div>
      </div>

      <div class="messages" ref="messagesContainer" @scroll="handleScroll">
        <div v-if="!selectedPersona" class="no-persona">
          <unicon name="grid" fill="var(--primary-color)" :width="48" :height="48" />
          <h4>{{ getText('noPersonaSelected') }}</h4>
          <p>{{ getText('noPersonaDesc') }}</p>
          <AIOpsComponents
            component-type="button"
            @click="$emit('go-home')"
            variant="primary"
            icon="home"
            class="go-home-btn"
          >
            {{ getText('goHome') }}
          </AIOpsComponents>
        </div>
        
        <div v-else-if="selectedPersona && messages.length === 0 && !isProcessing && !loadingHistory" class="welcome">
          <unicon name="sparkle" fill="var(--primary-color)" :width="36" :height="36" />
          <h4>
            {{ getText('welcomeChat', { persona: selectedPersona.title }) }}
          </h4>
          <p class="welcome-desc">{{ getPersonaDescription(selectedPersona) }}</p>
          <div class="welcome-tip">
            <unicon name="info-circle" fill="var(--accent-primary)" :width="14" :height="14" />
            <span>{{ getText('welcomeTip') }}</span>
          </div>
        </div>

        <div v-if="loadingHistory" class="loading-history">
          <AIOpsComponents component-type="spinner" size="md" />
          <span>{{ getText('loadingHistory') }}</span>
        </div>

        <AIOpsComponents
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

      <div v-if="selectedPersona" class="input-area">
        <div v-if="showQuickQuestions && quickQuestions.length > 0" class="quick-dropdown">
          <div class="quick-questions">
            <AIOpsComponents
              component-type="button"
              v-for="q in quickQuestions" 
              :key="q" 
              @click="sendQuickQuestion(q)" 
              variant="ghost"
              size="sm"
              class="quick-item"
            >
              {{ q }}
            </AIOpsComponents>
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
                <AIOpsComponents
                  component-type="button"
                  @click="generateQuickQuestions" 
                  :disabled="isProcessing"
                  variant="ghost"
                  size="sm"
                  icon="lightbulb-alt"
                  class="action-btn"
                />
                <AIOpsComponents
                  component-type="button"
                  @click="toggleQuickQuestions" 
                  :disabled="isProcessing"
                  variant="ghost"
                  size="sm"
                  icon="bolt"
                  :class="{ active: showQuickQuestions }"
                  class="action-btn"
                />
                <AIOpsComponents
                  component-type="button"
                  @click="toggleContinuousChat" 
                  :disabled="isProcessing"
                  variant="ghost"
                  size="sm"
                  icon="exchange-alt"
                  :class="{ active: continuousChatEnabled }"
                  class="action-btn continuous-chat-btn"
                  :title="getText('continuousChat')"
                />
              </div>
              
              <AIOpsComponents
                component-type="button"
                @click="sendMessage" 
                :disabled="!canSendMessage" 
                :loading="isProcessing"
                variant="primary"
                size="sm"
                icon="message"
                class="send-button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCopyToast" class="copy-toast fade-in">
      <unicon name="check-circle" fill="var(--success-color)" :width="16" :height="16" />
      <span>{{ getText('copySuccess') }}</span>
    </div>
  </div>
</template>

<script>
import aiopsChatService from '@service/aiopsChatService';
import { getText } from '../utils/i18n';
import AIOpsComponents from './AIOpsComponents.vue';

export default {
  name: 'ChatTab',
  components: {
    AIOpsComponents
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
      showCopyToast: false,
      copyToastTimeout: null
    };
  },
  
  computed: {
    canSendMessage() {
      return this.currentMessage.trim().length > 0 && !this.isProcessing && this.selectedPersona;
    },
    
    quickQuestions() {
      if (!this.selectedPersona) return [];
      return aiopsChatService.getQuickQuestions(this.selectedPersona.personaCode, this.currentLanguage);
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
    }
  },
  
  methods: {
    getText(key, params = {}) {
      return getText(this.currentLanguage, key, params);
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
      if (this.currentMessage.includes('\n')) {
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
    
    loadPersonaHistory() {
      if (!this.selectedPersona) return;
      
      this.loadingHistory = true;
      
      setTimeout(() => {
        aiopsChatService.getConversations(this.selectedPersona.personaCode)
          .then(response => {
            if (response.success && response.data) {
              this.messages = aiopsChatService.convertConversationsToMessages(response.data);
            }
          })
          .catch(error => {
            
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
      this.$emit('go-persona-list');
    },
    
    clearAllMessages() {
      if (!this.selectedPersona) return;
      
      aiopsChatService.deleteConversations(this.selectedPersona.personaCode)
        .then(response => {
          if (response.success) {
            this.messages = [];
            this.currentMessage = '';
            this.showQuickQuestions = false;
            this.continuousChatEnabled = false;
            this.stopLoadingMessages();
            this.$nextTick(() => {
              const textarea = this.$refs.messageInput;
              if (textarea) {
                textarea.style.height = '21px';
              }
            });
          }
        })
        .catch(error => {
          
        });
    },
    
    resetToInitialState() {
      this.messages = [];
      this.currentMessage = '';
      this.showQuickQuestions = false;
      this.continuousChatEnabled = false;
      this.stopLoadingMessages();
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
          content: response.message || this.getText('aiError'),
          timestamp: Date.now(),
          isLoading: false,
          isError: true,
          copyStatus: null
        };
        
        this.messages.push(errorMessage);
      }
      
      this.scrollToBottom();
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
        textToCopy = aiopsChatService.htmlToMarkdown(message.content);
      } else {
        textToCopy = aiopsChatService.htmlToPlainText(message.content);
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
.chat-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.loading-history {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

.chat-header {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
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
  left: var(--spacing-xl);
  right: var(--spacing-xl);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--accent-primary) 50%, transparent 100%);
  opacity: 0.4;
}

.persona-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}

.badge {
  background: var(--primary-color);
  color: white;
  padding: 6px var(--spacing-md);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-smooth);
  border: 1px solid var(--accent-primary);
  line-height: 1;
}

.badge:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.controls {
  display: flex;
  gap: 6px;
}

.clear-btn {
  background: var(--error-color) !important;
  border-color: var(--error-color) !important;
}

.clear-btn:hover {
  background: #B91C1C !important;
  border-color: #B91C1C !important;
}

.messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--surface-light);
  scroll-behavior: smooth;
  padding: 0;
  position: relative;
  z-index: 1;
  min-height: 0;
}

.welcome {
  text-align: center;
  padding: 48px var(--spacing-xl);
}

.welcome h4 {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
  line-height: 1.5;
}

.welcome-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.4;
}

.welcome-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(200, 162, 87, 0.1);
  border: 1px solid rgba(200, 162, 87, 0.3);
  border-radius: 20px;
  display: inline-flex;
}

.no-persona {
  text-align: center;
  padding: 48px var(--spacing-xl);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-persona h4 {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
  line-height: 1.5;
}

.no-persona p {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0 0 var(--spacing-xl) 0;
  line-height: 1.4;
}

.go-home-btn {
  padding: var(--spacing-md) var(--spacing-xl) !important;
}

.input-area {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md);
  background: var(--surface-light);
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
  position: relative;
}

.quick-dropdown {
  position: absolute;
  bottom: 100%;
  left: var(--spacing-xl);
  right: var(--spacing-xl);
  margin-bottom: var(--spacing-sm);
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.quick-questions {
  padding: var(--spacing-sm);
}

.quick-item {
  width: 100% !important;
  text-align: left !important;
  padding: var(--spacing-md) var(--spacing-lg) !important;
  border-radius: 6px !important;
  line-height: 1.4;
  justify-content: flex-start !important;
}

.quick-item:hover {
  background: var(--surface-light) !important;
  transform: translateX(4px);
}

.input-container {
  transition: all var(--transition-smooth);
}

.input-box {
  background: var(--surface-white);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all var(--transition-smooth);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-box:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(200, 162, 87, 0.1);
  transform: translateY(-1px);
}

.message-textarea {
  width: 100%;
  height: 21px;
  min-height: 21px;
  max-height: 200px;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--text-primary);
  line-height: 1.5;
  padding: 0;
  margin: 0;
  transition: none;
  overflow: hidden;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-textarea::placeholder {
  color: var(--text-muted);
  font-size: var(--font-size-base);
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

.action-btn {
  width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  border-radius: 6px !important;
  padding: 0 !important;
}

.action-btn.active {
  background: rgba(200, 162, 87, 0.15) !important;
  border-color: rgba(200, 162, 87, 0.3) !important;
}

.continuous-chat-btn.active {
  background: rgba(34, 197, 94, 0.15) !important;
  border-color: rgba(34, 197, 94, 0.3) !important;
  color: var(--success-color) !important;
}

.send-button {
  width: 28px !important;
  height: 28px !important;
  min-height: 28px !important;
  border-radius: 6px !important;
  padding: 0 !important;
}

.copy-toast {
  position: fixed;
  bottom: 120px;
  right: 50%;
  transform: translateX(50%);
  background: var(--surface-white);
  border: 1px solid var(--success-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  z-index: 1000;
}

@media (max-width: 640px) {
  .input-area {
    padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm);
  }
  
  .input-box {
    padding: 6px var(--spacing-sm);
    gap: 6px;
  }
  
  .message-textarea {
    height: 21px;
    min-height: 21px;
  }
  
  .left-actions {
    gap: 4px;
  }
  
  .action-btn {
    width: 22px !important;
    height: 22px !important;
    min-height: 22px !important;
  }
  
  .send-button {
    width: 26px !important;
    height: 26px !important;
    min-height: 26px !important;
  }
}
</style>