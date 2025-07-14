import { test, expect } from '@playwright/test';

test('간단한 CSS 변수 및 디자인 확인', async ({ page }) => {
  console.log('🔍 CSS 변수 및 디자인 확인 시작');
  
  await page.goto('/');
  await page.waitForTimeout(3000);
  
  // CSS 변수 확인
  const cssVars = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      colorPrimary: style.getPropertyValue('--color-primary').trim(),
      spaceMd: style.getPropertyValue('--space-md').trim(),
      layoutChatWidth: style.getPropertyValue('--layout-chat-width').trim(),
      shadowFloating: style.getPropertyValue('--shadow-floating').trim()
    };
  });
  
  console.log('CSS 변수:', cssVars);
  
  // 플로팅 버튼 클릭
  await page.click('.ai-chatops-chat-button');
  await page.waitForTimeout(2000);
  
  // 스타일 확인
  const styles = await page.evaluate(() => {
    const button = document.querySelector('.ai-chatops-chat-button');
    const window = document.querySelector('.ai-chatops-chat-window');
    const card = document.querySelector('.category-card');
    
    return {
      buttonSize: button ? getComputedStyle(button).width : 'none',
      windowWidth: window ? getComputedStyle(window).width : 'none',
      cardPadding: card ? getComputedStyle(card).padding : 'none'
    };
  });
  
  console.log('컴포넌트 스타일:', styles);
  
  await page.screenshot({ path: 'test-results/simple-check.png', fullPage: true });
  
  console.log('✅ 확인 완료');
});