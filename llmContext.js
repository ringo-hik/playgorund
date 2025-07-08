
// Mock llmContextService.js for frontend testing.

const llmContextService = {

  // Simulate a successful context improvement from feedback
  async contextImproveFromFeedback(feedbackData) {
    console.log("Mock contextImproveFromFeedback called with:", feedbackData);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            message: '피드백을 반영하여 프롬프트가 개선되었습니다. (Mock)'
          }
        });
      }, 1000); // 1-second delay
    });
  },

  // Mock other functions to prevent errors if they are ever called
  async fixSqlError(errorData) {
    console.log("Mock fixSqlError called with:", errorData);
    return Promise.resolve({ success: false, errorMessage: 'This function is not implemented in the mock.' });
  },

  async completeWithAdditionalInfo(completionData) {
    console.log("Mock completeWithAdditionalInfo called with:", completionData);
    return Promise.resolve({ success: false, errorMessage: 'This function is not implemented in the mock.' });
  },

  getErrorMessage(error) {
    return 'An unknown mock error occurred in llmContextService.';
  }
};

// Make it globally accessible for the browser environment
window.llmContextService = llmContextService;
