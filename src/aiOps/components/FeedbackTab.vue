<template>
  <div class="feedback-tab">
    <div v-if="resultMessage" class="result" :class="resultType">
      <template v-if="resultType === 'success'">
        <LucideIcon name="check-circle" fill="var(--success-color)" :width="24" :height="24" />
        <div class="result-content">
          <h4>{{ getText('feedbackSuccess') }}</h4>
          <p>{{ resultMessage }}</p>
        </div>
      </template>

      <div v-if="resultType === 'success'" class="result-actions-separate">
        <Elements component-type="button" @click="resetForm" variant="primary" icon="star">
          {{ getText('sendAnother') }}
        </Elements>
        <Elements component-type="button" @click="$emit('go-home')" variant="accent" icon="home">
          {{ getText('goHome') }}
        </Elements>
      </div>

      <template v-if="resultType === 'error'">
        <LucideIcon name="alert-triangle" fill="var(--error-color)" :width="20" :height="20" />
        <span>{{ resultMessage }}</span>
      </template>
    </div>

    <div v-if="!resultMessage || resultType === 'error'" class="feedback-form">
      <div class="form-header">
        <LucideIcon name="heart" fill="var(--color-primary)" :width="32" :height="32" />
        <h3>{{ getText('feedbackTitle') }}</h3>
        <p>{{ getText('feedbackDescription') }}</p>
      </div>

      <div class="rating-section">
        <label class="section-label">
          <LucideIcon name="star" fill="var(--color-primary)" :width="16" :height="16" />
          {{ getText('ratingLabel') }}
        </label>

        <Elements component-type="rating" v-model="selectedRating" :disabled="isSubmitting" :show-text="true" size="md"
          @change="clearResult" />
      </div>

      <div class="comment-section">
        <label class="section-label" for="feedback-comment">
          <LucideIcon name="edit" fill="var(--color-primary)" :width="16" :height="16" />
          {{ getText('feedbackComment') }}
          <span class="required">*</span>
        </label>

        <textarea id="feedback-comment" v-model="comment" :placeholder="getText('commentPlaceholder')" maxlength="1000"
          @input="updateCharCount" class="comment-textarea form-input form-textarea" :disabled="isSubmitting"
          required />

        <div class="char-count">
          {{ comment.length }} / 1000
        </div>
      </div>

      <div class="form-actions">
        <Elements component-type="button" @click="submitFeedback" :disabled="!isFormValid" :loading="isSubmitting"
          variant="primary" icon="send" size="lg" block class="submit-btn">
          {{ getText('submitFeedback') }}
        </Elements>

        <Elements component-type="button" @click="$emit('go-home')" variant="outline" icon="home" size="lg" block
          class="home-btn">
          {{ getText('goHome') }}
        </Elements>
      </div>
    </div>
  </div>
</template>

<script>
import { getText, getTextArray } from '../utils/i18n';
import Elements from './Elements.vue';
import LucideIcon from './LucideIcon.vue';

export default {
  name: 'FeedbackTab',
  components: {
    Elements,
    LucideIcon
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
/* Component-specific layout only - all styling moved to centralized system */

/* Feedback tab height and layout */
.feedback-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) var(--space-xl) var(--space-xl);
  box-sizing: border-box;
  overflow: hidden;
}

/* Comment textarea specific sizing */
.comment-textarea {
  flex: 1;
  min-height: 120px;
  resize: vertical;
  margin-bottom: 0;
}

/* Button sizing overrides for feedback form */
.submit-btn,
.home-btn {
  height: 48px !important;
  min-height: 48px !important;
}

/* Result section layout variants */
.result.success {
  flex-direction: column;
  text-align: center;
}

.result.error {
  flex-direction: row;
  text-align: left;
}

/* Required field indicator */
.required {
  color: var(--color-error);
  margin-left: 2px;
}
</style>