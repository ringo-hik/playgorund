import { test, expect } from '@playwright/test';

test.describe('플로팅 버튼 상태 오류 테스트', () => {
  test('반복 클릭 시 버튼 상태와 채팅창 동기화 확인', async ({ page }) => {
    console.log('🔄 플로팅 버튼 상태 테스트 시작');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 초기 상태 확인
    console.log('1️⃣ 초기 상태 확인');
    const initialState = await page.evaluate(() => {
      const button = document.querySelector('.ai-chatops-chat-button');
      const chatWindow = document.querySelector('.ai-chatops-chat-window');
      
      return {
        buttonHasActiveClass: button?.classList.contains('is-active') || false,
        chatWindowVisible: chatWindow && getComputedStyle(chatWindow).display !== 'none',
        buttonExists: !!button,
        chatWindowExists: !!chatWindow
      };
    });
    
    console.log('초기 상태:', initialState);
    await page.screenshot({ path: 'test-results/button-state-01-initial.png' });
    
    // 여러 번 반복 클릭 테스트 
    for (let i = 1; i <= 10; i++) {
      console.log(`${i + 1}️⃣ ${i}번째 클릭 테스트`);
      
      // 클릭 전 상태
      const beforeClick = await page.evaluate(() => {
        const button = document.querySelector('.ai-chatops-chat-button');
        const chatWindow = document.querySelector('.ai-chatops-chat-window');
        
        return {
          buttonActive: button?.classList.contains('is-active') || false,
          chatVisible: chatWindow && getComputedStyle(chatWindow).display !== 'none',
          buttonIconName: button?.querySelector('unicon')?.getAttribute('name') || 'no-icon'
        };
      });
      
      // 버튼 클릭
      await page.locator('.ai-chatops-chat-button').click();
      await page.waitForTimeout(500); // 애니메이션 대기
      
      // 클릭 후 상태
      const afterClick = await page.evaluate(() => {
        const button = document.querySelector('.ai-chatops-chat-button');
        const chatWindow = document.querySelector('.ai-chatops-chat-window');
        
        return {
          buttonActive: button?.classList.contains('is-active') || false,
          chatVisible: chatWindow && getComputedStyle(chatWindow).display !== 'none',
          buttonIconName: button?.querySelector('unicon')?.getAttribute('name') || 'no-icon'
        };
      });
      
      console.log(`  클릭 전: 버튼Active=${beforeClick.buttonActive}, 창표시=${beforeClick.chatVisible}, 아이콘=${beforeClick.buttonIconName}`);
      console.log(`  클릭 후: 버튼Active=${afterClick.buttonActive}, 창표시=${afterClick.chatVisible}, 아이콘=${afterClick.buttonIconName}`);
      
      // 상태 불일치 검사
      const isInconsistent = afterClick.buttonActive !== afterClick.chatVisible;
      if (isInconsistent) {
        console.log(`  ⚠️ 상태 불일치 발견! 클릭 ${i}번째`);
        await page.screenshot({ 
          path: `test-results/button-state-inconsistent-click-${i}.png` 
        });
      }
      
      // 매 5번째 클릭마다 스크린샷
      if (i % 5 === 0) {
        await page.screenshot({ 
          path: `test-results/button-state-${String(i + 1).padStart(2, '0')}-click-${i}.png` 
        });
      }
      
      await page.waitForTimeout(300); // 다음 클릭 전 대기
    }
    
    // 최종 상태 확인
    console.log('🔍 최종 상태 확인');
    const finalState = await page.evaluate(() => {
      const button = document.querySelector('.ai-chatops-chat-button');
      const chatWindow = document.querySelector('.ai-chatops-chat-window');
      
      return {
        buttonActive: button?.classList.contains('is-active') || false,
        chatVisible: chatWindow && getComputedStyle(chatWindow).display !== 'none',
        buttonIconName: button?.querySelector('unicon')?.getAttribute('name') || 'no-icon',
        chatWindowClasses: chatWindow?.className || 'no-classes'
      };
    });
    
    console.log('최종 상태:', finalState);
    await page.screenshot({ path: 'test-results/button-state-final.png' });
    
    console.log('✅ 플로팅 버튼 상태 테스트 완료');
  });
  
  test('빠른 연속 클릭 시 상태 안정성 확인', async ({ page }) => {
    console.log('⚡ 빠른 연속 클릭 테스트 시작');
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // 매우 빠른 연속 클릭 (100ms 간격)
    console.log('빠른 연속 클릭 10회 실행');
    for (let i = 0; i < 10; i++) {
      await page.locator('.ai-chatops-chat-button').click();
      await page.waitForTimeout(100);
    }
    
    // 잠시 대기 후 상태 확인
    await page.waitForTimeout(1000);
    
    const quickClickState = await page.evaluate(() => {
      const button = document.querySelector('.ai-chatops-chat-button');
      const chatWindow = document.querySelector('.ai-chatops-chat-window');
      
      return {
        buttonActive: button?.classList.contains('is-active') || false,
        chatVisible: chatWindow && getComputedStyle(chatWindow).display !== 'none',
        isConsistent: (button?.classList.contains('is-active') || false) === 
                     (chatWindow && getComputedStyle(chatWindow).display !== 'none')
      };
    });
    
    console.log('빠른 클릭 후 상태:', quickClickState);
    await page.screenshot({ path: 'test-results/button-state-quick-clicks.png' });
    
    console.log('✅ 빠른 연속 클릭 테스트 완료');
  });
  
  test('다양한 시나리오에서 버튼 상태 확인', async ({ page }) => {
    console.log('🎯 다양한 시나리오 테스트 시작');
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const scenarios = [
      { name: '페이지 새로고침 후', action: () => page.reload() },
      { name: '페이지 뒤로가기/앞으로가기', action: async () => {
        await page.goBack();
        await page.waitForTimeout(500);
        await page.goForward();
      }},
      { name: '브라우저 크기 변경', action: async () => {
        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(500);
        await page.setViewportSize({ width: 1280, height: 720 });
      }}
    ];
    
    for (const scenario of scenarios) {
      console.log(`📋 시나리오: ${scenario.name}`);
      
      try {
        await scenario.action();
        await page.waitForTimeout(1000);
        
        // 버튼 클릭
        await page.locator('.ai-chatops-chat-button').click();
        await page.waitForTimeout(500);
        
        const state = await page.evaluate(() => {
          const button = document.querySelector('.ai-chatops-chat-button');
          const chatWindow = document.querySelector('.ai-chatops-chat-window');
          
          return {
            buttonActive: button?.classList.contains('is-active') || false,
            chatVisible: chatWindow && getComputedStyle(chatWindow).display !== 'none'
          };
        });
        
        console.log(`  상태: 버튼Active=${state.buttonActive}, 창표시=${state.chatVisible}`);
        
        const scenarioSafeName = scenario.name.replace(/[^가-힣a-zA-Z0-9]/g, '-');
        await page.screenshot({ 
          path: `test-results/button-state-scenario-${scenarioSafeName}.png` 
        });
        
      } catch (error) {
        console.log(`  ❌ 시나리오 실패: ${error.message}`);
      }
    }
    
    console.log('✅ 다양한 시나리오 테스트 완료');
  });
});