<template>
  <div>
    <!-- Premium Button System -->
    <component 
      v-if="componentType === 'button'"
      :is="'button'"
      :class="buttonClasses"
      :disabled="disabled || loading"
      :type="type"
      @click="handleClick"
    >
      <Elements
        v-if="loading"
        component-type="spinner"
        :size="size"
        class="ai-chatops-button__spinner"
      />
      
      <unicon
        v-if="icon && !loading"
        :name="icon"
        fill="currentColor"
        :width="iconSize"
        :height="iconSize"
        class="ai-chatops-button__icon"
      />
      
      <span v-if="$slots.default" class="ai-chatops-button__text">
        <slot />
      </span>
    </component>

    <!-- Premium Spinner System -->
    <div
      v-if="componentType === 'spinner'"
      :class="spinnerClasses"
      role="status"
    >
      <span class="sr-only">{{ loadingText }}</span>
    </div>

    <!-- Premium Rating System -->
    <div v-if="componentType === 'rating'" class="star-rating">
      <div class="star-rating__stars">
        <button
          v-for="star in maxRating"
          :key="star"
          :class="getStarClasses(star)"
          @click="selectRating(star)"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
          @focus="hoverRating = star"
          @blur="hoverRating = 0"
          :disabled="disabled"
          type="button"
        >
          <unicon
            name="star"
            :fill="getStarFill(star)"
            :width="starIconSize"
            :height="starIconSize"
          />
        </button>
      </div>
      
      <div v-if="showText" class="star-rating__text">
        {{ getRatingText() }}
      </div>
    </div>

    <!-- Enhanced Message System -->
    <div v-if="componentType === 'message'" :class="['message', `message--${messageType}`]">
      <div :class="messageClasses" @mouseenter="showActions = true" @mouseleave="showActions = false">
        <template v-if="loading">
          <div class="message-bubble__loading">
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="loading-text">{{ loadingMessage }}</div>
          </div>
        </template>
        
        <template v-else>
          <!-- User 메시지 브랜딩 -->
          <div v-if="messageType === 'user'" class="user-message-brand">
            <div class="user-badge">
              <span class="user-emoji">👤</span>
              <span>USER</span>
            </div>
          </div>
          
          <!-- Bot 메시지 브랜딩 -->
          <div v-if="messageType === 'ai'" class="bot-message-brand">
            <div class="bot-badge">
              <span class="bot-emoji">🤖</span>
              <span>Bot</span>
            </div>
          </div>
          
          <div class="message-bubble__content" v-html="content"></div>
          
          <!-- Enhanced Actions -->
          <div v-if="messageType === 'ai' && showActions && !isError" class="message-bubble__actions">
            <button
              v-if="showCopy"
              :class="['message-action', 'message-action--copy', 'btn-system', 'btn-system--ghost', 'btn-system--sm', 'btn-system--icon-only', { 'message-action--copied': copyStatus === 'copied' }]"
              @click="handleCopy"
            >
              <unicon :name="copyStatus === 'copied' ? 'check' : 'copy'" fill="currentColor" :width="12" :height="12" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Elements',
  
  props: {
    componentType: {
      type: String,
      required: true,
      validator: value => ['button', 'spinner', 'rating', 'message'].includes(value)
    },
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    icon: { type: String, default: null },
    type: { type: String, default: 'button' },
    block: { type: Boolean, default: false },
    color: { type: String, default: 'primary' },
    centered: { type: Boolean, default: false },
    loadingText: { type: String, default: '로딩 중입니다...' },
    
    // Rating props
    modelValue: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    maxRating: { type: Number, default: 5 },
    showText: { type: Boolean, default: false },
    textLabels: { type: Array, default: () => ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'] },
    
    // Message props
    messageType: { type: String, default: 'user' },
    content: { type: String, default: '' },
    loadingMessage: { type: String, default: '응답을 생성하고 있습니다...' },
    isError: { type: Boolean, default: false },
    showCopy: { type: Boolean, default: true },
    copyStatus: { type: String, default: null }
  },
  
  data() {
    return {
      hoverRating: 0,
      showActions: false
    };
  },
  
  computed: {
    buttonClasses() {
      return [
        'btn-system',
        `btn-system--${this.variant}`,
        `btn-system--${this.size}`,
        {
          'btn-system--block': this.block,
          'btn-system--loading': this.loading,
          'btn-system--icon-only': this.icon && !this.$slots.default
        }
      ];
    },
    
    spinnerClasses() {
      return [
        'loading-spinner',
        `loading-spinner--${this.size}`,
        `loading-spinner--${this.color}`,
        { 'loading-spinner--centered': this.centered }
      ];
    },
    
    messageClasses() {
      return [
        'message-bubble',
        `message-bubble--${this.messageType}`,
        {
          'message-bubble--loading': this.loading,
          'message-bubble--error': this.isError
        }
      ];
    },
    
    iconSize() {
      return { sm: 12, md: 14, lg: 16 }[this.size] || 14;
    },
    
    starIconSize() {
      return { sm: 16, md: 18, lg: 20 }[this.size] || 18;
    },
    
    currentRating() {
      return this.hoverRating || this.modelValue || this.value;
    }
  },
  
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event);
      }
    },
    
    selectRating(rating) {
      if (this.disabled) return;
      this.$emit('update:modelValue', rating);
      this.$emit('input', rating);
      this.$emit('change', rating);
    },
    
    getStarClasses(star) {
      return [
        'star-rating__star',
        'btn-system',
        'btn-system--ghost',
        'btn-system--sm',
        'btn-system--icon-only',
        {
          'star-rating__star--active': star <= this.currentRating,
          'star-rating__star--disabled': this.disabled
        }
      ];
    },
    
    getStarFill(star) {
      return star <= this.currentRating ? 'var(--accent-primary)' : 'var(--border-medium)';
    },
    
    getRatingText() {
      if (!this.currentRating) return '';
      return this.textLabels[this.currentRating - 1] || '';
    },
    
    handleCopy() {
      this.$emit('copy');
    }
  }
};
</script>

<style scoped>
/* === PREMIUM SPINNER SYSTEM === */
.loading-spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

.loading-spinner--sm { width: 12px; height: 12px; }
.loading-spinner--md { width: 16px; height: 16px; }
.loading-spinner--lg { width: 20px; height: 20px; }

.loading-spinner--centered {
  margin: 0 auto;
}

.loading-spinner--primary {
  border-top-color: var(--color-primary);
}

.loading-spinner--accent {
  border-top-color: var(--color-accent);
}

/* === PREMIUM RATING SYSTEM === */
.star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.star-rating__stars {
  display: flex;
  gap: var(--space-sm);
}

.star-rating__star {
  width: 36px !important;
  height: 36px !important;
  min-height: 36px !important;
  background: var(--color-surface-light) !important;
  border: 1px solid var(--color-border-light) !important;
  transition: all var(--motion-normal) !important;
}

.star-rating__star:hover:not(.star-rating__star--disabled) {
  background: var(--color-accent-subtle) !important;
  border-color: var(--color-accent) !important;
  box-shadow: var(--shadow-soft) !important;
}

.star-rating__star--active:not(.star-rating__star--disabled) {
  background: var(--color-accent-medium) !important;
  border-color: var(--color-accent) !important;
}

.star-rating__star--disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.star-rating__star--disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

.star-rating__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
  min-height: 20px;
  text-align: center;
  transition: all var(--motion-fast);
}

/* === ENHANCED MESSAGE SYSTEM - CLAUDE.AI STYLE === */
.message {
  width: 100%;
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.3s var(--motion-normal);
  align-items: flex-start;
}

.message-bubble {
  width: 100%;
  position: relative;
  transition: all var(--motion-fast);
}

/* === USER MESSAGE STYLING - CLAUDE.AI STYLE === */
.message-bubble--user {
  width: 100%;
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}

.message-bubble--user .message-bubble__content {
  background: var(--color-surface-medium);
  color: var(--color-text-primary);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  /* border-left: 4px solid var(--color-primary); */ /* 왼쪽 보더 제거 */
  font-size: var(--font-size-base);
  line-height: 1.6;
  word-wrap: break-word;
  box-shadow: var(--shadow-minimal);
  margin-bottom: var(--space-md);
}

/* === BOT MESSAGE STYLING - CLAUDE.AI STYLE === */
.message-bubble--ai {
  width: 100%;
  border-radius: 0;
  font-size: var(--font-size-base);
  line-height: 1.6;
  word-wrap: break-word;
  position: relative;
  overflow: visible;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.message-bubble--loading {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  border-radius: 0;
  backdrop-filter: none;
}

.message-bubble--error .message-bubble__content {
  background: var(--alert-error-bg) !important;
  color: var(--color-error) !important;
  /* border-left-color: var(--color-error) !important; */ /* 왼쪽 보더 제거 */
  padding: var(--space-md) var(--space-lg) !important;
  border-radius: var(--radius-lg) !important;
  /* border-left: 4px solid var(--color-error) !important; */ /* 왼쪽 보더 제거 */
  box-shadow: var(--shadow-subtle) !important;
}

.message-bubble--ai .message-bubble__content {
  background: transparent;
  color: var(--color-text-primary);
  padding: var(--space-md) 0 var(--space-lg);
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* === USER MESSAGE BRANDING === */
.user-message-brand {
  position: relative;
  margin-bottom: var(--space-sm);
  z-index: 2;
  text-align: left; /* 사용자 메시지는 왼쪽 정렬 */
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  background: linear-gradient(135deg, var(--color-primary), rgba(37, 99, 235, 0.85));
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.user-emoji {
  font-size: 12px;
  line-height: 1;
  user-select: none;
}

/* === BOT MESSAGE BRANDING === */
.bot-message-brand {
  position: relative;
  margin-bottom: var(--space-sm);
  z-index: 2;
}

.bot-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-primary-dark));
  color: white;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: var(--shadow-accent-subtle);
  backdrop-filter: blur(var(--blur-subtle));
}

.bot-emoji {
  font-size: 12px;
  line-height: 1;
}

/* === LOADING ANIMATION === */
.message-bubble__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: center;
  padding: var(--space-lg);
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  animation: loading-pulse var(--duration-loading) ease-in-out infinite both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.16s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.32s;
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
  text-align: center;
}

/* === MESSAGE CONTENT === */
.message-bubble__content {
  word-wrap: break-word;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* === ENHANCED ACTIONS - AI 버블 아래 배치 === */
.message-bubble__actions {
  position: relative;  /* absolute → relative로 변경 */
  margin-top: var(--space-md);  /* 위쪽 여백 추가 */
  margin-left: 0;
  display: flex;
  gap: var(--space-sm);
  opacity: 0;
  transition: opacity var(--motion-fast);
  z-index: 3;
}

.message-bubble:hover .message-bubble__actions {
  opacity: 1;
}

.message-action {
  width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid var(--color-border-medium) !important;
  backdrop-filter: blur(var(--blur-subtle)) !important;
  box-shadow: var(--shadow-moderate) !important;
  border-radius: var(--radius-md) !important;
}

.message-action:hover {
  background: var(--color-surface-white) !important;
  border-color: var(--color-accent) !important;
  box-shadow: var(--shadow-accent-medium) !important;
}

.message-action--copied {
  background: var(--color-success) !important;
  border-color: var(--color-success) !important;
  color: white !important;
  transform: scale(var(--transform-gentle)) !important;
}

.message-action--copied:hover {
  background: #047857 !important;
  border-color: #047857 !important;
  transform: scale(var(--transform-gentle)) !important;
}

/* === ACCESSIBILITY === */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* === KEYFRAME ANIMATIONS === */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes loading-pulse {
  0%, 80%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.9;
  }
  40% {
    transform: translateY(-6px) scale(var(--transform-gentle));
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 640px) {
  .message {
    padding: var(--space-md) var(--space-lg);
  }
  
  .message-bubble--user .message-bubble__content,
  .message-bubble--error .message-bubble__content {
    padding: var(--space-sm) var(--space-md) !important;
    font-size: var(--font-size-sm) !important;
  }
  
  .message-bubble--ai .message-bubble__content {
    font-size: var(--font-size-sm);
    padding: var(--space-sm) 0 var(--space-md);
  }
  
  .bot-badge {
    font-size: 9px;
    padding: 2px 8px;
  }
  
  .loading-dots span {
    width: 6px;
    height: 6px;
  }
  
  .message-action {
    width: 28px !important;
    height: 28px !important;
    min-height: 28px !important;
  }
  
  .star-rating__star {
    width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
  }
}

/* === THEME ADAPTATIONS === */
.theme-timeless .bot-badge {
  background: linear-gradient(90deg, var(--timeless-accent), #991B1B);
}

.theme-heritage .bot-badge {
  background: linear-gradient(90deg, var(--heritage-accent), #7F1D1D);
}

.theme-modern .bot-badge {
  background: linear-gradient(90deg, var(--modern-accent), #A16207);
}

.theme-hermes .bot-badge {
  background: linear-gradient(90deg, var(--hermes-accent), #D97706);
}
</style>