<template>
  <div :class="['form-field', { 'form-field--error': hasError, 'form-field--focused': isFocused }]">
    <!-- 라벨 -->
    <label 
      v-if="label" 
      :for="fieldId" 
      :class="['field-label', { 'field-label--required': required }]"
    >
      <unicon v-if="icon" :name="icon" :width="16" :height="16" />
      {{ label }}
    </label>
    
    <!-- 텍스트 에리어 -->
    <textarea
      v-if="type === 'textarea'"
      :id="fieldId"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength"
      :rows="rows"
      :class="fieldClasses"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      ref="field"
    ></textarea>
    
    <!-- 인풋 필드 -->
    <input
      v-else
      :id="fieldId"
      :type="inputType"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength"
      :class="fieldClasses"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      ref="field"
    />
    
    <!-- 글자 수 표시 -->
    <div v-if="showCharCount && maxLength" class="char-count">
      <span :class="{ 'char-count--warning': isNearLimit, 'char-count--error': isOverLimit }">
        {{ currentLength }}
      </span>
      / {{ maxLength }}
    </div>
    
    <!-- 에러 메시지 -->
    <div v-if="hasError" class="field-error">
      <unicon name="exclamation-triangle" fill="var(--error-color)" :width="14" :height="14" />
      {{ errorMessage }}
    </div>
    
    <!-- 도움말 텍스트 -->
    <div v-if="helpText && !hasError" class="field-help">
      {{ helpText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    type: {
      type: String,
      default: 'text',
      validator: value => ['text', 'email', 'password', 'url', 'tel', 'textarea'].includes(value)
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: null
    },
    rows: {
      type: Number,
      default: 4
    },
    errorMessage: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    },
    showCharCount: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    }
  },
  data() {
    return {
      isFocused: false,
      fieldId: `field-${Math.random().toString(36).substr(2, 9)}`
    };
  },
  computed: {
    inputType() {
      return this.type === 'textarea' ? 'text' : this.type;
    },
    
    fieldClasses() {
      return [
        'field-input',
        `field-input--${this.size}`,
        {
          'field-input--disabled': this.disabled,
          'field-input--readonly': this.readonly,
          'field-input--error': this.hasError,
          'field-input--textarea': this.type === 'textarea'
        }
      ];
    },
    
    hasError() {
      return this.errorMessage && this.errorMessage.length > 0;
    },
    
    currentLength() {
      return String(this.value || '').length;
    },
    
    isNearLimit() {
      if (!this.maxLength) return false;
      return this.currentLength >= this.maxLength * 0.8;
    },
    
    isOverLimit() {
      if (!this.maxLength) return false;
      return this.currentLength > this.maxLength;
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
      this.$emit('change', event.target.value);
    },
    
    handleFocus(event) {
      this.isFocused = true;
      this.$emit('focus', event);
    },
    
    handleBlur(event) {
      this.isFocused = false;
      this.$emit('blur', event);
    },
    
    handleKeydown(event) {
      this.$emit('keydown', event);
      
      // Enter 키 처리
      if (event.key === 'Enter' && this.type !== 'textarea') {
        event.preventDefault();
        this.$emit('enter', event);
      }
    },
    
    focus() {
      if (this.$refs.field) {
        this.$refs.field.focus();
      }
    },
    
    blur() {
      if (this.$refs.field) {
        this.$refs.field.blur();
      }
    }
  }
};
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 라벨 스타일 */
.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.field-label--required::after {
  content: '*';
  color: var(--error-color);
  margin-left: 2px;
}

/* 입력 필드 공통 스타일 */
.field-input {
  width: 100%;
  background: var(--surface-white);
  border: 1px solid var(--border-gray);
  border-radius: 6px;
  font-family: inherit;
  color: var(--text-primary);
  transition: all var(--transition-smooth);
  outline: none;
  resize: vertical;
}

.field-input:focus {
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 2px rgba(212, 184, 150, 0.2);
  transform: translateY(-1px);
}

.field-input::placeholder {
  color: var(--text-muted);
  font-style: italic;
}

/* 크기 변형 */
.field-input--small {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.4;
}

.field-input--medium {
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;
}

.field-input--large {
  padding: 12px 16px;
  font-size: 15px;
  line-height: 1.5;
}

/* 텍스트에리어 특별 처리 */
.field-input--textarea {
  resize: vertical;
  min-height: 80px;
}

/* 상태별 스타일 */
.field-input--disabled {
  background: var(--bg-medium);
  color: var(--text-muted);
  cursor: not-allowed;
  border-color: var(--border-light);
}

.field-input--readonly {
  background: var(--bg-light);
  border-color: var(--border-light);
}

.field-input--error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 1px var(--error-color);
}

.field-input--error:focus {
  border-color: var(--error-color);
  box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.2);
}

/* 글자 수 표시 */
.char-count {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: -2px;
}

.char-count--warning {
  color: var(--luxury-burgundy);
  font-weight: 600;
}

.char-count--error {
  color: var(--error-color);
  font-weight: 600;
}

/* 에러 메시지 */
.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--error-color);
  font-weight: 500;
  margin-top: -2px;
}

/* 도움말 텍스트 */
.field-help {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-top: -2px;
}

/* 포커스 상태 */
.form-field--focused .field-label {
  color: var(--primary-blue);
}

/* 에러 상태 */
.form-field--error .field-label {
  color: var(--error-color);
}

/* 반응형 조정 */
@media (max-width: 640px) {
  .field-label {
    font-size: 13px;
  }
  
  .field-input--small {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .field-input--medium {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .field-input--large {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .field-error,
  .field-help,
  .char-count {
    font-size: 12px;
  }
}
</style>