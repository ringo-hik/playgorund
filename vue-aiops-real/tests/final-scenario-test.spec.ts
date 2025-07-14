import { test, expect } from '@playwright/test';

test.describe('완전한 AI ChatOps 시나리오 테스트', () => {
  test('매뉴얼 기반 완전 시나리오', async ({ page }) => {
    // 콘솔 및 에러 모니터링
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ Browser Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        console.log(`⚠️ Browser Warning: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`🔥 Page Error: ${error.message}`);
    });

    console.log('🚀 시나리오 시작 - AI ChatOps 완전 테스트');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // API 로딩 대기
    
    // 1단계: 초기 화면 확인
    console.log('📸 1단계: 초기 화면 스크린샷');
    await page.screenshot({ 
      path: 'test-results/scenario-01-initial.png', 
      fullPage: true 
    });
    
    // 2단계: 플로팅 버튼 클릭
    console.log('🔘 2단계: AI ChatOps 플로팅 버튼 클릭');
    const chatButton = page.locator('.ai-chatops-chat-button');
    await expect(chatButton).toBeVisible();
    
    await chatButton.click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: 'test-results/scenario-02-chat-opened.png', 
      fullPage: true 
    });
    
    // 3단계: 카테고리 선택 확인
    console.log('📋 3단계: 카테고리 선택 화면 확인');
    const categoryCards = page.locator('.category-card');
    const cardCount = await categoryCards.count();
    console.log(`   카테고리 카드 개수: ${cardCount}`);
    
    if (cardCount >= 3) {
      // 운영/관리 카테고리 선택 (세 번째 카드)
      console.log('⚙️ 4단계: 운영/관리 카테고리 선택');
      const operationCategory = categoryCards.nth(2);
      
      await operationCategory.screenshot({ 
        path: 'test-results/scenario-03-operation-category.png' 
      });
      
      await operationCategory.click();
      await page.waitForTimeout(3000);
      
      console.log('📸 5단계: 페르소나 목록 화면');
      await page.screenshot({ 
        path: 'test-results/scenario-04-persona-list.png', 
        fullPage: true 
      });
      
      // 페르소나 카드 확인
      const personaCards = page.locator('.persona-card');
      const personaCount = await personaCards.count();
      console.log(`   페르소나 카드 개수: ${personaCount}`);
      
      if (personaCount > 0) {
        // 첫 번째 페르소나 선택
        console.log('👤 6단계: 첫 번째 페르소나 선택');
        const firstPersona = personaCards.first();
        
        await firstPersona.screenshot({ 
          path: 'test-results/scenario-05-selected-persona.png' 
        });
        
        await firstPersona.click();
        await page.waitForTimeout(4000);
        
        console.log('💬 7단계: 채팅 인터페이스 확인');
        await page.screenshot({ 
          path: 'test-results/scenario-06-chat-interface.png', 
          fullPage: true 
        });
        
        // 채팅 입력 테스트
        console.log('✍️ 8단계: 메시지 입력 테스트');
        const inputSelectors = [
          'textarea',
          'input[type="text"]',
          '.enhanced-input',
          '.chat-input',
          '.message-input'
        ];
        
        let messageInput = null;
        for (const selector of inputSelectors) {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            messageInput = elements.first();
            console.log(`   입력 필드 발견: ${selector}`);
            break;
          }
        }
        
        if (messageInput) {
          await messageInput.fill('안녕하세요! 현재 진행 중인 프로젝트 목록을 알려주세요.');
          await page.waitForTimeout(2000);
          
          await page.screenshot({ 
            path: 'test-results/scenario-07-message-typed.png', 
            fullPage: true 
          });
          
          // 전송 버튼 찾기
          const sendSelectors = [
            '.send-btn',
            '.btn-send',
            'button[type="submit"]',
            '.send-button',
            '.submit-btn'
          ];
          
          let sendButton = null;
          for (const selector of sendSelectors) {
            const elements = page.locator(selector);
            const count = await elements.count();
            if (count > 0) {
              sendButton = elements.first();
              console.log(`   전송 버튼 발견: ${selector}`);
              break;
            }
          }
          
          if (sendButton) {
            await sendButton.click();
            console.log('📤 메시지 전송됨!');
            await page.waitForTimeout(5000);
            
            await page.screenshot({ 
              path: 'test-results/scenario-08-message-sent.png', 
              fullPage: true 
            });
          } else {
            console.log('⚠️ 전송 버튼을 찾을 수 없음 - Enter 키 시도');
            await messageInput.press('Enter');
            await page.waitForTimeout(5000);
            
            await page.screenshot({ 
              path: 'test-results/scenario-08-message-sent-enter.png', 
              fullPage: true 
            });
          }
        } else {
          console.log('❌ 메시지 입력 필드를 찾을 수 없음');
        }
        
        // 추가 기능 테스트
        console.log('🎨 9단계: 테마 변경 테스트');
        const themeButton = page.locator('.theme-selector');
        const hasTheme = await themeButton.count() > 0;
        
        if (hasTheme) {
          // 스크롤하여 테마 버튼이 보이도록 함
          await themeButton.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1000);
          
          try {
            await themeButton.click({ timeout: 5000 });
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
              path: 'test-results/scenario-09-theme-changed.png', 
              fullPage: true 
            });
            console.log('✅ 테마 변경 성공');
          } catch (error) {
            console.log('⚠️ 테마 버튼 클릭 실패:', error.message);
          }
        }
        
        console.log('🌐 10단계: 언어 변경 테스트');
        const langButton = page.locator('.language-btn');
        const hasLang = await langButton.count() > 0;
        
        if (hasLang) {
          await langButton.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1000);
          
          try {
            await langButton.click({ timeout: 5000 });
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
              path: 'test-results/scenario-10-language-changed.png', 
              fullPage: true 
            });
            console.log('✅ 언어 변경 성공');
          } catch (error) {
            console.log('⚠️ 언어 버튼 클릭 실패:', error.message);
          }
        }
        
      } else {
        console.log('❌ 페르소나 카드가 없음 - API 연결 문제일 수 있음');
      }
    } else {
      console.log('❌ 카테고리 카드가 충분하지 않음');
    }
    
    console.log('🎉 시나리오 테스트 완료!');
  });

  test('API 연결 테스트', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 5초 대기하여 API 호출이 완료되도록 함
    await page.waitForTimeout(5000);
    
    // 개발자 도구에서 네트워크 요청 확인
    const personaResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/v1/devportal/ai-chatops-chat/personas');
        const data = await response.json();
        return { success: true, data, status: response.status };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('API 응답:', JSON.stringify(personaResponse, null, 2));
    
    if (personaResponse.success) {
      console.log(`✅ API 연결 성공 - ${personaResponse.data.length}개 페르소나 로딩됨`);
    } else {
      console.log(`❌ API 연결 실패: ${personaResponse.error}`);
    }
    
    await page.screenshot({ 
      path: 'test-results/api-test-result.png', 
      fullPage: true 
    });
  });
});