<template>
  <div class="feedback-tab">
    <ResultMessage 
      v-if="resultMessage"
      :type="resultType"
      :message="resultMessage"
      :title="resultType === 'success' ? getText('feedbackSuccess') : ''"
      :show="!!resultMessage"
      :show-dismiss="resultType === 'success'"
      :action-text="resultType === 'success' ? getText('sendAnother') : ''"
      @action="resetForm"
      @dismiss="clearResult"
    >
      <template v-if="resultType === 'success'" #default>
        <div class="result-actions">
          <LuxuryButton 
            @click="resetForm" 
            variant="luxury-cyan"
            icon="plus"
            :text="getText('sendAnother')"
          />
          <LuxuryButton 
            @click="$emit('go-home')" 
            variant="luxury-emerald"
            icon="home"
            :text="getText('goHome')"
          />
        </div>
      </template>
    </ResultMessage>

    <div v-if="!resultMessage || resultType === 'error'" class="feedback-form">
      <div class="form-header">
        <unicon name="heart" fill="#318CE7" :width="32" :height="32" />
        <h3>{{ getText('feedbackTitle') }}</h3>
        <p>{{ getText('feedbackDescription') }}</p>
      </div>

      <div class="rating-section">
        <div class="rating-stars">
          <button 
            v-for="star in 5" 
            :key="star"
            @click="setRating(star)"
            :class="['star', { 
              active: star <= selectedRating, 
              hover: star <= hoverRating 
            }]"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            type="button"
          >
            <unicon 
              name="star" 
              :fill="getStarFill(star)" 
              :width="18" 
              :height="18"
            />
          </button>
        </div>
      </div>

      <div class="comment-section">
        <FormField 
          v-model="comment" 
          type="textarea"
          :label="getText('feedbackComment')"
          :placeholder="getText('commentPlaceholder')"
          :max-length="1000"
          :show-char-count="true"
          icon="edit"
          rows="6"
          @input="updateCharCount"
        />
      </div>

      <div class="form-actions">
        <LuxuryButton 
          @click="submitFeedback" 
          :disabled="!isFormValid || isSubmitting" 
          variant="luxury-cyan"
          icon="message"
          :text="isSubmitting ? getText('submitting') : getText('submitFeedback')"
          :loading="isSubmitting"
        />
        
        <LuxuryButton 
          @click="$emit('go-home')" 
          variant="luxury-emerald"
          icon="home"
          :text="getText('goHome')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from './components/LoadingSpinner.vue';
import LuxuryButton from './components/LuxuryButton.vue';
import FormField from './components/FormField.vue';
import ResultMessage from './components/ResultMessage.vue';

export default {
  name: 'FeedbackTab',
  components: { LoadingSpinner, LuxuryButton, FormField, ResultMessage },
  
  props: {
    currentLanguage: {
      type: String,
      default: 'ko'
    }
  },
  
  data() {
    return {
      selectedRating: 0,
      hoverRating: 0,
      comment: '',
      isSubmitting: false,
      resultMessage: '',
      resultType: '',
    };
  },
  
  computed: {
    texts() {
      return {
        ko: {
          feedbackTitle: '피드백 보내기',
          feedbackDescription: '서비스 개선을 위해 소중한 의견을 들려주세요.',
          feedbackComment: '피드백 의견',
          commentPlaceholder: '서비스에 대한 의견이나 개선사항을 자유롭게 작성해주세요.\n\n• 좋았던 점이나 아쉬웠던 점\n• 개선되었으면 하는 기능\n• 추가로 필요한 기능 등',
          submitFeedback: '피드백 보내기',
          submitting: '전송 중...',
          feedbackSuccess: '피드백 전송 완료',
          sendAnother: '다른 피드백 보내기',
          goHome: '홈으로 가기'
        },
        en: {
          feedbackTitle: 'Send Feedback',
          feedbackDescription: 'Please share your valuable opinions to help us improve our service.',
          feedbackComment: 'Feedback Comments',
          commentPlaceholder: 'Please freely write your opinions or suggestions about the service.\n\n• What you liked or found lacking\n• Features you\'d like to see improved\n• Additional features needed, etc.',
          submitFeedback: 'Send Feedback',
          submitting: 'Submitting...',
          feedbackSuccess: 'Feedback Sent Successfully',
          sendAnother: 'Send Another Feedback',
          goHome: 'Go Home'
        }
      }[this.currentLanguage];
    },
    
    isFormValid() {
      return this.comment.trim().length > 0;
    }
  },
  
  methods: {
    getText(key) {
      return this.texts[key] || key;
    },
    
    setRating(rating) {
      this.selectedRating = rating;
      this.clearResult();
    },
    
    getStarFill(star) {
      if (star <= this.selectedRating || star <= this.hoverRating) {
        return '#C8A257';
      }
      return '#CBD1DA';
    },
    
    updateCharCount() {
      this.clearResult();
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
      this.hoverRating = 0;
      this.comment = '';
      this.isSubmitting = false;
      this.resultMessage = '';
      this.resultType = '';
    },
    
    clearResult() {
      this.resultMessage = '';
      this.resultType = '';
    }
  }
};
</script>

<style scoped>
.feedback-tab {
  height: 100%;
  background: var(--bg-light);
  display: flex;
  flex-direction: column;
  padding: 16px 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.form-header {
  text-align: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.form-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
}

.form-header p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.feedback-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-white);
  border: 1px solid var(--border-gray);
  border-radius: 10px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  min-height: 0;
}

.comment-section:hover {
  border-color: var(--primary-gold);
  box-shadow: var(--shadow-md);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.comment-textarea {
  flex: 1;
  min-height: 120px;
  background: var(--bg-light);
  margin-bottom: 0;
}

.comment-textarea:focus {
  background: var(--surface-white);
}

.char-count {
  text-align: right;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 8px;
  font-weight: 500;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  flex-shrink: 0;
  margin-bottom: 2px;
}

.rating-stars {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.star {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.star:hover {
  background: var(--bg-light);
  border-color: var(--primary-gold);
  transform: translateY(-1px);
}

.star.active,
.star.hover {
  background: rgba(200, 162, 87, 0.1);
  border-color: var(--primary-gold);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.submit-btn,
.home-btn {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-md);
  font-size: 14px;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.submit-btn::before,
.home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover::before,
.home-btn:hover::before {
  left: 100%;
}

.result {
  background: var(--surface-white);
  border: 1px solid var(--border-gray);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
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
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.result-content p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-smooth);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 640px) {
  .feedback-tab {
    padding: 12px 16px 16px;
  }
  
  .form-header {
    margin-bottom: 16px;
  }
  
  .comment-section {
    padding: 14px;
  }
  
  .rating-section {
    padding: 12px 0;
  }
  
  .rating-stars {
    gap: 4px;
  }
  
  .star {
    width: 28px;
    height: 28px;
  }
  
  .submit-btn,
  .home-btn {
    height: 44px;
    font-size: 13px;
  }
  
  .result-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>