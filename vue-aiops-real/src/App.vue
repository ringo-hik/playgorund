<template>
  <div class="app-container">
    <!-- Main Application Content -->
    <div class="demo-container">
      <div class="demo-header">
        <h1>🤖 실제 src/aiOps 컴포넌트 테스트</h1>
        <p>Vue 3 환경에서 실제 AIChatOpsLayout.vue 컴포넌트를 사용합니다</p>
      </div>
      
      <div class="demo-info">
        <h3>✅ 실제 컴포넌트 사용 중</h3>
        <ul>
          <li>AIChatOpsLayout.vue - 실제 src/aiOps 컴포넌트</li>
          <li>ChatTab.vue, FeedbackTab.vue, Elements.vue 포함</li>
          <li>aiChatOpsService.js - 실제 API 서비스</li>
          <li>i18n.js - 실제 국제화 모듈</li>
          <li>CSS 스타일 - 실제 테마 시스템</li>
        </ul>
      </div>
    </div>
    
    <!-- AI ChatOps Component (실제 src/aiOps 사용) -->
    <AIChatOpsLayout />
  </div>
</template>

<script>
// 실제 src/aiOps 컴포넌트 import
import AIChatOpsLayout from './components/aiOps/AIChatOpsLayout.vue'

// 실제 CSS import
import './components/aiOps/styles/aiChatOps.css'
import './components/aiOps/styles/customMarkdown.css'

export default {
  name: 'App',
  components: {
    AIChatOpsLayout
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
}

.demo-header h1 {
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.demo-header p {
  color: #718096;
  font-size: 16px;
}

.demo-info {
  background: #e6fffa;
  border: 1px solid #81e6d9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.demo-info h3 {
  color: #234e52;
  margin-bottom: 8px;
}

.demo-info ul {
  color: #2d7d72;
  padding-left: 20px;
}

.demo-info li {
  margin-bottom: 4px;
}
</style>