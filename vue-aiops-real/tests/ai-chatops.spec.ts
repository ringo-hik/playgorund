import { test, expect } from '@playwright/test';

test.describe('AI ChatOps UI 테스트', () => {
  test('초기 화면 로드 및 스크린샷', async ({ page }) => {
    await page.goto('/');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 전체 페이지 스크린샷
    await page.screenshot({ 
      path: 'test-results/01-initial-load.png', 
      fullPage: true 
    });
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/Vue/);
    
    // 데모 헤더 확인
    const demoHeader = page.locator('h1');
    await expect(demoHeader).toContainText('실제 src/aiOps 컴포넌트 테스트');
  });

  test('AI ChatOps 버튼 확인 및 클릭 테스트', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // AI ChatOps 버튼 찾기 (우측 하단)
    const chatButton = page.locator('.ai-chatops-chat-button');
    
    // 버튼이 존재하는지 확인
    await expect(chatButton).toBeVisible();
    
    // 버튼 스크린샷
    await chatButton.screenshot({ path: 'test-results/02-chat-button.png' });
    
    // 버튼 클릭
    await chatButton.click();
    await page.waitForTimeout(1000);
    
    // 채팅 창이 열렸는지 확인
    const chatWindow = page.locator('.ai-chatops-chat-window');
    await expect(chatWindow).toBeVisible();
    
    // 채팅 창 스크린샷
    await page.screenshot({ 
      path: 'test-results/03-chat-window-opened.png', 
      fullPage: true 
    });
  });

  test('채팅 창 UI 요소 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 채팅 버튼 클릭하여 창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(1000);
    
    const chatWindow = page.locator('.ai-chatops-chat-window');
    await expect(chatWindow).toBeVisible();
    
    // 헤더 요소들 확인
    const botInfo = chatWindow.locator('.bot-info');
    await expect(botInfo).toBeVisible();
    
    // AI ChatOps 타이틀 확인
    const titleElement = botInfo.locator('.name');
    await expect(titleElement).toBeVisible();
    
    // 상태 표시 확인
    const statusElement = botInfo.locator('.status');
    await expect(statusElement).toBeVisible();
    
    // 테마 셀렉터 확인
    const themeSelector = chatWindow.locator('.theme-selector');
    await expect(themeSelector).toBeVisible();
    
    // 언어 버튼 확인
    const languageBtn = chatWindow.locator('.language-btn');
    await expect(languageBtn).toBeVisible();
    
    // 창 컨트롤 버튼들 확인
    const windowControls = chatWindow.locator('.window-controls');
    await expect(windowControls).toBeVisible();
    
    // 헤더 영역 스크린샷
    await chatWindow.locator('.chat-header').screenshot({ 
      path: 'test-results/04-chat-header.png' 
    });
  });

  test('카테고리 선택 화면 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 채팅 창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(1000);
    
    // 카테고리 선택 화면 확인
    const categorySelect = page.locator('.category-select');
    await expect(categorySelect).toBeVisible();
    
    // 환영 섹션 확인
    const welcomeSection = categorySelect.locator('.welcome-section');
    await expect(welcomeSection).toBeVisible();
    
    // 카테고리 그리드 확인
    const categoryGrid = categorySelect.locator('.category-grid');
    await expect(categoryGrid).toBeVisible();
    
    // 카테고리 카드들 확인
    const categoryCards = categoryGrid.locator('.category-card');
    await expect(categoryCards).toHaveCount(3); // personal, general, operation 카테고리
    
    // 카테고리 영역 스크린샷
    await categorySelect.screenshot({ 
      path: 'test-results/05-category-selection.png' 
    });
    
    // 첫 번째 카테고리 클릭
    await categoryCards.first().click();
    await page.waitForTimeout(1000);
    
    // 클릭 후 화면 스크린샷
    await page.screenshot({ 
      path: 'test-results/06-after-category-click.png', 
      fullPage: true 
    });
  });

  test('아이콘 표시 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 채팅 창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(1000);
    
    // unicon 요소들이 존재하는지 확인
    const icons = page.locator('unicon');
    const iconCount = await icons.count();
    
    console.log(`Found ${iconCount} unicon elements`);
    
    // 각 아이콘이 실제로 렌더링되었는지 확인
    for (let i = 0; i < Math.min(iconCount, 5); i++) {
      const icon = icons.nth(i);
      await expect(icon).toBeVisible();
    }
    
    // 아이콘들 스크린샷
    if (iconCount > 0) {
      await page.screenshot({ 
        path: 'test-results/07-icons-check.png', 
        fullPage: true 
      });
    }
  });

  test('테마 변경 테스트', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 채팅 창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(1000);
    
    // 테마 셀렉터 클릭
    const themeSelector = page.locator('.theme-selector');
    await themeSelector.click();
    await page.waitForTimeout(500);
    
    // 테마 변경 후 스크린샷
    await page.screenshot({ 
      path: 'test-results/08-theme-changed.png', 
      fullPage: true 
    });
  });

  test('언어 변경 테스트', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 채팅 창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(1000);
    
    // 언어 버튼 클릭
    const languageBtn = page.locator('.language-btn');
    await languageBtn.click();
    await page.waitForTimeout(500);
    
    // 언어 변경 후 스크린샷
    await page.screenshot({ 
      path: 'test-results/09-language-changed.png', 
      fullPage: true 
    });
  });

  test('창 닫기 테스트', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 채팅 창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(1000);
    
    // 닫기 버튼 클릭
    const closeBtn = page.locator('.window-control-btn').last();
    await closeBtn.click();
    await page.waitForTimeout(500);
    
    // 채팅 창이 닫혔는지 확인
    const chatWindow = page.locator('.ai-chatops-chat-window');
    await expect(chatWindow).not.toBeVisible();
    
    // 닫힌 후 스크린샷
    await page.screenshot({ 
      path: 'test-results/10-chat-closed.png', 
      fullPage: true 
    });
  });
});