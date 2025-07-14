import { test, expect } from '@playwright/test';

test.describe('CSS 레이아웃 및 스타일링 검증', () => {
  test('전체 레이아웃 구조 및 스타일 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('🎨 CSS 레이아웃 검증 시작');
    
    // 1. 초기 화면 레이아웃 확인
    await page.screenshot({ 
      path: 'test-results/css-01-initial-layout.png', 
      fullPage: true 
    });
    
    // 2. 플로팅 버튼 스타일 검증
    console.log('🔘 플로팅 버튼 스타일 검증');
    const chatButton = page.locator('.ai-chatops-chat-button');
    
    const buttonStyles = await chatButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        bottom: styles.bottom,
        right: styles.right,
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        boxShadow: styles.boxShadow,
        display: styles.display,
        alignItems: styles.alignItems,
        justifyContent: styles.justifyContent
      };
    });
    
    console.log('플로팅 버튼 스타일:', JSON.stringify(buttonStyles, null, 2));
    
    // 플로팅 버튼 클릭 전 확대 스크린샷
    await chatButton.screenshot({ 
      path: 'test-results/css-02-floating-button.png' 
    });
    
    // 3. 채팅창 열기 및 레이아웃 확인
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    console.log('💬 채팅창 레이아웃 검증');
    const chatWindow = page.locator('.ai-chatops-chat-window');
    
    const windowStyles = await chatWindow.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        width: styles.width,
        height: styles.height,
        maxWidth: styles.maxWidth,
        maxHeight: styles.maxHeight,
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        boxShadow: styles.boxShadow,
        zIndex: styles.zIndex,
        transform: styles.transform,
        opacity: styles.opacity
      };
    });
    
    console.log('채팅창 스타일:', JSON.stringify(windowStyles, null, 2));
    
    await page.screenshot({ 
      path: 'test-results/css-03-chat-window-layout.png', 
      fullPage: true 
    });
    
    // 4. 헤더 영역 스타일 확인
    console.log('📋 헤더 영역 검증');
    const chatHeader = page.locator('.chat-header');
    
    if (await chatHeader.count() > 0) {
      const headerStyles = await chatHeader.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          height: styles.height,
          padding: styles.padding,
          backgroundColor: styles.backgroundColor,
          borderBottom: styles.borderBottom,
          display: styles.display,
          alignItems: styles.alignItems,
          justifyContent: styles.justifyContent
        };
      });
      
      console.log('헤더 스타일:', JSON.stringify(headerStyles, null, 2));
      
      await chatHeader.screenshot({ 
        path: 'test-results/css-04-header-section.png' 
      });
    }
    
    // 5. 카테고리 카드 스타일 확인
    console.log('🎯 카테고리 카드 스타일 검증');
    const categoryCards = page.locator('.category-card');
    const cardCount = await categoryCards.count();
    
    if (cardCount > 0) {
      for (let i = 0; i < cardCount; i++) {
        const card = categoryCards.nth(i);
        const cardStyles = await card.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            flexDirection: styles.flexDirection,
            padding: styles.padding,
            margin: styles.margin,
            borderRadius: styles.borderRadius,
            backgroundColor: styles.backgroundColor,
            border: styles.border,
            boxShadow: styles.boxShadow,
            cursor: styles.cursor,
            transition: styles.transition
          };
        });
        
        console.log(`카테고리 카드 ${i} 스타일:`, JSON.stringify(cardStyles, null, 2));
        
        await card.screenshot({ 
          path: `test-results/css-05-category-card-${i}.png` 
        });
      }
      
      // 카테고리 그리드 레이아웃 확인
      const categoryGrid = page.locator('.category-grid');
      if (await categoryGrid.count() > 0) {
        const gridStyles = await categoryGrid.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            gridTemplateColumns: styles.gridTemplateColumns,
            gap: styles.gap,
            padding: styles.padding
          };
        });
        
        console.log('카테고리 그리드 스타일:', JSON.stringify(gridStyles, null, 2));
      }
    }
    
    // 6. 운영/관리 카테고리 선택 후 페르소나 화면 확인
    if (cardCount >= 3) {
      await categoryCards.nth(2).click();
      await page.waitForTimeout(2000);
      
      console.log('👤 페르소나 리스트 레이아웃 검증');
      await page.screenshot({ 
        path: 'test-results/css-06-persona-list-layout.png', 
        fullPage: true 
      });
      
      // 페르소나 카드 스타일 확인
      const personaCards = page.locator('.persona-card');
      const personaCount = await personaCards.count();
      
      if (personaCount > 0) {
        const personaCard = personaCards.first();
        const personaStyles = await personaCard.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            padding: styles.padding,
            margin: styles.margin,
            borderRadius: styles.borderRadius,
            backgroundColor: styles.backgroundColor,
            border: styles.border,
            boxShadow: styles.boxShadow,
            transition: styles.transition
          };
        });
        
        console.log('페르소나 카드 스타일:', JSON.stringify(personaStyles, null, 2));
        
        await personaCard.screenshot({ 
          path: 'test-results/css-07-persona-card.png' 
        });
        
        // 7. 채팅 인터페이스로 전환 후 레이아웃 확인
        await personaCard.click();
        await page.waitForTimeout(3000);
        
        console.log('💬 채팅 인터페이스 레이아웃 검증');
        await page.screenshot({ 
          path: 'test-results/css-08-chat-interface-layout.png', 
          fullPage: true 
        });
        
        // 메시지 입력 영역 스타일 확인
        const inputContainer = page.locator('.input-container, .chat-input-container');
        if (await inputContainer.count() > 0) {
          const inputStyles = await inputContainer.first().evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              position: styles.position,
              bottom: styles.bottom,
              left: styles.left,
              right: styles.right,
              padding: styles.padding,
              backgroundColor: styles.backgroundColor,
              borderTop: styles.borderTop,
              display: styles.display,
              alignItems: styles.alignItems
            };
          });
          
          console.log('입력 영역 스타일:', JSON.stringify(inputStyles, null, 2));
          
          await inputContainer.first().screenshot({ 
            path: 'test-results/css-09-input-area.png' 
          });
        }
      }
    }
    
    console.log('✅ CSS 레이아웃 검증 완료');
  });

  test('테마 시스템 검증', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('🎨 테마 시스템 검증 시작');
    
    // 채팅창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(2000);
    
    // 기본 테마 확인
    await page.screenshot({ 
      path: 'test-results/theme-01-default.png', 
      fullPage: true 
    });
    
    // CSS 변수 확인
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(root);
      return {
        primaryColor: styles.getPropertyValue('--color-primary'),
        accentColor: styles.getPropertyValue('--color-accent'),
        surfaceWhite: styles.getPropertyValue('--color-surface-white'),
        textPrimary: styles.getPropertyValue('--color-text-primary'),
        borderLight: styles.getPropertyValue('--color-border-light')
      };
    });
    
    console.log('기본 테마 CSS 변수:', JSON.stringify(rootStyles, null, 2));
    
    // 테마 버튼이 있다면 클릭해보기
    const themeButton = page.locator('.theme-selector');
    if (await themeButton.count() > 0) {
      console.log('🔄 테마 변경 테스트');
      
      // 테마 버튼 스타일 확인
      const themeButtonStyles = await themeButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize
        };
      });
      
      console.log('테마 버튼 스타일:', JSON.stringify(themeButtonStyles, null, 2));
      
      try {
        // 스크롤해서 테마 버튼이 보이도록 함
        await themeButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        
        // 클릭 시도
        await themeButton.click({ timeout: 10000 });
        await page.waitForTimeout(2000);
        
        // 테마 변경 후 스크린샷
        await page.screenshot({ 
          path: 'test-results/theme-02-changed.png', 
          fullPage: true 
        });
        
        // 변경된 CSS 변수 확인
        const changedStyles = await page.evaluate(() => {
          const root = document.documentElement;
          const styles = window.getComputedStyle(root);
          return {
            primaryColor: styles.getPropertyValue('--color-primary'),
            accentColor: styles.getPropertyValue('--color-accent'),
            surfaceWhite: styles.getPropertyValue('--color-surface-white'),
            textPrimary: styles.getPropertyValue('--color-text-primary'),
            borderLight: styles.getPropertyValue('--color-border-light')
          };
        });
        
        console.log('변경된 테마 CSS 변수:', JSON.stringify(changedStyles, null, 2));
        
      } catch (error) {
        console.log('⚠️ 테마 변경 실패:', error.message);
      }
    }
    
    console.log('✅ 테마 시스템 검증 완료');
  });

  test('반응형 디자인 검증', async ({ page }) => {
    console.log('📱 반응형 디자인 검증 시작');
    
    // 데스크톱 사이즈 (기본)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-01-desktop.png', 
      fullPage: true 
    });
    
    // 태블릿 사이즈
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-02-tablet.png', 
      fullPage: true 
    });
    
    // 모바일 사이즈
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/responsive-03-mobile.png', 
      fullPage: true 
    });
    
    // 모바일에서 레이아웃 확인
    const chatWindow = page.locator('.ai-chatops-chat-window');
    if (await chatWindow.count() > 0) {
      const mobileStyles = await chatWindow.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          width: styles.width,
          height: styles.height,
          maxWidth: styles.maxWidth,
          maxHeight: styles.maxHeight,
          position: styles.position,
          top: styles.top,
          left: styles.left,
          right: styles.right,
          bottom: styles.bottom
        };
      });
      
      console.log('모바일 채팅창 스타일:', JSON.stringify(mobileStyles, null, 2));
    }
    
    console.log('✅ 반응형 디자인 검증 완료');
  });
});