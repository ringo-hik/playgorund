import { test, expect } from '@playwright/test';

test.describe('CSS 로딩 및 스타일 적용 디버깅', () => {
  test('CSS 파일 로딩 및 변수 적용 확인', async ({ page }) => {
    console.log('🔍 CSS 로딩 상태 디버깅 시작');
    
    // 네트워크 요청 모니터링
    page.on('request', request => {
      if (request.url().includes('.css')) {
        console.log(`CSS 요청: ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('.css')) {
        console.log(`CSS 응답: ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. CSS 파일들이 로딩되었는지 확인
    const loadedStylesheets = await page.evaluate(() => {
      const stylesheets = [];
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        if (sheet.href) {
          stylesheets.push({
            href: sheet.href,
            disabled: sheet.disabled,
            rules: sheet.cssRules ? sheet.cssRules.length : 'blocked'
          });
        }
      }
      return stylesheets;
    });
    
    console.log('로딩된 스타일시트들:', JSON.stringify(loadedStylesheets, null, 2));
    
    // 2. CSS 변수가 올바르게 적용되었는지 확인
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      return {
        // 주요 색상 변수들
        colorPrimary: computedStyle.getPropertyValue('--color-primary').trim(),
        colorAccent: computedStyle.getPropertyValue('--color-accent').trim(),
        colorSurfaceWhite: computedStyle.getPropertyValue('--color-surface-white').trim(),
        colorTextPrimary: computedStyle.getPropertyValue('--color-text-primary').trim(),
        
        // 레이아웃 변수들
        layoutChatWidth: computedStyle.getPropertyValue('--layout-chat-width').trim(),
        layoutChatHeight: computedStyle.getPropertyValue('--layout-chat-height').trim(),
        layoutFloatSize: computedStyle.getPropertyValue('--layout-float-size').trim(),
        
        // 그림자 변수들
        shadowFloating: computedStyle.getPropertyValue('--shadow-floating').trim(),
        shadowSoft: computedStyle.getPropertyValue('--shadow-soft').trim(),
        
        // 스페이싱 변수들
        spaceMd: computedStyle.getPropertyValue('--space-md').trim(),
        spaceLg: computedStyle.getPropertyValue('--space-lg').trim(),
        
        // 보더 반경 변수들
        radiusLg: computedStyle.getPropertyValue('--radius-lg').trim(),
        radiusFull: computedStyle.getPropertyValue('--radius-full').trim()
      };
    });
    
    console.log('CSS 변수 값들:', JSON.stringify(cssVariables, null, 2));
    
    // 3. 플로팅 버튼 클릭하여 채팅창 열기
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(2000);
    
    // 4. 주요 컴포넌트들의 실제 적용된 스타일 확인
    const componentStyles = await page.evaluate(() => {
      const results = {};
      
      // 플로팅 버튼 스타일
      const floatingBtn = document.querySelector('.ai-chatops-chat-button');
      if (floatingBtn) {
        const style = getComputedStyle(floatingBtn);
        results.floatingButton = {
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
          backgroundColor: style.backgroundColor,
          boxShadow: style.boxShadow,
          position: style.position,
          bottom: style.bottom,
          right: style.right
        };
      }
      
      // 채팅창 스타일
      const chatWindow = document.querySelector('.ai-chatops-chat-window');
      if (chatWindow) {
        const style = getComputedStyle(chatWindow);
        results.chatWindow = {
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
          backgroundColor: style.backgroundColor,
          boxShadow: style.boxShadow,
          position: style.position
        };
      }
      
      // 헤더 스타일
      const chatHeader = document.querySelector('.chat-header');
      if (chatHeader) {
        const style = getComputedStyle(chatHeader);
        results.chatHeader = {
          height: style.height,
          backgroundColor: style.backgroundColor,
          borderBottom: style.borderBottom,
          padding: style.padding
        };
      }
      
      // 카테고리 카드 스타일
      const categoryCard = document.querySelector('.category-card');
      if (categoryCard) {
        const style = getComputedStyle(categoryCard);
        results.categoryCard = {
          display: style.display,
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
          backgroundColor: style.backgroundColor,
          border: style.border,
          boxShadow: style.boxShadow,
          cursor: style.cursor
        };
      }
      
      return results;
    });
    
    console.log('컴포넌트 실제 스타일들:', JSON.stringify(componentStyles, null, 2));
    
    // 5. CSS 클래스들이 올바르게 적용되었는지 확인
    const appliedClasses = await page.evaluate(() => {
      const elements = {
        floatingButton: document.querySelector('.ai-chatops-chat-button'),
        chatWindow: document.querySelector('.ai-chatops-chat-window'),
        chatHeader: document.querySelector('.chat-header'),
        categoryCards: document.querySelectorAll('.category-card'),
        categoryGrid: document.querySelector('.category-grid')
      };
      
      const results = {};
      
      for (const [key, element] of Object.entries(elements)) {
        if (element) {
          if (element.length !== undefined) { // NodeList
            results[key] = Array.from(element).map(el => ({
              classes: el.className,
              tagName: el.tagName
            }));
          } else { // Single element
            results[key] = {
              classes: element.className,
              tagName: element.tagName
            };
          }
        } else {
          results[key] = null;
        }
      }
      
      return results;
    });
    
    console.log('적용된 CSS 클래스들:', JSON.stringify(appliedClasses, null, 2));
    
    // 6. 문제가 있는 요소들 스크린샷
    await page.screenshot({ 
      path: 'test-results/css-debug-01-full-page.png', 
      fullPage: true 
    });
    
    // 개별 요소들 스크린샷
    const chatWindow = page.locator('.ai-chatops-chat-window');
    if (await chatWindow.count() > 0) {
      await chatWindow.screenshot({ 
        path: 'test-results/css-debug-02-chat-window.png' 
      });
    }
    
    // 7. 브라우저 개발자 도구 정보 수집
    const devToolsInfo = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        devicePixelRatio: window.devicePixelRatio,
        documentReady: document.readyState
      };
    });
    
    console.log('브라우저 정보:', JSON.stringify(devToolsInfo, null, 2));
    
    console.log('✅ CSS 디버깅 완료');
  });

  test('원본과 복사본 CSS 비교', async ({ page }) => {
    console.log('📋 CSS 파일 내용 비교');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Vue 앱의 CSS 내용 확인
    const cssContent = await page.evaluate(async () => {
      try {
        const response = await fetch('/src/components/aiOps/styles/aiChatOps.css');
        const text = await response.text();
        return {
          success: true,
          content: text.substring(0, 1000), // 첫 1000자만
          length: text.length
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('CSS 파일 로딩 결과:', JSON.stringify(cssContent, null, 2));
    
    // 중요한 CSS 규칙들이 적용되었는지 확인
    const importantRules = await page.evaluate(() => {
      const rules = [];
      
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        try {
          if (sheet.cssRules) {
            for (let j = 0; j < Math.min(sheet.cssRules.length, 50); j++) {
              const rule = sheet.cssRules[j];
              if (rule.selectorText && (
                rule.selectorText.includes('.ai-chatops') ||
                rule.selectorText.includes('.category-card') ||
                rule.selectorText.includes('.chat-header')
              )) {
                rules.push({
                  selector: rule.selectorText,
                  stylesheet: sheet.href || 'inline',
                  cssText: rule.cssText.substring(0, 200)
                });
              }
            }
          }
        } catch (e) {
          // CORS 제한으로 접근 불가한 스타일시트
        }
      }
      
      return rules;
    });
    
    console.log('중요한 CSS 규칙들:', JSON.stringify(importantRules, null, 2));
  });
});