import { test, expect } from '@playwright/test';

test.describe('실시간 실행 화면 캡처', () => {
  test('전체 워크플로우 실시간 캡처', async ({ page }) => {
    console.log('🚀 실시간 실행 화면 캡처 시작');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. 초기 로딩 화면
    console.log('📸 1단계: 초기 화면');
    await page.screenshot({ 
      path: 'test-results/live-01-initial-page.png', 
      fullPage: true 
    });
    
    // 2. 플로팅 버튼 상세 캡처
    console.log('🔘 2단계: 플로팅 버튼 확대');
    const chatButton = page.locator('.ai-chatops-chat-button');
    await expect(chatButton).toBeVisible();
    
    // 플로팅 버튼 주변 영역 캡처
    await chatButton.screenshot({ 
      path: 'test-results/live-02-floating-button-detail.png' 
    });
    
    // 3. 플로팅 버튼 클릭 및 애니메이션
    console.log('🎬 3단계: 버튼 클릭 및 채팅창 열기');
    await chatButton.click();
    
    // 애니메이션 진행 중 캡처
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'test-results/live-03-opening-animation.png', 
      fullPage: true 
    });
    
    // 완전히 열린 후
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/live-04-chat-window-open.png', 
      fullPage: true 
    });
    
    // 4. 채팅창 헤더 영역 상세
    console.log('📋 4단계: 헤더 영역 상세');
    const chatHeader = page.locator('.chat-header');
    if (await chatHeader.count() > 0) {
      await chatHeader.screenshot({ 
        path: 'test-results/live-05-header-detail.png' 
      });
    }
    
    // 5. 카테고리 영역 상세
    console.log('🎯 5단계: 카테고리 선택 영역');
    const categorySection = page.locator('.category-select');
    if (await categorySection.count() > 0) {
      await categorySection.screenshot({ 
        path: 'test-results/live-06-category-section.png' 
      });
    }
    
    // 각 카테고리 카드 개별 캡처
    const categoryCards = page.locator('.category-card');
    const cardCount = await categoryCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = categoryCards.nth(i);
      
      // 호버 효과 시뮬레이션
      await card.hover();
      await page.waitForTimeout(300);
      
      await card.screenshot({ 
        path: `test-results/live-07-category-${i}-hover.png` 
      });
    }
    
    // 6. 운영/관리 카테고리 선택
    console.log('⚙️ 6단계: 운영/관리 카테고리 선택');
    if (cardCount >= 3) {
      await categoryCards.nth(2).click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'test-results/live-08-persona-list.png', 
        fullPage: true 
      });
      
      // 7. 페르소나 카드 상세
      console.log('👤 7단계: 페르소나 카드 상세');
      const personaCards = page.locator('.persona-card');
      const personaCount = await personaCards.count();
      
      if (personaCount > 0) {
        const firstPersona = personaCards.first();
        
        // 호버 효과
        await firstPersona.hover();
        await page.waitForTimeout(300);
        
        await firstPersona.screenshot({ 
          path: 'test-results/live-09-persona-hover.png' 
        });
        
        // 8. 페르소나 선택 및 채팅 화면 전환
        console.log('💬 8단계: 채팅 화면 전환');
        await firstPersona.click();
        await page.waitForTimeout(3000);
        
        await page.screenshot({ 
          path: 'test-results/live-10-chat-interface.png', 
          fullPage: true 
        });
        
        // 9. 메시지 입력 영역 상세
        console.log('✍️ 9단계: 메시지 입력 영역');
        const inputArea = page.locator('.input-container, .chat-input-container');
        if (await inputArea.count() > 0) {
          await inputArea.first().screenshot({ 
            path: 'test-results/live-11-input-area-detail.png' 
          });
        }
        
        // 10. 메시지 입력 및 전송
        console.log('📤 10단계: 메시지 입력 및 전송');
        const messageInput = page.locator('textarea').first();
        if (await messageInput.count() > 0) {
          await messageInput.fill('안녕하세요! 시스템 상태를 확인해주세요.');
          await page.waitForTimeout(1000);
          
          await page.screenshot({ 
            path: 'test-results/live-12-message-typing.png', 
            fullPage: true 
          });
          
          // 전송 버튼 찾기 및 클릭
          const sendButton = page.locator('.send-button, .btn-send');
          if (await sendButton.count() > 0) {
            await sendButton.first().click();
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
              path: 'test-results/live-13-message-sent.png', 
              fullPage: true 
            });
            
            // AI 응답 대기 및 캡처
            await page.waitForTimeout(3000);
            await page.screenshot({ 
              path: 'test-results/live-14-ai-response.png', 
              fullPage: true 
            });
          }
        }
        
        // 11. 전체 채팅 히스토리
        console.log('📜 11단계: 전체 채팅 히스토리');
        const messagesContainer = page.locator('.messages-container, .chat-messages');
        if (await messagesContainer.count() > 0) {
          await messagesContainer.first().screenshot({ 
            path: 'test-results/live-15-chat-history.png' 
          });
        }
      }
    }
    
    // 12. 윈도우 컨트롤 버튼들
    console.log('🎛️ 12단계: 윈도우 컨트롤');
    const windowControls = page.locator('.window-controls');
    if (await windowControls.count() > 0) {
      await windowControls.screenshot({ 
        path: 'test-results/live-16-window-controls.png' 
      });
    }
    
    // 13. 테마/언어 설정 버튼들
    console.log('⚙️ 13단계: 설정 버튼들');
    const themeButton = page.locator('.theme-selector');
    const langButton = page.locator('.language-btn');
    
    if (await themeButton.count() > 0) {
      await themeButton.screenshot({ 
        path: 'test-results/live-17-theme-button.png' 
      });
    }
    
    if (await langButton.count() > 0) {
      await langButton.screenshot({ 
        path: 'test-results/live-18-language-button.png' 
      });
    }
    
    // 14. 최종 전체 화면
    console.log('🎊 14단계: 최종 전체 화면');
    await page.screenshot({ 
      path: 'test-results/live-19-final-state.png', 
      fullPage: true 
    });
    
    console.log('✅ 실시간 캡처 완료!');
  });

  test('다양한 뷰포트에서 실행 확인', async ({ page }) => {
    console.log('📱 다양한 화면 크기에서 실행 확인');
    
    // 대형 데스크톱
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/viewport-01-large-desktop.png', 
      fullPage: true 
    });
    
    // 일반 데스크톱
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/viewport-02-desktop.png', 
      fullPage: true 
    });
    
    // 태블릿
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/viewport-03-tablet.png', 
      fullPage: true 
    });
    
    // 모바일
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/viewport-04-mobile.png', 
      fullPage: true 
    });
    
    // 소형 모바일
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/viewport-05-small-mobile.png', 
      fullPage: true 
    });
    
    console.log('✅ 뷰포트 테스트 완료!');
  });
});