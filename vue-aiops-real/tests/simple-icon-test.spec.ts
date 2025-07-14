import { test, expect } from '@playwright/test';

test.describe('간단한 아이콘 테스트', () => {
  test('AI ChatOps 버튼 클릭하고 아이콘 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 초기 화면 스크린샷
    await page.screenshot({ 
      path: 'test-results/simple-01-initial.png', 
      fullPage: true 
    });
    
    // AI ChatOps 버튼 클릭
    const chatButton = page.locator('.ai-chatops-chat-button');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    // 채팅창 열린 후 스크린샷
    await page.screenshot({ 
      path: 'test-results/simple-02-chat-opened.png', 
      fullPage: true 
    });
    
    // 아이콘 수 확인
    const uniconElements = page.locator('unicon');
    const iconCount = await uniconElements.count();
    console.log(`총 unicon 요소 개수: ${iconCount}`);
    
    // Iconify 아이콘 확인
    const iconifyElements = page.locator('svg[data-icon]');
    const iconifyCount = await iconifyElements.count();
    console.log(`총 Iconify 아이콘 개수: ${iconifyCount}`);
    
    // 개별 아이콘 상태 확인
    if (iconCount > 0) {
      for (let i = 0; i < Math.min(iconCount, 10); i++) {
        const icon = uniconElements.nth(i);
        const isVisible = await icon.isVisible();
        console.log(`아이콘 ${i}: visible = ${isVisible}`);
      }
    }
    
    // 카테고리 카드 개별 스크린샷
    const categoryCards = page.locator('.category-card');
    const cardCount = await categoryCards.count();
    console.log(`카테고리 카드 개수: ${cardCount}`);
    
    for (let i = 0; i < cardCount; i++) {
      const card = categoryCards.nth(i);
      await card.screenshot({ 
        path: `test-results/simple-03-category-${i}.png` 
      });
    }
  });
});