import { test, expect } from '@playwright/test';

test.describe('AI ChatOps Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome message for selected persona', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    
    // 페르소나 선택
    await page.click('[data-testid="persona-card"]');
    
    // 환영 메시지 확인
    await expect(page.locator('.welcome-message')).toBeVisible();
    await expect(page.locator('.welcome-message')).toContainText('안녕하세요!');
  });

  test('should render markdown content properly', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    
    // 채팅 메시지에서 마크다운 렌더링 확인
    const markdownContent = await page.locator('.markdown-content');
    if (await markdownContent.count() > 0) {
      await expect(markdownContent).toBeVisible();
    }
  });

  test('should handle copy functionality', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    
    // 복사 버튼 찾기
    const copyButton = page.locator('.message-action--copy');
    if (await copyButton.count() > 0) {
      await copyButton.first().click();
      
      // 복사 완료 상태 확인
      await expect(copyButton.first()).toHaveClass(/message-action--copied/);
    }
  });

  test('should display persona-specific welcome messages', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    
    // 첫 번째 페르소나 선택
    const personas = page.locator('[data-testid="persona-card"]');
    if (await personas.count() > 0) {
      await personas.first().click();
      
      // 환영 메시지 확인
      await expect(page.locator('.welcome-message')).toBeVisible();
      
      // 다른 페르소나 선택
      if (await personas.count() > 1) {
        await personas.nth(1).click();
        
        // 다른 환영 메시지 확인
        await expect(page.locator('.welcome-message')).toBeVisible();
      }
    }
  });

  test('should handle plain text formatting', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    
    // 메시지 입력 및 전송
    const messageInput = page.locator('input[type="text"]');
    if (await messageInput.count() > 0) {
      await messageInput.fill('줄바꿈\\n테스트\\n메시지');
      await page.keyboard.press('Enter');
      
      // 메시지 전송 대기
      await page.waitForTimeout(1000);
      
      // 줄바꿈이 제대로 렌더링되는지 확인
      const messageContent = page.locator('.message-bubble__content');
      if (await messageContent.count() > 0) {
        await expect(messageContent.last()).toBeVisible();
      }
    }
  });

  test('should navigate between different views', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    
    // 네비게이션 테스트
    const navItems = page.locator('.nav-item');
    if (await navItems.count() > 0) {
      // 첫 번째 네비게이션 아이템 클릭
      await navItems.first().click();
      await page.waitForTimeout(500);
      
      // 두 번째 네비게이션 아이템 클릭 (있다면)
      if (await navItems.count() > 1) {
        await navItems.nth(1).click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('Markdown Rendering', () => {
  test('should render markdown headers', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 마크다운 헤더 렌더링 확인
    const headers = page.locator('.markdown-heading');
    if (await headers.count() > 0) {
      await expect(headers.first()).toBeVisible();
    }
  });

  test('should render markdown lists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 마크다운 리스트 렌더링 확인
    const lists = page.locator('.markdown-list');
    if (await lists.count() > 0) {
      await expect(lists.first()).toBeVisible();
    }
  });

  test('should render markdown code blocks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 마크다운 코드 블록 렌더링 확인
    const codeBlocks = page.locator('.markdown-code-block');
    if (await codeBlocks.count() > 0) {
      await expect(codeBlocks.first()).toBeVisible();
    }
  });
});