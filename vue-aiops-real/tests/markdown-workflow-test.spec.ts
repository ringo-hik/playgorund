import { test, expect } from '@playwright/test';

test.describe('마크다운 및 메시지 워크플로우 테스트', () => {
  test('다양한 마크다운 표현과 메시지 형식 테스트', async ({ page }) => {
    console.log('🚀 마크다운 및 메시지 워크플로우 테스트 시작');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 1. 플로팅 버튼 클릭하여 채팅창 열기
    console.log('📖 1단계: 채팅창 열기');
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(2000);
    
    // 2. 카테고리 선택 - 운영/관리
    console.log('📖 2단계: 운영/관리 카테고리 선택');
    await page.locator('.category-card').nth(2).click(); // 운영/관리
    await page.waitForTimeout(1500);
    
    // 3. 페르소나 선택
    console.log('📖 3단계: 첫 번째 페르소나 선택');
    await page.locator('.persona-card').first().click();
    await page.waitForTimeout(1500);
    
    // 4. 다양한 메시지 타입 테스트
    const testMessages = [
      {
        title: '일반 텍스트 메시지',
        message: '안녕하세요! 시스템 상태를 확인해주세요.',
        description: '기본 텍스트 메시지 테스트'
      },
      {
        title: '멀티라인 메시지',
        message: `첫 번째 줄입니다.
두 번째 줄입니다.
세 번째 줄입니다.

빈 줄도 포함되어 있습니다.`,
        description: '엔터키로 줄바꿈된 메시지 테스트'
      },
      {
        title: '복잡한 질문',
        message: `다음 정보를 표로 정리해주세요:
- 서버 A: 정상 동작
- 서버 B: 점검 중
- 서버 C: 오류 발생

각 서버의 상세 상태도 함께 알려주세요.`,
        description: '구조화된 데이터를 요청하는 메시지'
      },
      {
        title: '코드 요청',
        message: 'JavaScript로 API 호출하는 예제 코드를 작성해주세요.',
        description: '코드 블록 응답을 유도하는 메시지'
      },
      {
        title: '경고/알림 요청',
        message: '시스템 점검 시 주의사항을 정리해서 알려주세요.',
        description: '알림 블록 응답을 유도하는 메시지'
      }
    ];
    
    for (let i = 0; i < testMessages.length; i++) {
      const testMsg = testMessages[i];
      console.log(`📖 ${4 + i}단계: ${testMsg.title} 테스트`);
      
      // 메시지 입력
      await page.locator('.message-textarea').fill(testMsg.message);
      await page.waitForTimeout(500);
      
      // 메시지 전송 (Shift+Enter)
      await page.locator('.message-textarea').press('Shift+Enter');
      await page.waitForTimeout(2000);
      
      // 스크린샷 캡처
      await page.screenshot({ 
        path: `test-results/markdown-test-${String(i + 1).padStart(2, '0')}-${testMsg.title.replace(/[^가-힣a-zA-Z0-9]/g, '-')}.png`,
        fullPage: true 
      });
      
      // 다음 테스트를 위해 약간 대기
      await page.waitForTimeout(1000);
    }
    
    // 5. 최종 채팅 히스토리 캡처
    console.log('📖 최종: 전체 채팅 히스토리 캡처');
    await page.screenshot({ 
      path: 'test-results/markdown-test-final-chat-history.png',
      fullPage: true 
    });
    
    // 6. 메시지 요소들 분석
    const messageAnalysis = await page.evaluate(() => {
      const messages = [];
      
      // 모든 메시지 버블 찾기
      const messageBubbles = document.querySelectorAll('.message-bubble');
      messageBubbles.forEach((bubble, index) => {
        const isUser = bubble.classList.contains('message-bubble--user');
        const isAi = bubble.classList.contains('message-bubble--ai');
        
        messages.push({
          index,
          type: isUser ? 'USER' : isAi ? 'AI' : 'UNKNOWN',
          classes: bubble.className,
          hasContent: bubble.innerHTML.length > 0,
          contentPreview: bubble.textContent?.substring(0, 100) || 'no content'
        });
      });
      
      // 마크다운 요소들 찾기
      const markdownElements = {
        headings: document.querySelectorAll('.markdown-heading').length,
        paragraphs: document.querySelectorAll('.markdown-paragraph').length,
        tables: document.querySelectorAll('.markdown-table').length,
        codeBlocks: document.querySelectorAll('.markdown-code-block').length,
        alerts: document.querySelectorAll('.markdown-alert').length,
        lists: document.querySelectorAll('.markdown-list').length,
        strong: document.querySelectorAll('.markdown-strong').length
      };
      
      return {
        totalMessages: messages.length,
        messages,
        markdownElements
      };
    });
    
    console.log('📊 메시지 분석 결과:');
    console.log(`- 총 메시지 수: ${messageAnalysis.totalMessages}`);
    console.log('- 메시지 타입별:');
    messageAnalysis.messages.forEach(msg => {
      console.log(`  ${msg.index + 1}. ${msg.type}: ${msg.contentPreview}`);
    });
    
    console.log('📊 마크다운 요소 분석:');
    Object.entries(messageAnalysis.markdownElements).forEach(([element, count]) => {
      console.log(`- ${element}: ${count}개`);
    });
    
    console.log('✅ 마크다운 워크플로우 테스트 완료');
  });
  
  test('메시지 입력 방식 테스트', async ({ page }) => {
    console.log('⌨️ 메시지 입력 방식 테스트 시작');
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // 채팅창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(2000);
    
    // 카테고리 및 페르소나 선택
    await page.locator('.category-card').first().click();
    await page.waitForTimeout(1000);
    await page.locator('.persona-card').first().click();
    await page.waitForTimeout(1000);
    
    // 1. 일반 엔터키 테스트 (줄바꿈)
    console.log('⌨️ 1. 일반 엔터키 테스트 (줄바꿈)');
    await page.locator('.message-textarea').fill('첫 번째 줄');
    await page.locator('.message-textarea').press('Enter');
    await page.locator('.message-textarea').type('두 번째 줄');
    await page.locator('.message-textarea').press('Enter');
    await page.locator('.message-textarea').type('세 번째 줄');
    
    await page.screenshot({ 
      path: 'test-results/input-test-01-enter-newlines.png' 
    });
    
    // 2. Shift+Enter로 전송 테스트
    console.log('⌨️ 2. Shift+Enter로 전송 테스트');
    await page.locator('.message-textarea').press('Shift+Enter');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/input-test-02-shift-enter-send.png' 
    });
    
    // 3. Ctrl+Enter로 전송 테스트
    console.log('⌨️ 3. Ctrl+Enter로 전송 테스트');
    await page.locator('.message-textarea').fill('Ctrl+Enter로 전송하는 메시지입니다.');
    await page.locator('.message-textarea').press('Control+Enter');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/input-test-03-ctrl-enter-send.png' 
    });
    
    // 4. 텍스트영역 높이 조절 테스트
    console.log('⌨️ 4. 텍스트영역 높이 조절 테스트');
    const longMessage = Array(10).fill('긴 메시지를 입력하여 텍스트영역이 어떻게 확장되는지 확인합니다.').join('\n');
    await page.locator('.message-textarea').fill(longMessage);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/input-test-04-textarea-expansion.png' 
    });
    
    console.log('✅ 메시지 입력 방식 테스트 완료');
  });
});