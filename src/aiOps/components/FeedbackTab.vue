<template>
  <div class="feedback-tab">
    <div v-if="resultMessage" class="result" :class="resultType">
      <template v-if="resultType === 'success'">
        <unicon name="check-circle" fill="var(--success-color)" :width="24" :height="24" />
        <div class="result-content">
          <h4>{{ getText('feedbackSuccess') }}</h4>
          <p>{{ resultMessage }}</p>
        </div>
        <div class="result-actions">
          <Elements
            component-type="button"
            @click="resetForm"
            variant="primary"
            icon="plus"
          >
            {{ getText('sendAnother') }}
          </Elements>
          <Elements
            component-type="button"
            @click="$emit('go-home')"
            variant="accent"
            icon="home"
          >
            {{ getText('goHome') }}
          </Elements>
        </div>
      </template>
      
      <template v-if="resultType === 'error'">
        <unicon name="exclamation-triangle" fill="var(--error-color)" :width="20" :height="20" />
        <span>{{ resultMessage }}</span>
      </template>
    </div>

    <div v-if="!resultMessage || resultType === 'error'" class="feedback-form">
      <div class="form-header">
        <unicon name="heart" fill="var(--primary-color)" :width="32" :height="32" />
        <h3>{{ getText('feedbackTitle') }}</h3>
        <p>{{ getText('feedbackDescription') }}</p>
      </div>

      <div class="rating-section">
        <label class="section-label">
          <unicon name="star" fill="var(--primary-color)" :width="16" :height="16" />
          {{ getText('ratingLabel') }}
        </label>
        
        <Elements
          component-type="rating"
          v-model="selectedRating"
          :disabled="isSubmitting"
          :show-text="true"
          :text-labels="ratingTexts"
          size="md"
          @change="clearResult"
        />
      </div>

      <div class="comment-section">
        <label class="section-label" for="feedback-comment">
          <unicon name="edit" fill="var(--primary-color)" :width="16" :height="16" />
          {{ getText('feedbackComment') }}
          <span class="required">*</span>
        </label>
        
        <textarea 
          id="feedback-comment"
          v-model="comment" 
          :placeholder="getText('commentPlaceholder')"
          maxlength="1000"
          @input="updateCharCount"
          class="comment-textarea form-input form-textarea"
          :disabled="isSubmitting"
          required
        />
        
        <div class="char-count">
          {{ comment.length }} / 1000
        </div>
      </div>

      <div class="form-actions">
        <Elements
          component-type="button"
          @click="submitFeedback" 
          :disabled="!isFormValid" 
          :loading="isSubmitting"
          variant="primary"
          icon="message"
          size="lg"
          block
          class="submit-btn"
        >
          {{ getText('submitFeedback') }}
        </Elements>
        
        <Elements
          component-type="button"
          @click="$emit('go-home')" 
          variant="outline"
          icon="home"
          size="lg"
          block
          class="home-btn"
        >
          {{ getText('goHome') }}
        </Elements>
      </div>
    </div>
  </div>
</template>

<script>
import { getText, getTextArray } from './utils/i18n';
import Elements from './components/Elements.vue';

export default {
  name: 'FeedbackTab',
  components: {
    Elements
  },
  
  props: {
    currentLanguage: {
      type: String,
      default: 'ko',
      validator: value => ['ko', 'en'].includes(value)
    }
  },
  
  data() {
    return {
      selectedRating: 0,
      comment: '',
      isSubmitting: false,
      resultMessage: '',
      resultType: '',
    };
  },
  
  computed: {
    ratingTexts() {
      return getTextArray(this.currentLanguage, 'ratingTexts');
    },
    
    isFormValid() {
      return this.comment.trim().length > 0;
    }
  },
  
  methods: {
    getText(key, params = {}) {
      return getText(this.currentLanguage, key, params);
    },
    
    updateCharCount() {
      this.clearResult();
    },
    
    clearResult() {
      if (this.resultMessage && this.resultType === 'error') {
        this.resultMessage = '';
        this.resultType = '';
      }
    },
    
    submitFeedback() {
      if (!this.isFormValid || this.isSubmitting) return;
      
      this.isSubmitting = true;
      this.resultMessage = '';
      this.resultType = '';
      
      const feedbackData = {
        rating: this.selectedRating || null,
        comment: this.comment.trim()
      };
      
      this.$emit('feedback-sent', feedbackData);
    },
    
    showSuccess(message) {
      this.isSubmitting = false;
      this.resultMessage = message || this.getText('feedbackSuccess');
      this.resultType = 'success';
    },
    
    showError(message) {
      this.isSubmitting = false;
      this.resultMessage = message || 'An error occurred while sending feedback.';
      this.resultType = 'error';
    },
    
    resetForm() {
      this.selectedRating = 0;
      this.comment = '';
      this.isSubmitting = false;
      this.resultMessage = '';
      this.resultType = '';
    }
  }
};
</script>

<style scoped>
.feedback-tab {
  height: 100%;
  background: var(--surface-light);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl);
  box-sizing: border-box;
  overflow: hidden;
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  flex-shrink: 0;
}

.form-header h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
}

.form-header p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.feedback-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.rating-section {
  flex-shrink: 0;
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.rating-section:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-md);
}

.comment-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  min-height: 0;
}

.comment-section:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-md);
}

.section-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
}

.required {
  color: var(--error-color);
  margin-left: 2px;
}

.comment-textarea {
  flex: 1;
  min-height: 120px;
  background: var(--surface-light);
  margin-bottom: 0;
  resize: vertical;
}

.comment-textarea:focus {
  background: var(--surface-white);
}

.char-count {
  text-align: right;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--spacing-sm);
  font-weight: 500;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.submit-btn,
.home-btn {
  height: 48px !important;
  min-height: 48px !important;
}

.result {
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.result.success {
  border-color: var(--success-color);
  background: #f0fdf4;
  flex-direction: column;
  text-align: center;
}

.result.error {
  border-color: var(--error-color);
  background: #fef2f2;
  color: var(--error-color);
  flex-direction: row;
  text-align: left;
}

.result-content h4 {
  margin: 0 0 6px 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.result-content p {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

@media (max-width: 640px) {
  .feedback-tab {
    padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  }
  
  .form-header {
    margin-bottom: var(--spacing-lg);
  }
  
  .rating-section,
  .comment-section {
    padding: var(--spacing-md);
  }
  
  .submit-btn,
  .home-btn {
    height: 44px !important;
    min-height: 44px !important;
    font-size: var(--font-size-sm) !important;
  }
  
  .result-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .result-actions .premium-button {
    width: 100%;
    justify-content: center;
  }
}
</style>