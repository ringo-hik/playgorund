<template>
  <div class="system-admin">
    <!-- 상단 헤더 -->
    <div class="header">
      <h2>시스템 프롬프트 관리</h2>
      <button @click="$emit('go-home')">← 뒤로가기</button>
    </div>

    <!-- 프롬프트 목록 -->
    <div class="section">
      <h3>프롬프트 목록</h3>
      <button @click="loadSystemPrompts" :disabled="isLoading">
        {{ isLoading ? '로딩중...' : '프롬프트 로드' }}
      </button>

      <div v-if="systemPrompts.length > 0" class="prompt-list">
        <div v-for="prompt in systemPrompts" :key="prompt.id" 
             class="prompt-item" 
             :class="{ selected: selectedPrompt?.id === prompt.id }"
             @click="selectPrompt(prompt)">
          <strong>{{ prompt.name || prompt.id }}</strong>
          <div>{{ prompt.description || '설명 없음' }}</div>
        </div>
      </div>

      <div v-else-if="!isLoading" class="empty">
        프롬프트가 없습니다. 위 버튼을 클릭해서 로드하세요.
      </div>
    </div>

    <!-- 프롬프트 편집기 -->
    <div v-if="selectedPrompt" class="section">
      <h3>프롬프트 편집: {{ selectedPrompt.name || selectedPrompt.id }}</h3>
      
      <div class="editor-controls">
        <button @click="testPrompt" :disabled="isTesting || !editedPromptContent.trim()">
          {{ isTesting ? '테스트중...' : '테스트' }}
        </button>
        <button @click="savePrompt" :disabled="isSaving || !hasChanges">
          {{ isSaving ? '저장중...' : '저장' }}
        </button>
        <button @click="resetPrompt" :disabled="!hasChanges">초기화</button>
        <span class="char-count">{{ editedPromptContent.length }}자</span>
      </div>

      <textarea 
        v-model="editedPromptContent"
        class="prompt-editor"
        placeholder="시스템 프롬프트를 입력하세요..."
        rows="20"
      ></textarea>
    </div>

    <!-- 테스트 결과 -->
    <div v-if="testResults.length > 0" class="section">
      <h3>테스트 결과</h3>
      <button @click="clearTestResults">결과 지우기</button>

      <div v-for="result in testResults" :key="result.id" class="test-result">
        <div class="result-header">
          <span>{{ formatTimestamp(result.timestamp) }}</span>
          <span :class="result.success ? 'success' : 'error'">
            {{ result.success ? '성공' : '실패' }}
          </span>
          <button @click="toggleResultDetails(result.id)">
            {{ result.showDetails ? '접기' : '펼치기' }}
          </button>
        </div>

        <div v-if="result.showDetails" class="result-content">
          <div class="test-section">
            <h4>입력:</h4>
            <pre>{{ result.input }}</pre>
          </div>
          <div class="test-section">
            <h4>출력:</h4>
            <div v-html="result.formattedOutput"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getText } from '../utils/i18n.js';
import aiChatOpsService from '../service/aiChatOpsService.js';

export default {
  name: 'SystemAdminTab',

  props: {
    currentLanguage: {
      type: String,
      default: 'ko'
    }
  },

  data() {
    return {
      isLoading: false,
      isTesting: false,
      isSaving: false,
      systemPrompts: [],
      selectedPrompt: null,
      editedPromptContent: '',
      originalPromptContent: '',
      testResults: [],
      nextResultId: 1
    };
  },

  computed: {
    hasChanges() {
      return this.editedPromptContent !== this.originalPromptContent;
    }
  },

  methods: {
    getText,

    async loadSystemPrompts() {
      this.isLoading = true;
      try {
        const response = await aiChatOpsService.getSystemPrompts();
        if (response.success) {
          this.systemPrompts = response.data || [];
        } else {
          alert('프롬프트 로드 실패: ' + (response.errorMessage || '알 수 없는 오류'));
        }
      } catch (error) {
        alert('프롬프트 로드 중 오류 발생');
      } finally {
        this.isLoading = false;
      }
    },

    selectPrompt(prompt) {
      this.selectedPrompt = prompt;
      this.editedPromptContent = prompt.content || '';
      this.originalPromptContent = prompt.content || '';
    },

    async testPrompt() {
      if (!this.editedPromptContent.trim()) return;

      this.isTesting = true;
      const testInput = '안녕하세요. 시스템 프롬프트 테스트입니다.';
      
      try {
        const response = await aiChatOpsService.testSystemPrompt({
          promptContent: this.editedPromptContent,
          testInput: testInput,
          promptId: this.selectedPrompt?.id
        });

        const result = {
          id: this.nextResultId++,
          timestamp: new Date(),
          input: testInput,
          output: response.data || response.message,
          formattedOutput: '',
          success: response.success,
          showDetails: true
        };

        if (response.success && response.data) {
          result.formattedOutput = await aiChatOpsService.formatContentForDisplay(response.data);
        } else {
          result.formattedOutput = result.output;
        }

        this.testResults.unshift(result);
        
        if (this.testResults.length > 5) {
          this.testResults = this.testResults.slice(0, 5);
        }

      } catch (error) {
        const errorResult = {
          id: this.nextResultId++,
          timestamp: new Date(),
          input: testInput,
          output: error.message || '테스트 중 오류 발생',
          formattedOutput: error.message || '테스트 중 오류 발생',
          success: false,
          showDetails: true
        };
        this.testResults.unshift(errorResult);
      } finally {
        this.isTesting = false;
      }
    },

    async savePrompt() {
      if (!this.selectedPrompt || !this.hasChanges) return;

      this.isSaving = true;
      try {
        const response = await aiChatOpsService.updateSystemPrompt({
          id: this.selectedPrompt.id,
          content: this.editedPromptContent,
          name: this.selectedPrompt.name,
          type: this.selectedPrompt.type
        });

        if (response.success) {
          this.originalPromptContent = this.editedPromptContent;
          this.selectedPrompt.content = this.editedPromptContent;
          alert('프롬프트가 저장되었습니다.');
        } else {
          alert('저장 실패: ' + (response.errorMessage || '알 수 없는 오류'));
        }
      } catch (error) {
        alert('저장 중 오류 발생');
      } finally {
        this.isSaving = false;
      }
    },

    resetPrompt() {
      this.editedPromptContent = this.originalPromptContent;
    },

    clearTestResults() {
      this.testResults = [];
    },

    toggleResultDetails(resultId) {
      const result = this.testResults.find(r => r.id === resultId);
      if (result) {
        result.showDetails = !result.showDetails;
      }
    },

    formatTimestamp(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);

      if (minutes < 1) return '방금 전';
      if (minutes < 60) return `${minutes}분 전`;
      return `${Math.floor(minutes / 60)}시간 전`;
    }
  },

  mounted() {
    this.loadSystemPrompts();
  }
};
</script>

<style scoped>
.system-admin {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.header h2 {
  margin: 0;
  font-size: 24px;
}

.header button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  cursor: pointer;
}

.header button:hover {
  background: #e0e0e0;
}

.section {
  margin-bottom: 40px;
}

.section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: bold;
}

.section > button {
  padding: 8px 16px;
  background: #007cba;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 15px;
}

.section > button:hover {
  background: #005a87;
}

.section > button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.prompt-list {
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
}

.prompt-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.prompt-item:hover {
  background: #f5f5f5;
}

.prompt-item.selected {
  background: #e3f2fd;
  border-left: 3px solid #007cba;
}

.prompt-item strong {
  display: block;
  margin-bottom: 5px;
}

.prompt-item div {
  font-size: 12px;
  color: #666;
}

.empty {
  padding: 20px;
  text-align: center;
  color: #666;
  background: #f9f9f9;
  border: 1px solid #ddd;
}

.editor-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.editor-controls button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.editor-controls button:hover {
  background: #f5f5f5;
}

.editor-controls button:disabled {
  background: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

.char-count {
  font-size: 12px;
  color: #666;
  margin-left: auto;
}

.prompt-editor {
  width: 100%;
  min-height: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  resize: vertical;
}

.prompt-editor:focus {
  outline: none;
  border-color: #007cba;
}

.test-result {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.result-header {
  padding: 10px;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.result-header button {
  padding: 4px 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

.result-content {
  padding: 15px;
}

.test-section {
  margin-bottom: 15px;
}

.test-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
}

.test-section pre {
  background: #f5f5f5;
  padding: 8px;
  border: 1px solid #ddd;
  font-size: 12px;
  white-space: pre-wrap;
  margin: 0;
}

.test-section div {
  border: 1px solid #ddd;
  padding: 8px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}
</style>