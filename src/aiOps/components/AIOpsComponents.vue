<template>
  <div>
    <!-- PremiumButton Component -->
    <component 
      v-if="componentType === 'button'"
      :is="'button'"
      :class="buttonClasses"
      :disabled="disabled || loading"
      :type="type"
      @click="handleClick"
    >
      <LoadingSpinner
        v-if="loading"
        :size="spinnerSize"
        class="premium-button__spinner"
      />
      
      <unicon
        v-if="icon && !loading"
        :name="icon"
        :fill="iconColor"
        :width="iconSize"
        :height="iconSize"
        class="premium-button__icon"
      />
      
      <span v-if="$slots.default" class="premium-button__text">
        <slot />
      </span>
    </component>

    <!-- LoadingSpinner Component -->
    <div
      v-if="componentType === 'spinner'"
      :class="spinnerClasses"
      role="status"
    >
      <span class="sr-only">{{ loadingText }}</span>
    </div>

    <!-- StarRating Component -->
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

    <!-- MessageBubble Component -->
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
          <div class="message-bubble__content" v-html="content"></div>
          
          <div v-if="messageType === 'ai' && showActions && !isError" class="message-bubble__actions">
            <AIOpsComponents
              component-type="button"
              v-if="showCopy"
              variant="ghost"
              size="sm"
              :icon="copyStatus === 'copied' ? 'check' : 'copy'"
              @click="handleCopy"
              class="message-action message-action--copy"
              :class="{ 'message-action--copied': copyStatus === 'copied' }"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIOpsComponents',
  
  props: {
    componentType: {
      type: String,
      required: true,
      validator: value => ['button', 'spinner', 'rating', 'message'].includes(value)
    },
    variant: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'md'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'button'
    },
    block: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    centered: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '로딩 중입니다...'
    },
    value: {
      type: Number,
      default: 0
    },
    maxRating: {
      type: Number,
      default: 5
    },
    showText: {
      type: Boolean,
      default: false
    },
    textLabels: {
      type: Array,
      default: () => ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음']
    },
    messageType: {
      type: String,
      default: 'user'
    },
    content: {
      type: String,
      default: ''
    },
    loadingMessage: {
      type: String,
      default: '응답을 생성하고 있습니다...'
    },
    isError: {
      type: Boolean,
      default: false
    },
    showCopy: {
      type: Boolean,
      default: true
    },
    copyStatus: {
      type: String,
      default: null
    }
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
        'premium-button',
        `premium-button--${this.variant}`,
        `premium-button--${this.size}`,
        {
          'premium-button--block': this.block,
          'premium-button--loading': this.loading,
          'premium-button--icon-only': this.icon && !this.$slots.default
        }
      ];
    },
    
    spinnerClasses() {
      return [
        'loading-spinner',
        `loading-spinner--${this.size}`,
        `loading-spinner--${this.color}`,
        {
          'loading-spinner--centered': this.centered
        }
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
      const sizes = { sm: 12, md: 14, lg: 16 };
      return sizes[this.size] || sizes.md;
    },
    
    starIconSize() {
      const sizes = { sm: 16, md: 18, lg: 20 };
      return sizes[this.size] || sizes.md;
    },
    
    spinnerSize() {
      const sizes = { sm: 'sm', md: 'md', lg: 'lg' };
      return sizes[this.size] || sizes.md;
    },
    
    iconColor() {
      if (this.variant === 'primary' || this.variant === 'danger') {
        return 'currentColor';
      }
      if (this.variant === 'accent') {
        return 'var(--text-primary)';
      }
      return 'currentColor';
    },
    
    currentRating() {
      return this.hoverRating || this.value;
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
      this.$emit('input', rating);
      this.$emit('change', rating);
    },
    
    getStarClasses(star) {
      return [
        'star-rating__star',
        `star-rating__star--${this.size}`,
        {
          'star-rating__star--active': star <= this.currentRating,
          'star-rating__star--disabled': this.disabled
        }
      ];
    },
    
    getStarFill(star) {
      if (star <= this.currentRating) {
        return 'var(--accent-primary)';
      }
      return 'var(--border-medium)';
    },
    
    getRatingText() {
      if (!this.currentRating) return '';
      const index = this.currentRating - 1;
      return this.textLabels[index] || '';
    },
    
    handleCopy() {
      this.$emit('copy');
    }
  }
};
</script>

<style scoped>
.premium-button {
  font-family: var(--font-family);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all var(--transition-smooth);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  min-height: 32px;
}

.premium-button--primary {
  background: var(--primary-color);
  color: var(--text-light);
  border-color: var(--primary-color);
}

.premium-button--primary:hover:not(:disabled) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.premium-button--accent {
  background: var(--accent-primary);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.premium-button--outline {
  background: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.premium-button--ghost {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border-color: var(--border-light);
}

.premium-button--danger {
  background: var(--error-color);
  color: var(--text-light);
  border-color: var(--error-color);
}

.premium-button--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  min-height: 28px;
}

.premium-button--md {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-base);
  min-height: 36px;
}

.premium-button--lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
  min-height: 44px;
}

.premium-button--block {
  width: 100%;
}

.premium-button--icon-only {
  width: auto;
  aspect-ratio: 1;
  padding: var(--spacing-sm);
}

.premium-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

.loading-spinner--sm { width: 12px; height: 12px; }
.loading-spinner--md { width: 16px; height: 16px; }
.loading-spinner--lg { width: 20px; height: 20px; }

.loading-spinner--centered {
  margin: 0 auto;
}

.star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.star-rating__stars {
  display: flex;
  gap: var(--spacing-sm);
}

.star-rating__star {
  width: 32px;
  height: 32px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-smooth);
}

.star-rating__star:hover:not(.star-rating__star--disabled),
.star-rating__star--active:not(.star-rating__star--disabled) {
  background: rgba(200, 162, 87, 0.1);
  border-color: var(--accent-primary);
  transform: translateY(-1px) scale(1.05);
  box-shadow: var(--shadow-md);
}

.star-rating__star--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.star-rating__text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-weight: 500;
  min-height: 20px;
  text-align: center;
}

.message {
  padding: var(--spacing-sm) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.3s var(--transition-smooth);
}

.message--user {
  align-items: flex-end;
}

.message--ai {
  align-items: flex-start;
}

.message-bubble {
  position: relative;
  padding-bottom: 32px;
}

.message-bubble--user {
  padding-bottom: var(--spacing-md);
}

.message-bubble__loading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: var(--radius-full);
  animation: loading-pulse 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.16s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.32s;
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-weight: 500;
}

.message-bubble__content {
  word-wrap: break-word;
  line-height: 1.5;
}

.message-bubble__actions {
  position: absolute;
  bottom: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.message-bubble:hover .message-bubble__actions {
  opacity: 1;
}

.message-action {
  width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  border-radius: var(--radius-sm) !important;
  background: var(--surface-white) !important;
  border: 1px solid var(--border-light) !important;
  box-shadow: var(--shadow-sm);
}

.message-action--copied {
  background: var(--success-color) !important;
  border-color: var(--success-color) !important;
  color: white !important;
}

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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes loading-pulse {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.8;
  }
  40% {
    transform: translateY(-5px);
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
</style>