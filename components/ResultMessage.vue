<template>
  <div :class="messageClasses" v-if="show">
    <div class="result-icon">
      <unicon 
        :name="iconName" 
        :fill="iconColor" 
        :width="iconSize" 
        :height="iconSize"
      />
    </div>
    
    <div class="result-content">
      <h4 v-if="title" class="result-title">{{ title }}</h4>
      <p class="result-text">{{ message }}</p>
      
      <div v-if="showAction" class="result-actions">
        <LuxuryButton 
          v-if="actionText"
          :variant="actionVariant"
          size="small"
          @click="handleAction"
        >
          {{ actionText }}
        </LuxuryButton>
        
        <LuxuryButton 
          v-if="showDismiss"
          variant="text"
          size="small"
          @click="handleDismiss"
        >
          {{ dismissText }}
        </LuxuryButton>
      </div>
    </div>
    
    <button 
      v-if="dismissible" 
      @click="handleDismiss"
      class="result-close"
      :title="dismissText"
    >
      <unicon name="times" fill="currentColor" :width="14" :height="14" />
    </button>
  </div>
</template>

<script>
import LuxuryButton from './LuxuryButton.vue';

export default {
  name: 'ResultMessage',
  components: { LuxuryButton },
  props: {
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    message: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    autoHide: {
      type: [Boolean, Number],
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    actionText: {
      type: String,
      default: ''
    },
    dismissText: {
      type: String,
      default: '닫기'
    },
    showDismiss: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      autoHideTimer: null
    };
  },
  computed: {
    messageClasses() {
      return [
        'result-message',
        `result-message--${this.type}`,
        `result-message--${this.size}`,
        {
          'result-message--dismissible': this.dismissible
        }
      ];
    },
    
    iconName() {
      const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
      };
      return iconMap[this.type] || 'info-circle';
    },
    
    iconColor() {
      const colorMap = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--luxury-burgundy)',
        info: 'var(--primary-blue)'
      };
      return colorMap[this.type] || 'var(--primary-blue)';
    },
    
    iconSize() {
      const sizeMap = {
        small: 16,
        medium: 20,
        large: 24
      };
      return sizeMap[this.size] || 20;
    },
    
    showAction() {
      return this.actionText || this.showDismiss;
    },
    
    actionVariant() {
      const variantMap = {
        success: 'luxury-emerald',
        error: 'delete',
        warning: 'luxury-burgundy',
        info: 'primary'
      };
      return variantMap[this.type] || 'primary';
    }
  },
  watch: {
    show(newValue) {
      if (newValue && this.autoHide) {
        this.startAutoHide();
      } else {
        this.clearAutoHide();
      }
    }
  },
  mounted() {
    if (this.show && this.autoHide) {
      this.startAutoHide();
    }
  },
  beforeDestroy() {
    this.clearAutoHide();
  },
  methods: {
    handleDismiss() {
      this.clearAutoHide();
      this.$emit('dismiss');
      this.$emit('update:show', false);
    },
    
    handleAction() {
      this.$emit('action');
    },
    
    startAutoHide() {
      this.clearAutoHide();
      const delay = typeof this.autoHide === 'number' ? this.autoHide : 5000;
      this.autoHideTimer = setTimeout(() => {
        this.handleDismiss();
      }, delay);
    },
    
    clearAutoHide() {
      if (this.autoHideTimer) {
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = null;
      }
    }
  }
};
</script>

<style scoped>
.result-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
  background: var(--surface-white);
  box-shadow: var(--shadow-sm);
  position: relative;
  transition: all var(--transition-smooth);
}

/* 크기 변형 */
.result-message--small {
  padding: 12px;
  gap: 8px;
}

.result-message--small .result-icon {
  margin-top: 1px;
}

.result-message--large {
  padding: 20px;
  gap: 16px;
}

/* 타입별 색상 */
.result-message--success {
  border-color: var(--success-color);
  background: rgba(72, 187, 120, 0.05);
}

.result-message--error {
  border-color: var(--error-color);
  background: rgba(229, 62, 62, 0.05);
}

.result-message--warning {
  border-color: var(--luxury-burgundy);
  background: rgba(184, 134, 11, 0.05);
}

.result-message--info {
  border-color: var(--primary-blue);
  background: rgba(74, 144, 226, 0.05);
}

/* 아이콘 영역 */
.result-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

/* 콘텐츠 영역 */
.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.result-message--small .result-title {
  font-size: 14px;
}

.result-message--large .result-title {
  font-size: 18px;
  margin-bottom: 6px;
}

.result-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  word-break: break-word;
}

.result-message--small .result-text {
  font-size: 13px;
}

.result-message--large .result-text {
  font-size: 15px;
}

/* 액션 버튼 영역 */
.result-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.result-message--small .result-actions {
  margin-top: 8px;
  gap: 6px;
}

.result-message--large .result-actions {
  margin-top: 16px;
  gap: 12px;
}

/* 닫기 버튼 */
.result-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

.result-message--dismissible {
  padding-right: 40px;
}

.result-message--dismissible.result-message--small {
  padding-right: 36px;
}

.result-message--dismissible.result-message--large {
  padding-right: 48px;
}

/* 반응형 조정 */
@media (max-width: 640px) {
  .result-message {
    padding: 12px;
    gap: 10px;
  }
  
  .result-title {
    font-size: 14px;
  }
  
  .result-text {
    font-size: 13px;
  }
  
  .result-actions {
    margin-top: 10px;
    gap: 6px;
  }
  
  .result-message--dismissible {
    padding-right: 32px;
  }
}
</style>