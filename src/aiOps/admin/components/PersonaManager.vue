<template>
  <div class="persona-manager">
    <div class="manager-header">
      <h3>페르소나 관리</h3>
      <button @click="showCreateForm = !showCreateForm" class="btn-create">
        {{ showCreateForm ? '취소' : '새 페르소나' }}
      </button>
    </div>

    <!-- 페르소나 생성 폼 -->
    <div v-if="showCreateForm" class="create-form">
      <h4>새 페르소나 생성</h4>
      <form @submit.prevent="createPersona">
        <div class="form-row">
          <div class="form-group">
            <label>페르소나 코드 *</label>
            <input 
              v-model="newPersona.personaCode" 
              type="text" 
              pattern="[a-zA-Z0-9_]+" 
              title="영문, 숫자, 언더스코어만 사용 가능"
              required 
              placeholder="예: my_assistant"
            >
          </div>
          <div class="form-group">
            <label>카테고리 *</label>
            <select v-model="newPersona.category" required>
              <option value="">선택하세요</option>
              <option value="personal">Personal</option>
              <option value="general">General</option>
              <option value="operation">Operation</option>
              <option value="extension">Extension</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>제목 (한글) *</label>
            <input v-model="newPersona.title" type="text" required placeholder="예: 개인 업무 어시스턴트">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>설명 (한글) *</label>
            <textarea v-model="newPersona.description" required rows="2" placeholder="한글 설명을 입력하세요"></textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>설명 (영문) *</label>
            <textarea v-model="newPersona.descriptionEn" required rows="2" placeholder="English description"></textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>환영 메시지</label>
            <textarea v-model="newPersona.welcomeMsg" rows="3" placeholder="마크다운을 사용할 수 있습니다"></textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>시스템 프롬프트</label>
            <textarea v-model="newPersona.systemPrompt" rows="4" :placeholder="defaultSystemPrompt"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn-reset">초기화</button>
          <button type="submit" :disabled="isCreating" class="btn-submit">
            {{ isCreating ? '생성중...' : '페르소나 생성' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 기존 페르소나 목록 -->
    <div class="persona-list">
      <h4>기존 페르소나 ({{ personas.length }}개)</h4>
      <div class="list-container">
        <div v-for="persona in personas" :key="persona.personaCode" class="persona-item">
          <div class="persona-info">
            <div class="persona-header">
              <strong>{{ persona.title }}</strong>
              <span class="persona-code">{{ persona.personaCode }}</span>
              <span class="persona-category">{{ persona.category }}</span>
            </div>
            <p class="persona-desc">{{ persona.description }}</p>
          </div>
          <div class="persona-actions">
            <button @click="editPersona(persona)" class="btn-edit">수정</button>
            <button @click="deletePersona(persona.personaCode)" class="btn-delete">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 편집 모달 -->
    <div v-if="editingPersona" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>페르소나 수정: {{ editingPersona.personaCode }}</h3>
          <button @click="closeEditModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="updatePersona">
          <div class="form-group">
            <label>제목 (한글) *</label>
            <input v-model="editingPersona.title" type="text" required>
          </div>
          <div class="form-group">
            <label>카테고리 *</label>
            <select v-model="editingPersona.category" required>
              <option value="personal">Personal</option>
              <option value="general">General</option>
              <option value="operation">Operation</option>
              <option value="extension">Extension</option>
            </select>
          </div>
          <div class="form-group">
            <label>설명 (한글) *</label>
            <textarea v-model="editingPersona.description" required rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>설명 (영문) *</label>
            <textarea v-model="editingPersona.descriptionEn" required rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>환영 메시지</label>
            <textarea v-model="editingPersona.welcomeMsg" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn-cancel">취소</button>
            <button type="submit" :disabled="isUpdating" class="btn-update">
              {{ isUpdating ? '수정중...' : '수정 완료' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import aiChatOpsService from '../../service/aiChatOpsService.js';

export default {
  name: 'PersonaManager',
  props: {
    personas: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showCreateForm: false,
      isCreating: false,
      isUpdating: false,
      editingPersona: null,
      
      newPersona: {
        personaCode: '',
        title: '',
        description: '',
        descriptionEn: '',
        category: '',
        welcomeMsg: '',
        systemPrompt: '',
        tags: []
      },

      defaultSystemPrompt: `You are a helpful AI assistant. Please provide accurate, helpful, and informative responses to user questions.

Guidelines:
- Be concise and clear in your responses
- Provide examples when helpful
- Ask clarifying questions if needed
- Be honest about limitations
- Maintain a professional and friendly tone`
    };
  },

  methods: {
    async createPersona() {
      if (!this.validatePersona(this.newPersona)) {
        return;
      }

      this.isCreating = true;
      try {
        const personaData = {
          ...this.newPersona,
          systemPrompt: this.newPersona.systemPrompt || this.defaultSystemPrompt,
          tags: []
        };

        const response = await aiChatOpsService.createPersona(personaData);
        
        if (response.success) {
          this.$emit('persona-created', response.data);
          this.resetForm();
          this.showCreateForm = false;
          alert('✅ 페르소나가 생성되었습니다.');
        } else {
          alert('❌ 생성 실패: ' + response.errorMessage);
        }
      } catch (error) {
        alert('❌ 생성 중 오류 발생: ' + error.message);
      } finally {
        this.isCreating = false;
      }
    },

    editPersona(persona) {
      this.editingPersona = { ...persona };
    },

    async updatePersona() {
      if (!this.validatePersona(this.editingPersona)) {
        return;
      }

      this.isUpdating = true;
      try {
        const response = await aiChatOpsService.updatePersona(this.editingPersona);
        
        if (response.success) {
          this.$emit('persona-updated', response.data);
          this.closeEditModal();
          alert('✅ 페르소나가 수정되었습니다.');
        } else {
          alert('❌ 수정 실패: ' + response.errorMessage);
        }
      } catch (error) {
        alert('❌ 수정 중 오류 발생: ' + error.message);
      } finally {
        this.isUpdating = false;
      }
    },

    async deletePersona(personaCode) {
      if (!confirm(`정말로 '${personaCode}' 페르소나를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
        return;
      }

      try {
        const response = await aiChatOpsService.deletePersona(personaCode);
        
        if (response.success) {
          this.$emit('persona-deleted', personaCode);
          alert('✅ 페르소나가 삭제되었습니다.');
        } else {
          alert('❌ 삭제 실패: ' + response.errorMessage);
        }
      } catch (error) {
        alert('❌ 삭제 중 오류 발생: ' + error.message);
      }
    },

    validatePersona(persona) {
      if (!persona.personaCode || !persona.personaCode.match(/^[a-zA-Z0-9_]+$/)) {
        alert('❌ 페르소나 코드는 영문, 숫자, 언더스코어만 사용 가능합니다.');
        return false;
      }

      if (!persona.title || !persona.description || !persona.descriptionEn || !persona.category) {
        alert('❌ 필수 항목을 모두 입력해주세요.');
        return false;
      }

      // 중복 체크 (생성시에만)
      if (!this.editingPersona && this.personas.some(p => p.personaCode === persona.personaCode)) {
        alert('❌ 이미 존재하는 페르소나 코드입니다.');
        return false;
      }

      return true;
    },

    resetForm() {
      this.newPersona = {
        personaCode: '',
        title: '',
        description: '',
        descriptionEn: '',
        category: '',
        welcomeMsg: '',
        systemPrompt: '',
        tags: []
      };
    },

    closeEditModal() {
      this.editingPersona = null;
    }
  }
};
</script>

<style scoped>
.persona-manager {
  background: #f8fafc;
  font-size: 12px;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.manager-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.btn-create {
  padding: 5px 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
}

.btn-create:hover {
  background: #2563eb;
}

/* 생성 폼 */
.create-form {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.create-form h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-reset {
  padding: 6px 12px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.btn-reset:hover {
  background: #4b5563;
}

.btn-submit {
  padding: 6px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.btn-submit:hover {
  background: #059669;
}

.btn-submit:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* 페르소나 목록 */
.persona-list {
  padding: 16px;
}

.persona-list h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.list-container {
  max-height: 240px;
  overflow-y: auto;
}

.persona-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 6px;
}

.persona-info {
  flex: 1;
}

.persona-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.persona-header strong {
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
}

.persona-code {
  font-size: 10px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 4px;
  border-radius: 2px;
  font-family: monospace;
}

.persona-category {
  font-size: 10px;
  color: white;
  background: #3b82f6;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: 500;
}

.persona-desc {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  line-height: 1.3;
}

.persona-actions {
  display: flex;
  gap: 4px;
}

.btn-edit, .btn-delete {
  padding: 3px 6px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
}

.btn-edit {
  background: #f59e0b;
  color: white;
}

.btn-edit:hover {
  background: #d97706;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

/* 편집 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #374151;
}

.modal-content form {
  padding: 16px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 6px 12px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.btn-cancel:hover {
  background: #4b5563;
}

.btn-update {
  padding: 6px 12px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.btn-update:hover {
  background: #d97706;
}

.btn-update:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>