import { test, expect } from '@playwright/test';

test.describe('AI ChatOps 인터랙션 테스트', () => {
  test('완전한 시나리오 테스트 - 매뉴얼 기반', async ({ page }) => {
    // 콘솔 로그 모니터링
    page.on('console', msg => {
      console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
    });
    
    // 네트워크 에러 모니터링
    page.on('pageerror', error => {
      console.log(`Page Error: ${error.message}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1단계: 초기 화면 확인');
    await page.screenshot({ 
      path: 'test-results/interaction-01-initial.png', 
      fullPage: true 
    });
    
    // 1단계: 플로팅 버튼 클릭 (매뉴얼 참조)
    console.log('2단계: 플로팅 버튼 찾기');
    const chatButton = page.locator('.ai-chatops-chat-button');
    await expect(chatButton).toBeVisible();
    
    // 버튼 상태 확인
    const isEnabled = await chatButton.isEnabled();
    console.log(`플로팅 버튼 활성화 상태: ${isEnabled}`);
    
    // 강제로 클릭 (JavaScript를 통해)
    await page.evaluate(() => {
      const button = document.querySelector('.ai-chatops-chat-button');
      if (button) {
        button.click();
      }
    });
    
    await page.waitForTimeout(2000);
    
    console.log('3단계: 채팅창 열기 후 확인');
    await page.screenshot({ 
      path: 'test-results/interaction-02-chat-opened.png', 
      fullPage: true 
    });
    
    // 채팅창이 열렸는지 확인
    const chatWindow = page.locator('.ai-chatops-chat-window');
    const isVisible = await chatWindow.isVisible();
    console.log(`채팅창 표시 상태: ${isVisible}`);
    
    if (isVisible) {
      // 2단계: 카테고리 선택 (운영/관리 선택)
      console.log('4단계: 운영/관리 카테고리 선택');
      
      // 카테고리 카드들 확인
      const categoryCards = page.locator('.category-card');
      const cardCount = await categoryCards.count();
      console.log(`카테고리 카드 개수: ${cardCount}`);
      
      // 운영/관리 카테고리 찾기 (매뉴얼 기준으로 세 번째 카드)
      if (cardCount >= 3) {
        const operationCategory = categoryCards.nth(2); // 세 번째 카드 (운영/관리)
        
        // 클릭하기 전 스크린샷
        await operationCategory.screenshot({ 
          path: 'test-results/interaction-03-operation-category.png' 
        });
        
        // 강제 클릭
        await page.evaluate(() => {
          const cards = document.querySelectorAll('.category-card');
          if (cards.length >= 3) {
            cards[2].click(); // 운영/관리 카테고리
          }
        });
        
        await page.waitForTimeout(2000);
        
        console.log('5단계: 페르소나 목록 화면');
        await page.screenshot({ 
          path: 'test-results/interaction-04-persona-list.png', 
          fullPage: true 
        });
        
        // 페르소나 카드들 확인
        const personaCards = page.locator('.persona-card');
        const personaCount = await personaCards.count();
        console.log(`페르소나 카드 개수: ${personaCount}`);
        
        if (personaCount > 0) {
          // 3단계: 첫 번째 페르소나 선택 (프로젝트 관리자로 가정)
          console.log('6단계: 첫 번째 페르소나 선택');
          
          const firstPersona = personaCards.first();
          await firstPersona.screenshot({ 
            path: 'test-results/interaction-05-first-persona.png' 
          });
          
          // 페르소나 클릭
          await page.evaluate(() => {
            const personas = document.querySelectorAll('.persona-card');
            if (personas.length > 0) {
              personas[0].click();
            }
          });
          
          await page.waitForTimeout(3000);
          
          console.log('7단계: 채팅 화면 전환');
          await page.screenshot({ 
            path: 'test-results/interaction-06-chat-interface.png', 
            fullPage: true 
        });
          
          // 채팅 인터페이스 확인
          const chatArea = page.locator('.chat-area');
          const hasChatArea = await chatArea.count() > 0;
          console.log(`채팅 영역 존재: ${hasChatArea}`);
          
          if (hasChatArea) {
            // 4단계: 메시지 입력 및 전송
            console.log('8단계: 메시지 입력 테스트');
            
            const messageInput = page.locator('textarea, input[type="text"], .enhanced-input');
            const inputCount = await messageInput.count();
            console.log(`입력 필드 개수: ${inputCount}`);
            
            if (inputCount > 0) {
              const input = messageInput.first();
              await input.fill('현재 진행 중인 프로젝트 목록을 알려줘');
              await page.waitForTimeout(1000);
              
              await page.screenshot({ 
                path: 'test-results/interaction-07-message-typed.png', 
                fullPage: true 
              });
              
              // 전송 버튼 찾기 및 클릭
              const sendButton = page.locator('.send-btn, .btn-send, button[type="submit"]');
              const sendCount = await sendButton.count();
              console.log(`전송 버튼 개수: ${sendCount}`);
              
              if (sendCount > 0) {
                await sendButton.first().click();
                await page.waitForTimeout(3000);
                
                console.log('9단계: 메시지 전송 후');
                await page.screenshot({ 
                  path: 'test-results/interaction-08-message-sent.png', 
                  fullPage: true 
                });
              }
            }
          }
        }
      }
      
      // 추가 기능 테스트
      console.log('10단계: 추가 기능 테스트');
      
      // 테마 변경 테스트
      const themeButton = page.locator('.theme-selector');
      const hasThemeButton = await themeButton.count() > 0;
      console.log(`테마 버튼 존재: ${hasThemeButton}`);
      
      if (hasThemeButton) {
        await themeButton.click();
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
          path: 'test-results/interaction-09-theme-changed.png', 
          fullPage: true 
        });
      }
      
      // 언어 변경 테스트
      const langButton = page.locator('.language-btn');
      const hasLangButton = await langButton.count() > 0;
      console.log(`언어 버튼 존재: ${hasLangButton}`);
      
      if (hasLangButton) {
        await langButton.click();
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
          path: 'test-results/interaction-10-language-changed.png', 
          fullPage: true 
        });
      }
    }
    
    console.log('시나리오 테스트 완료!');
  });

  test('디버깅: DOM 구조 분석', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 전체 DOM 구조 확인
    const bodyHtml = await page.locator('body').innerHTML();
    console.log('Body HTML (first 1000 chars):', bodyHtml.substring(0, 1000));
    
    // Vue 컴포넌트 마운트 확인
    const vueApp = page.locator('#app');
    const appHtml = await vueApp.innerHTML();
    console.log('Vue App HTML (first 1000 chars):', appHtml.substring(0, 1000));
    
    // AI ChatOps 컴포넌트 확인
    const aiChatOps = page.locator('.ai-chatops-chat');
    const chatOpExists = await aiChatOps.count() > 0;
    console.log(`AI ChatOps 컴포넌트 존재: ${chatOpExists}`);
    
    if (chatOpExists) {
      const chatOpsHtml = await aiChatOps.innerHTML();
      console.log('AI ChatOps HTML:', chatOpsHtml);
    }
    
    // 버튼 상세 분석
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`전체 버튼 개수: ${buttonCount}`);
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const className = await button.getAttribute('class');
      const text = await button.textContent();
      console.log(`버튼 ${i}: class="${className}", text="${text}"`);
    }
  });
});