<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    :type="type"
  >
    <LoadingSpinner 
      v-if="loading" 
      size="small" 
      :variant="loadingVariant"
    />
    
    <unicon 
      v-if="icon && !loading" 
      :name="icon" 
      :fill="iconColor" 
      :width="iconSize" 
      :height="iconSize"
    />
    
    <span v-if="$slots.default || text" class="button-text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: 'LuxuryButton',
  components: { LoadingSpinner },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => [
        'primary', 'text', 'luxury-cyan', 'luxury-emerald', 
        'luxury-burgundy', 'luxury-sapphire', 'delete'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button',
      validator: value => ['button', 'submit', 'reset'].includes(value)
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      return [
        'luxury-btn',
        `luxury-btn--${this.variant}`,
        `luxury-btn--${this.size}`,
        {
          'luxury-btn--loading': this.loading,
          'luxury-btn--disabled': this.disabled,
          'luxury-btn--block': this.block,
          'luxury-btn--icon-only': this.icon && !this.$slots.default && !this.text
        }
      ];
    },
    
    iconColor() {
      if (this.variant === 'text') return 'var(--primary-blue)';
      if (this.variant === 'delete') return 'var(--surface-white)';
      return 'white';
    },
    
    iconSize() {
      const sizeMap = {
        small: 14,
        medium: 16,
        large: 18
      };
      return sizeMap[this.size] || 16;
    },
    
    loadingVariant() {
      return this.variant === 'text' ? 'primary' : 'white';
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
/* 기본 버튼 스타일 */
.luxury-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-smooth);
  border: 1px solid;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  outline: none;
}

.luxury-btn:focus {
  box-shadow: 0 0 0 3px rgba(var(--primary-blue), 0.2);
}

/* 크기 변형 */
.luxury-btn--small {
  padding: 6px 12px;
  font-size: 12px;
  min-height: 32px;
}

.luxury-btn--medium {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

.luxury-btn--large {
  padding: 12px 20px;
  font-size: 16px;
  min-height: 44px;
}

/* 아이콘 전용 버튼 */
.luxury-btn--icon-only.luxury-btn--small {
  padding: 6px;
  width: 32px;
}

.luxury-btn--icon-only.luxury-btn--medium {
  padding: 8px;
  width: 36px;
}

.luxury-btn--icon-only.luxury-btn--large {
  padding: 12px;
  width: 44px;
}

/* 블록 버튼 */
.luxury-btn--block {
  width: 100%;
}

/* 색상 변형 - Primary */
.luxury-btn--primary {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-sm);
}

.luxury-btn--primary:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: var(--primary-navy);
  border-color: var(--primary-navy);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 색상 변형 - Text */
.luxury-btn--text {
  background: rgba(74, 144, 226, 0.1);
  color: var(--text-secondary);
  border-color: var(--primary-blue);
  box-shadow: none;
}

.luxury-btn--text:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: rgba(74, 144, 226, 0.2);
  transform: translateY(-0.5px);
  box-shadow: var(--shadow-sm);
}

/* 색상 변형 - Luxury Cyan */
.luxury-btn--luxury-cyan {
  background: var(--luxury-cyan);
  color: white;
  border-color: var(--luxury-cyan);
  box-shadow: var(--shadow-sm);
}

.luxury-btn--luxury-cyan:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: var(--luxury-cyan-dark);
  border-color: var(--luxury-cyan-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 색상 변형 - Luxury Emerald */
.luxury-btn--luxury-emerald {
  background: var(--luxury-emerald);
  color: white;
  border-color: var(--luxury-emerald);
  box-shadow: var(--shadow-sm);
}

.luxury-btn--luxury-emerald:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: var(--luxury-emerald-dark);
  border-color: var(--luxury-emerald-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 색상 변형 - Luxury Burgundy */
.luxury-btn--luxury-burgundy {
  background: var(--luxury-burgundy);
  color: white;
  border-color: var(--luxury-burgundy);
  box-shadow: var(--shadow-sm);
}

.luxury-btn--luxury-burgundy:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: var(--luxury-burgundy-dark);
  border-color: var(--luxury-burgundy-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 색상 변형 - Luxury Sapphire */
.luxury-btn--luxury-sapphire {
  background: var(--luxury-sapphire);
  color: white;
  border-color: var(--luxury-sapphire);
  box-shadow: var(--shadow-sm);
}

.luxury-btn--luxury-sapphire:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: var(--luxury-sapphire-dark);
  border-color: var(--luxury-sapphire-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 색상 변형 - Delete */
.luxury-btn--delete {
  background: var(--delete-color);
  color: white;
  border-color: var(--delete-color);
  box-shadow: var(--shadow-sm);
}

.luxury-btn--delete:hover:not(.luxury-btn--disabled):not(.luxury-btn--loading) {
  background: var(--delete-hover);
  border-color: var(--delete-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 상태 - 비활성화 */
.luxury-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 상태 - 로딩 */
.luxury-btn--loading {
  cursor: wait;
  transform: none !important;
}

/* 버튼 텍스트 */
.button-text {
  line-height: 1;
  display: flex;
  align-items: center;
}

/* 반응형 조정 */
@media (max-width: 640px) {
  .luxury-btn--small {
    padding: 5px 10px;
    font-size: 11px;
    min-height: 28px;
  }
  
  .luxury-btn--medium {
    padding: 6px 12px;
    font-size: 12px;
    min-height: 32px;
  }
  
  .luxury-btn--large {
    padding: 8px 16px;
    font-size: 14px;
    min-height: 36px;
  }
}
</style>