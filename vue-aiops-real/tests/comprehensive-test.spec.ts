import { test, expect } from '@playwright/test';

test.describe('완전한 AI ChatOps 기능 테스트', () => {
  test('전체 워크플로우 테스트', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. 초기 화면
    await page.screenshot({ 
      path: 'test-results/workflow-01-initial.png', 
      fullPage: true 
    });
    
    // 2. AI ChatOps 버튼 클릭
    const chatButton = page.locator('.ai-chatops-chat-button');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/workflow-02-chat-opened.png', 
      fullPage: true 
    });
    
    // 3. 개인 특화 카테고리 선택
    const personalCategory = page.locator('.category-card').first();
    await personalCategory.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/workflow-03-personal-selected.png', 
      fullPage: true 
    });
    
    // 4. 페르소나 선택 (첫 번째 페르소나)
    const firstPersona = page.locator('.persona-card').first();
    if (await firstPersona.count() > 0) {
      await firstPersona.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'test-results/workflow-04-persona-selected.png', 
        fullPage: true 
      });
    }
    
    // 5. 채팅 인터페이스 확인
    const chatInterface = page.locator('.chat-area');
    if (await chatInterface.isVisible()) {
      await page.screenshot({ 
        path: 'test-results/workflow-05-chat-interface.png', 
        fullPage: true 
      });
      
      // 메시지 입력 영역 확인
      const messageInput = page.locator('textarea, input[type="text"]');
      if (await messageInput.count() > 0) {
        const input = messageInput.first();
        await input.fill('안녕하세요! 테스트 메시지입니다.');
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
          path: 'test-results/workflow-06-message-typed.png', 
          fullPage: true 
        });
      }
    }
    
    // 6. 피드백 탭 테스트
    const feedbackBtn = page.locator('button').filter({ hasText: '피드백' });
    if (await feedbackBtn.count() > 0) {
      await feedbackBtn.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'test-results/workflow-07-feedback-tab.png', 
        fullPage: true 
      });
    }
    
    // 7. 설정/옵션 확인
    const settingsElements = page.locator('.theme-selector, .language-btn');
    const settingsCount = await settingsElements.count();
    
    if (settingsCount > 0) {
      await page.screenshot({ 
        path: 'test-results/workflow-08-settings-visible.png', 
        fullPage: true 
      });
    }
    
    console.log(`테스트 완료: 설정 요소 ${settingsCount}개 발견`);
  });

  test('반응형 테스트', async ({ page }) => {
    // 모바일 뷰포트 테스트
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-01-mobile.png', 
      fullPage: true 
    });
    
    // ChatOps 버튼 클릭
    const chatButton = page.locator('.ai-chatops-chat-button');
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-02-mobile-chat.png', 
      fullPage: true 
    });
    
    // 태블릿 뷰포트 테스트
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-03-tablet.png', 
      fullPage: true 
    });
    
    // 데스크톱 뷰포트 테스트
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-04-desktop.png', 
      fullPage: true 
    });
  });
});