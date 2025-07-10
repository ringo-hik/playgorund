<template>
  <div :class="['loading-spinner-container', { 'with-text': showText }]">
    <div :class="['spinner', size, variant]" v-if="!dots"></div>
    
    <!-- 점 스타일 로딩 -->
    <div v-if="dots" class="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    
    <span v-if="showText" class="loading-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'white', 'luxury'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    dots: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showText() {
      return this.text && this.text.length > 0;
    }
  }
};
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-spinner-container.with-text {
  flex-direction: column;
  gap: 16px;
}

/* 기본 스피너 스타일 */
.spinner {
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  border-style: solid;
}

/* 크기 변형 */
.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.spinner.medium {
  width: 26px;
  height: 26px;
  border-width: 2px;
}

.spinner.large {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

/* 색상 변형 */
.spinner.primary {
  border-color: var(--primary-gray);
  border-top-color: var(--primary-blue);
}

.spinner.white {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

.spinner.luxury {
  border-color: var(--primary-gray);
  border-top-color: var(--luxury-cyan);
}

/* 점 스타일 로딩 */
.dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dots span {
  width: 6px;
  height: 6px;
  background: var(--primary-blue);
  border-radius: var(--radius-full);
  animation: loading-pulse 1.4s ease-in-out infinite both;
}

.dots span:nth-child(2) {
  animation-delay: 0.16s;
}

.dots span:nth-child(3) {
  animation-delay: 0.32s;
}

/* 텍스트 스타일 */
.loading-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.4;
}

/* 애니메이션 */
@keyframes spin {
  100% { 
    transform: rotate(360deg); 
  }
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

/* 반응형 조정 */
@media (max-width: 640px) {
  .spinner.medium {
    width: 20px;
    height: 20px;
  }
  
  .spinner.large {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
  
  .loading-text {
    font-size: 13px;
  }
}
</style>