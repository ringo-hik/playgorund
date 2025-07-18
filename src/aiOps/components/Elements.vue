<template>
  <div>
    <!-- 버튼 컴포넌트 -->
    <component v-if="componentType === 'button'" :is="'button'" :class="buttonClasses" :disabled="disabled || loading"
      :type="type" @click="handleClick">
      <Elements v-if="loading" component-type="spinner" :size="size" class="ai-chatops-button__spinner" />

      <LucideIcon v-if="icon && !loading" :name="icon" fill="currentColor" :width="iconSize" :height="iconSize"
        class="ai-chatops-button__icon" />

      <span v-if="$slots.default" class="ai-chatops-button__text">
        <slot />
      </span>
    </component>

    <!-- 스피너 컴포넌트 -->
    <div v-if="componentType === 'spinner'" :class="spinnerClasses" role="status">
      <span class="sr-only">{{ loadingText }}</span>
    </div>

    <!-- 별점 컴포넌트 -->
    <div v-if="componentType === 'rating'" class="star-rating">
      <div class="star-rating__stars">
        <button v-for="star in maxRating" :key="star" :class="getStarClasses(star)" @click="selectRating(star)"
          @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0" @focus="hoverRating = star"
          @blur="hoverRating = 0" :disabled="disabled" type="button">
          <LucideIcon name="star" :fill="getStarFill(star)" :width="starIconSize" :height="starIconSize" />
        </button>
      </div>
    </div>

    <!-- 메시지 컴포넌트 -->
    <div v-if="componentType === 'message'" :class="['message', `message--${messageType}`]">
      <div :class="messageClasses">
        <template v-if="isCurrentlyLoading">
          <div class="message-bubble__loading">
            <div class="loading-text">{{ dynamicLoadingMessage }}</div>
          </div>
        </template>

        <template v-else>
          <div v-if="effectiveMessageType === 'user'" class="user-message-brand">
            <div v-if="timestamp" class="message-timestamp">
              {{ formatTimestamp(timestamp) }}
            </div>
            <div class="user-badge">
              <LucideIcon name="user" fill="currentColor" :width="14" :height="14" />
              <span>USER</span>
            </div>
          </div>

          <div v-if="effectiveMessageType === 'ai'" class="bot-message-brand">
            <div class="bot-badge">
              <LucideIcon name="robot" fill="currentColor" :width="14" :height="14" />
              <span>Bot</span>
            </div>
            <div v-if="timestamp" class="message-timestamp">
              {{ formatTimestamp(timestamp) }}
            </div>
          </div>

          <div class="message-bubble__content" v-html="formattedContent"></div>

          <div v-if="effectiveMessageType === 'ai' && !isError && !isCurrentlyLoading" class="message-bubble__actions">
            <button v-if="showCopy"
              :class="['message-action', 'message-action--copy', 'btn-system', 'btn-system--ghost', 'btn-system--sm', 'btn-system--icon-only', { 'message-action--copied': effectiveCopyStatus === 'copied' }]"
              @click="handleCopy">
              <LucideIcon :name="effectiveCopyStatus === 'copied' ? 'check' : 'copy'" fill="currentColor" :width="12"
                :height="12" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import LucideIcon from './LucideIcon.vue';
import { getTextArray } from '../utils/i18n.js';
import aiChatOpsService from '../service/aiChatOpsService.js';

export default {
  name: 'Elements',
  components: {
    LucideIcon
  },

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

    // 별점 관련 props
    value: { type: Number, default: 0 },
    maxRating: { type: Number, default: 5 },
    showText: { type: Boolean, default: false },

    // 메시지 관련 props
    message: { type: Object, default: () => ({}) },
    messageType: { type: String, default: 'user' },
    content: { type: [String, Number], default: '' },
    loadingMessage: { type: String, default: '응답을 생성하고 있습니다' },
    isError: { type: Boolean, default: false },
    showCopy: { type: Boolean, default: true },
    copyStatus: { type: String, default: null },
    timestamp: { type: [Number, String, Date], default: null },
    currentLanguage: { type: String, default: 'ko' }
  },

  data() {
    return {
      hoverRating: 0,
      localCopyStatus: null,
      dotCount: 0,
      dotInterval: null,
      messageInterval: null,
      currentLoadingMessage: '',
      selectedRating: 0 // 선택된 별점 유지용
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
      const msgType = this.message?.type || this.messageType;
      return [
        'message-bubble',
        `message-bubble--${msgType}`,
        {
          'message-bubble--loading': this.isCurrentlyLoading,
          'message-bubble--error': this.message?.isError || this.isError
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
      return this.hoverRating || this.selectedRating || this.value;
    },

    formattedContent() {
      const content = this.message?.content || this.content || '';
      const contentStr = String(content);
      
      // 콘텐츠 타입에 따라 적절히 포맷팅
      return aiChatOpsService.formatContentForDisplay(contentStr);
    },

    effectiveTimestamp() {
      return this.message?.timestamp || this.timestamp;
    },

    effectiveMessageType() {
      return this.message?.type || this.messageType;
    },

    effectiveCopyStatus() {
      return this.localCopyStatus || this.copyStatus;
    },

    dynamicLoadingMessage() {
      const dots = '.'.repeat(this.dotCount === 0 ? 1 : this.dotCount); // 1-5개 점 표시
      const baseMessage = this.currentLoadingMessage || this.getRandomLoadingMessage();
      return baseMessage + dots;
    },

    isCurrentlyLoading() {
      return this.loading || this.message?.isLoading || false;
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
      // 선택된 별점을 상태로 유지
      this.selectedRating = rating;
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
      const isActive = star <= this.currentRating;
      return isActive ? '#F59E0B' : 'none';
    },

    handleCopy() {
      this.localCopyStatus = 'copied';

      // 메시지 데이터 전달
      const messageData = this.message || {
        content: this.content,
        id: Date.now(),
        type: this.messageType
      };

      this.$emit('copy-message', messageData);

      // 2초 후 상태 리셋
      setTimeout(() => {
        this.localCopyStatus = null;
      }, 2000);
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return '';

      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) {
        return '방금 전';
      }

      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}분 전`;
      }

      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}시간 전`;
      }

      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    startDotAnimation() {
      this.dotCount = 0;
      this.currentLoadingMessage = this.getRandomLoadingMessage();

      // 점 애니메이션 (0.3초 간격, 5개 점)
      this.dotInterval = setInterval(() => {
        this.dotCount = (this.dotCount + 1) % 6; // 0-5 사이클 (5개 점)
      }, 300);

      // 메시지 변경 (1.5초 간격)
      this.messageInterval = setInterval(() => {
        this.currentLoadingMessage = this.getRandomLoadingMessage();
      }, 1500);
    },

    stopDotAnimation() {
      if (this.dotInterval) {
        clearInterval(this.dotInterval);
        this.dotInterval = null;
      }
      if (this.messageInterval) {
        clearInterval(this.messageInterval);
        this.messageInterval = null;
      }
    },

    getRandomLoadingMessage() {
      const messages = getTextArray(this.currentLanguage, 'loadingMessages');
      if (messages && messages.length > 0) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
      }

      return this.currentLanguage === 'ko' ?
        '응답을 생성하고 있습니다' :
        'Generating response';
    }
  },

  watch: {
    isCurrentlyLoading(newVal) {
      if (newVal) {
        this.startDotAnimation();
      } else {
        this.stopDotAnimation();
      }
    },
    
    value(newVal) {
      // prop으로 전달된 값이 변경되면 내부 상태도 업데이트
      this.selectedRating = newVal;
    }
  },

  mounted() {
    if (this.isCurrentlyLoading) {
      this.startDotAnimation();
    }
    
    // 초기 선택된 별점 설정
    this.selectedRating = this.value;
  },

  beforeDestroy() {
    this.stopDotAnimation();
    this.currentLoadingMessage = '';
  }
};
</script>

<style scoped>
/* ----- 스피너 스타일 ----- */
.loading-spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

.loading-spinner--sm {
  width: 12px;
  height: 12px;
}

.loading-spinner--md {
  width: 16px;
  height: 16px;
}

.loading-spinner--lg {
  width: 20px;
  height: 20px;
}

.loading-spinner--centered {
  margin: 0 auto;
}

.loading-spinner--primary {
  border-top-color: var(--color-primary);
}

.loading-spinner--accent {
  border-top-color: var(--color-accent);
}

/* ----- 별점 스타일 ----- */
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
  width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  background: transparent !important;
  border: 1px solid var(--color-border-light) !important;
  border-radius: var(--radius-md) !important;
  transition: all var(--motion-normal) !important;
  cursor: pointer !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.star-rating__star:hover:not(.star-rating__star--disabled) {
  background: var(--color-accent-subtle) !important;
  border-color: var(--color-accent) !important;
  box-shadow: var(--shadow-soft) !important;
  transform: scale(1.1) !important;
}

.star-rating__star--active:not(.star-rating__star--disabled) {
  background: var(--color-accent-medium) !important;
  border-color: var(--color-accent) !important;
  transform: scale(1.05) !important;
}

.star-rating__star--disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

.star-rating__star--disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

.star-rating__star .lucide-icon {
  color: #F59E0B !important;
  stroke: #F59E0B !important;
  stroke-width: 1.5 !important;
  transform: translateZ(0) !important;
  backface-visibility: hidden !important;
  fill: none !important;
}

.star-rating__star--active .lucide-icon {
  fill: #F59E0B !important;
  color: #F59E0B !important;
  stroke: #F59E0B !important;
}

.star-rating__star--active .lucide-icon svg {
  fill: #F59E0B !important;
  stroke: #F59E0B !important;
}

.star-rating__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
  min-height: 20px;
  text-align: center;
  transition: all var(--motion-fast);
}

/* ----- 메시지 스타일 ----- */
.message {
  width: 100%;
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.3s var(--motion-normal);
  align-items: flex-start;
}

.message--user {
  align-items: flex-end;
}

.message--ai {
  margin-bottom: var(--space-xl);
  /* 복사 버튼 공간 확보 */
}

.message-bubble {
  width: 100%;
  position: relative;
  transition: all var(--motion-fast);
}

.message-bubble--user {
  max-width: 70%;
  min-width: 50px;
  width: fit-content;
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  margin-left: auto;
}

.message-bubble--user .message-bubble__content {
  background: var(--color-chat-bubble-user);
  color: var(--color-text-primary);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  line-height: 1.6;
  word-wrap: break-word;
  box-shadow: var(--shadow-minimal);
  margin-bottom: var(--space-md);
  text-align: left;
  display: inline-block;
  max-width: 100%;
}

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
  margin-bottom: var(--space-2xl);
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
  padding: var(--space-md) var(--space-lg) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-subtle) !important;
}

.message-bubble--ai .message-bubble__content {
  background: var(--color-chat-bubble-bot);
  color: var(--color-text-primary);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: -0.01em;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.user-message-brand {
  position: relative;
  margin-bottom: var(--space-sm);
  z-index: 2;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  gap: var(--space-sm);
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  background: linear-gradient(135deg, var(--color-accent));
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

.user-badge .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.bot-message-brand {
  position: relative;
  margin-bottom: var(--space-sm);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.bot-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  background: var(--color-accent);
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

.bot-badge .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.message-timestamp {
  font-size: 10px;
  color: var(--color-text-muted);
  font-weight: 400;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  backdrop-filter: blur(4px);
  white-space: nowrap;
  user-select: none;
  opacity: 0.8;
  transition: opacity var(--motion-fast);
}

.message-timestamp:hover {
  opacity: 1;
}

.message-bubble__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  text-align: center;
  width: 100%;
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
  font-size: 17px;
  /* 2px larger than normal 15px */
  color: var(--color-text-muted);
  font-weight: 500;
  text-align: center;
  width: 100%;
  display: block;
}

.message-bubble__content {
  word-wrap: break-word;
  line-height: 1.6;
  color: var(--color-text-primary);
  white-space: pre-wrap;
}

.message-bubble__actions {
  position: absolute;
  bottom: -35px;
  right: 0px;
  display: flex;
  gap: var(--space-sm);
  opacity: 1;
  transition: opacity var(--motion-fast);
  z-index: 3;
}

.message-action {
  width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid var(--color-border-medium) !important;
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
}

.message-action--copied:hover {
  background: #047857 !important;
  border-color: #047857 !important;
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

/* ----- 애니메이션 ----- */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-pulse {

  0%,
  80%,
  100% {
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

/* ----- 반응형 ----- */
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

  .bot-badge,
  .user-badge {
    font-size: 9px;
    padding: 2px 8px;
  }

  .message-timestamp {
    font-size: 9px;
    padding: 1px 4px;
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
</style>