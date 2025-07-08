<template>
  <div class="feedback-tab">
    <div v-if="resultMessage" class="result" :class="resultType">
      <template v-if="resultType === 'success'">
        <unicon name="check-circle" fill="#38B2AC" :width="24" :height="24"></unicon>
        <div>
          <h4>{{ getText('feedbackSuccess') }}</h4>
          <p>{{ resultMessage }}</p>
        </div>
        <button @click="resetForm" class="action-btn">
          <unicon name="plus" fill="#FFFFFF" :width="16" :height="16"></unicon>
          {{ getText('sendAnother') }}
        </button>
      </template>
      
      <template v-if="resultType === 'error'">
        <unicon name="exclamation-triangle" fill="#E53E3E" :width="20" :height="20"></unicon>
        <span>{{ resultMessage }}</span>
      </template>
    </div>

    <div v-if="!resultMessage || resultType === 'error'" class="feedback-form">
      <div class="form-header">
        <unicon name="heart" fill="#2C5AA0" :width="36" :height="36"></unicon>
        <h3>{{ getText('feedbackTitle') }}</h3>
        <p>{{ getText('feedbackDescription') }}</p>
      </div>

      <div class="feedback-content">
        <div class="group">
          <label>
            <unicon name="star" fill="#2C5AA0" :width="16" :height="16"></unicon>
            {{ getText('rating') }}
            <span class="required">*</span>
          </label>
          <div class="rating-stars">
            <button v-for="star in 5" 
                    :key="star"
                    @click="setRating(star)"
                    :class="['star', { active: star <= selectedRating, hover: star <= hoverRating }]"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                    type="button">
              <unicon name="star" :fill="(star <= selectedRating || star <= hoverRating) ? '#FFD700' : '#E0E0E0'" :width="24" :height="24"></unicon>
            </button>
          </div>
          <div class="rating-text">
            {{ getRatingText(selectedRating || hoverRating) }}
          </div>
        </div>

        <div class="group">
          <label>
            <unicon name="tag" fill="#2C5AA0" :width="16" :height="16"></unicon>
            {{ getText('feedbackCategory') }}
          </label>
          <div class="categories">
            <button v-for="category in feedbackCategories" 
                    :key="category.value"
                    @click="toggleCategory(category.value)"
                    :class="['category', { active: selectedCategories.includes(category.value) }]"
                    type="button">
              <unicon :name="category.icon" :fill="selectedCategories.includes(category.value) ? '#FFFFFF' : '#2C5AA0'" :width="14" :height="14"></unicon>
              {{ category.label }}
            </button>
          </div>
        </div>

        <div class="group">
          <label>
            <unicon name="edit" fill="#2C5AA0" :width="16" :height="16"></unicon>
            {{ getText('detailedComment') }}
          </label>
          <textarea v-model="comment" 
                    :placeholder="getText('commentPlaceholder')"
                    maxlength="1000"
                    @input="updateCharCount"></textarea>
          <div class="char-count">
            {{ comment.length }} / 1000
          </div>
        </div>
      </div>

      <button @click="submitFeedback" 
              :disabled="!isFormValid || isSubmitting" 
              class="submit">
        <template v-if="isSubmitting">
          <div class="spinner"></div>
          {{ getText('submitting') }}
        </template>
        <template v-else>
          <unicon name="message" fill="#FFFFFF" :width="16" :height="16"></unicon>
          {{ getText('submitFeedback') }}
        </template>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackTab',
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
      selectedCategories: [],
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
          rating: '전체적인 만족도',
          feedbackCategory: '피드백 유형',
          detailedComment: '상세 의견',
          commentPlaceholder: '서비스에 대한 자세한 의견이나 개선사항을 알려주세요...',
          submitFeedback: '피드백 보내기',
          submitting: '전송 중...',
          feedbackSuccess: '피드백 전송 완료',
          sendAnother: '다른 피드백 보내기',
          ratingTexts: ['평점을 선택해주세요', '매우 불만족', '불만족', '보통', '만족', '매우 만족'],
          categories: {
            usability: '사용성',
            performance: '성능',
            content: '콘텐츠',
            design: '디자인',
            bug: '버그 신고',
            suggestion: '개선 제안'
          }
        },
        en: {
          feedbackTitle: 'Send Feedback',
          feedbackDescription: 'Please share your valuable opinions to help us improve our service.',
          rating: 'Overall Satisfaction',
          feedbackCategory: 'Feedback Type',
          detailedComment: 'Detailed Comments',
          commentPlaceholder: 'Please tell us your detailed opinions or suggestions for improvement...',
          submitFeedback: 'Send Feedback',
          submitting: 'Submitting...',
          feedbackSuccess: 'Feedback Sent Successfully',
          sendAnother: 'Send Another Feedback',
          ratingTexts: ['Please select a rating', 'Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
          categories: {
            usability: 'Usability',
            performance: 'Performance',
            content: 'Content',
            design: 'Design',
            bug: 'Bug Report',
            suggestion: 'Suggestion'
          }
        }
      }[this.currentLanguage];
    },
    
    feedbackCategories() {
      return [
        { value: 'usability', label: this.texts.categories.usability, icon: 'mouse' },
        { value: 'performance', label: this.texts.categories.performance, icon: 'rocket' },
        { value: 'content', label: this.texts.categories.content, icon: 'document' },
        { value: 'design', label: this.texts.categories.design, icon: 'palette' },
        { value: 'bug', label: this.texts.categories.bug, icon: 'bug' },
        { value: 'suggestion', label: this.texts.categories.suggestion, icon: 'lightbulb' }
      ];
    },
    
    isFormValid() {
      return this.selectedRating > 0;
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
    
    toggleCategory(categoryValue) {
      const index = this.selectedCategories.indexOf(categoryValue);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(categoryValue);
      }
      this.clearResult();
    },
    
    getRatingText(rating) {
      if (!rating || rating < 1 || rating > 5) {
        return this.texts.ratingTexts[0];
      }
      return this.texts.ratingTexts[rating];
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
        rating: this.selectedRating,
        feedbackCategory: this.selectedCategories.join(','),
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
      this.selectedCategories = [];
      this.comment = '';
      this.isSubmitting = false;
      this.resultMessage = '';
      this.resultType = '';
    }
  }
};
</script>