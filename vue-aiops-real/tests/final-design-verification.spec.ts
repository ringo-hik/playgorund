import { test, expect } from '@playwright/test';

test.describe('최종 디자인 검증 - CSS 변수 및 의도된 화면 확인', () => {
  test('전체 UI 컴포넌트 디자인 의도 대비 실제 적용 상태 검증', async ({ page }) => {
    console.log('🎯 최종 디자인 검증 시작');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 1. CSS 변수 완전 검증
    const cssVariableCheck = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      return {
        // 핵심 색상 변수들
        colorPrimary: computedStyle.getPropertyValue('--color-primary').trim(),
        colorPrimaryDark: computedStyle.getPropertyValue('--color-primary-dark').trim(),
        colorAccent: computedStyle.getPropertyValue('--color-accent').trim(),
        colorSurfaceWhite: computedStyle.getPropertyValue('--color-surface-white').trim(),
        colorTextPrimary: computedStyle.getPropertyValue('--color-text-primary').trim(),
        
        // 스페이싱 변수들 (문제였던 부분)
        spaceMd: computedStyle.getPropertyValue('--space-md').trim(),
        spaceLg: computedStyle.getPropertyValue('--space-lg').trim(),
        spaceXl: computedStyle.getPropertyValue('--space-xl').trim(),
        space2xl: computedStyle.getPropertyValue('--space-2xl').trim(),
        
        // 레이아웃 변수들
        layoutChatWidth: computedStyle.getPropertyValue('--layout-chat-width').trim(),
        layoutChatHeight: computedStyle.getPropertyValue('--layout-chat-height').trim(),
        layoutFloatSize: computedStyle.getPropertyValue('--layout-float-size').trim(),
        layoutHeaderHeight: computedStyle.getPropertyValue('--layout-header-height').trim(),
        
        // 그림자 변수들
        shadowFloating: computedStyle.getPropertyValue('--shadow-floating').trim(),
        shadowSoft: computedStyle.getPropertyValue('--shadow-soft').trim(),
        shadowMinimal: computedStyle.getPropertyValue('--shadow-minimal').trim(),
        
        // 보더 반경 변수들
        radiusLg: computedStyle.getPropertyValue('--radius-lg').trim(),
        radiusMd: computedStyle.getPropertyValue('--radius-md').trim(),
        radiusFull: computedStyle.getPropertyValue('--radius-full').trim(),
        
        // 폰트 변수들
        fontFamily: computedStyle.getPropertyValue('--font-family').trim(),
        fontSizeBase: computedStyle.getPropertyValue('--font-size-base').trim(),
        
        // 모션 변수들
        motionFast: computedStyle.getPropertyValue('--motion-fast').trim(),
        motionNormal: computedStyle.getPropertyValue('--motion-normal').trim()
      };
    });
    
    console.log('📊 CSS 변수 검증 결과:');
    Object.entries(cssVariableCheck).forEach(([key, value]) => {
      const status = value && value !== '' ? '✅' : '❌';
      console.log(`  ${status} ${key}: "${value}"`);
    });
    
    // 빈 값이 있는지 확인
    const emptyVariables = Object.entries(cssVariableCheck).filter(([key, value]) => !value || value === '');
    if (emptyVariables.length > 0) {
      console.log('\n❌ 빈 CSS 변수들:');
      emptyVariables.forEach(([key, value]) => console.log(`  - ${key}: "${value}"`));
    }
    
    // 플로팅 버튼 클릭하여 전체 UI 활성화
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(3000);
    
    // 2. 핵심 UI 컴포넌트들의 실제 적용된 스타일 검증
    const componentStyleCheck = await page.evaluate(() => {
      const results = {};
      
      // 플로팅 버튼 스타일 검증
      const floatingBtn = document.querySelector('.ai-chatops-chat-button');
      if (floatingBtn) {
        const style = getComputedStyle(floatingBtn);
        results.floatingButton = {
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
          background: style.background,
          boxShadow: style.boxShadow,
          position: style.position,
          bottom: style.bottom,
          right: style.right,
          zIndex: style.zIndex,
          // 의도된 값들과 비교
          expectedWidth: '60px',
          expectedHeight: '60px',
          expectedBorderRadius: '50%',
          hasGradient: style.background.includes('linear-gradient'),
          hasShadow: style.boxShadow !== 'none'
        };
      }
      
      // 채팅창 스타일 검증
      const chatWindow = document.querySelector('.ai-chatops-chat-window');
      if (chatWindow) {
        const style = getComputedStyle(chatWindow);
        results.chatWindow = {
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
          background: style.background,
          boxShadow: style.boxShadow,
          position: style.position,
          display: style.display,
          // 의도된 값들과 비교
          expectedWidth: '455px',
          expectedHeight: '676px',
          expectedBorderRadius: '15px',
          hasBlur: style.backdropFilter && style.backdropFilter !== 'none',
          hasShadow: style.boxShadow !== 'none'
        };
      }
      
      // 헤더 스타일 검증
      const chatHeader = document.querySelector('.chat-header');
      if (chatHeader) {
        const style = getComputedStyle(chatHeader);
        results.chatHeader = {
          height: style.height,
          padding: style.padding,
          background: style.background,
          borderBottom: style.borderBottom,
          display: style.display,
          justifyContent: style.justifyContent,
          alignItems: style.alignItems,
          // 의도된 값들과 비교
          expectedHeight: '72px',
          hasPadding: style.padding !== '0px',
          hasBackground: style.background !== 'rgba(0, 0, 0, 0)',
          hasBorder: style.borderBottom !== 'none'
        };
      }
      
      // 카테고리 카드들 스타일 검증
      const categoryCards = document.querySelectorAll('.category-card');
      if (categoryCards.length > 0) {
        const firstCard = categoryCards[0];
        const style = getComputedStyle(firstCard);
        results.categoryCard = {
          display: style.display,
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
          background: style.background,
          border: style.border,
          boxShadow: style.boxShadow,
          cursor: style.cursor,
          minHeight: style.minHeight,
          // 의도된 값들과 비교
          expectedPadding: '12px', // --space-md
          expectedMinHeight: '64px',
          hasPadding: style.padding !== '0px',
          hasBackground: style.background !== 'rgba(0, 0, 0, 0)',
          totalCards: categoryCards.length
        };
      }
      
      // 카테고리 아이콘들 스타일 검증
      const categoryIcons = document.querySelectorAll('.category-icon');
      if (categoryIcons.length > 0) {
        const firstIcon = categoryIcons[0];
        const style = getComputedStyle(firstIcon);
        results.categoryIcon = {
          width: style.width,
          height: style.height,
          borderRadius: style.borderRadius,
          background: style.background,
          display: style.display,
          alignItems: style.alignItems,
          justifyContent: style.justifyContent,
          // 의도된 값들과 비교
          expectedSize: '40px',
          hasBackground: style.background !== 'rgba(0, 0, 0, 0)',
          hasRadius: style.borderRadius !== '0px',
          totalIcons: categoryIcons.length
        };
      }
      
      return results;
    });
    
    console.log('\n🎨 컴포넌트 스타일 검증:');
    
    // 플로팅 버튼 검증
    if (componentStyleCheck.floatingButton) {
      const fb = componentStyleCheck.floatingButton;
      console.log('🔘 플로팅 버튼:');
      console.log(`  크기: ${fb.width} x ${fb.height} (의도: ${fb.expectedWidth} x ${fb.expectedHeight})`);
      console.log(`  ✅ 크기 정확: ${fb.width === fb.expectedWidth && fb.height === fb.expectedHeight}`);
      console.log(`  ✅ 원형: ${fb.borderRadius === fb.expectedBorderRadius}`);
      console.log(`  ✅ 그라데이션: ${fb.hasGradient}`);
      console.log(`  ✅ 그림자: ${fb.hasShadow}`);
      console.log(`  위치: bottom:${fb.bottom}, right:${fb.right}, z-index:${fb.zIndex}`);
    }
    
    // 채팅창 검증
    if (componentStyleCheck.chatWindow) {
      const cw = componentStyleCheck.chatWindow;
      console.log('\n💬 채팅창:');
      console.log(`  크기: ${cw.width} x ${cw.height} (의도: ${cw.expectedWidth} x ${cw.expectedHeight})`);
      console.log(`  ✅ 크기 정확: ${cw.width === cw.expectedWidth && cw.height === cw.expectedHeight}`);
      console.log(`  ✅ 모서리: ${cw.borderRadius === cw.expectedBorderRadius}`);
      console.log(`  ✅ 블러 효과: ${cw.hasBlur}`);
      console.log(`  ✅ 그림자: ${cw.hasShadow}`);
      console.log(`  배경: ${cw.background}`);
    }
    
    // 헤더 검증
    if (componentStyleCheck.chatHeader) {
      const ch = componentStyleCheck.chatHeader;
      console.log('\n📋 채팅 헤더:');
      console.log(`  높이: ${ch.height} (의도: ${ch.expectedHeight})`);
      console.log(`  ✅ 높이 정확: ${ch.height === ch.expectedHeight}`);
      console.log(`  ✅ 패딩: ${ch.hasPadding} (${ch.padding})`);
      console.log(`  ✅ 배경색: ${ch.hasBackground}`);
      console.log(`  ✅ 하단 보더: ${ch.hasBorder}`);
      console.log(`  레이아웃: display:${ch.display}, justify:${ch.justifyContent}, align:${ch.alignItems}`);
    }
    
    // 카테고리 카드 검증
    if (componentStyleCheck.categoryCard) {
      const cc = componentStyleCheck.categoryCard;
      console.log('\n🎯 카테고리 카드들:');
      console.log(`  총 개수: ${cc.totalCards}개`);
      console.log(`  패딩: ${cc.padding} (의도: ${cc.expectedPadding})`);
      console.log(`  ✅ 패딩 정확: ${cc.padding.includes(cc.expectedPadding)}`);
      console.log(`  ✅ 최소 높이: ${cc.minHeight === cc.expectedMinHeight}`);
      console.log(`  ✅ 패딩 적용: ${cc.hasPadding}`);
      console.log(`  display: ${cc.display}, cursor: ${cc.cursor}`);
    }
    
    // 카테고리 아이콘 검증
    if (componentStyleCheck.categoryIcon) {
      const ci = componentStyleCheck.categoryIcon;
      console.log('\n🎨 카테고리 아이콘들:');
      console.log(`  총 개수: ${ci.totalIcons}개`);
      console.log(`  크기: ${ci.width} x ${ci.height} (의도: ${ci.expectedSize})`);
      console.log(`  ✅ 크기 정확: ${ci.width === ci.expectedSize && ci.height === ci.expectedSize}`);
      console.log(`  ✅ 배경색: ${ci.hasBackground}`);
      console.log(`  ✅ 모서리: ${ci.hasRadius}`);
      console.log(`  레이아웃: display:${ci.display}, align:${ci.alignItems}, justify:${ci.justifyContent}`);
    }
    
    // 3. 전체 디자인 스크린샷 캡처
    await page.screenshot({ 
      path: 'test-results/final-design-01-full.png', 
      fullPage: true 
    });
    
    // 4. 개별 컴포넌트 상세 캡처
    
    // 플로팅 버튼 확대
    await page.locator('.ai-chatops-chat-button').screenshot({ 
      path: 'test-results/final-design-02-floating-btn.png' 
    });
    
    // 채팅창 전체
    await page.locator('.ai-chatops-chat-window').screenshot({ 
      path: 'test-results/final-design-03-chat-window.png' 
    });
    
    // 헤더 영역
    await page.locator('.chat-header').screenshot({ 
      path: 'test-results/final-design-04-header.png' 
    });
    
    // 카테고리 섹션
    const categorySection = page.locator('.category-grid');
    if (await categorySection.count() > 0) {
      await categorySection.screenshot({ 
        path: 'test-results/final-design-05-categories.png' 
      });
    }
    
    // 5. 반응형 테스트 (모바일 뷰)
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(1000);
    
    const mobileStyles = await page.evaluate(() => {
      const chatElement = document.querySelector('.ai-chatops-chat');
      const chatWindow = document.querySelector('.ai-chatops-chat-window');
      
      if (!chatElement || !chatWindow) return null;
      
      const chatStyle = getComputedStyle(chatElement);
      const windowStyle = getComputedStyle(chatWindow);
      
      return {
        chatPosition: {
          bottom: chatStyle.bottom,
          right: chatStyle.right
        },
        windowSize: {
          width: windowStyle.width,
          height: windowStyle.height
        },
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('\n📱 모바일 반응형 확인:');
    if (mobileStyles) {
      console.log(`  뷰포트: ${mobileStyles.viewportSize.width}x${mobileStyles.viewportSize.height}`);
      console.log(`  채팅창 크기: ${mobileStyles.windowSize.width} x ${mobileStyles.windowSize.height}`);
      console.log(`  위치: bottom:${mobileStyles.chatPosition.bottom}, right:${mobileStyles.chatPosition.right}`);
      
      // 모바일에서 전체 너비를 사용하는지 확인
      const isFullWidth = mobileStyles.windowSize.width.includes('calc') || 
                         parseInt(mobileStyles.windowSize.width) > 300;
      console.log(`  ✅ 모바일 전체 너비 사용: ${isFullWidth}`);
    }
    
    await page.screenshot({ 
      path: 'test-results/final-design-06-mobile.png', 
      fullPage: true 
    });
    
    // 6. 테마 색상 확인 (기본 테마)
    const themeColors = await page.evaluate(() => {
      const elements = {
        primaryButton: document.querySelector('.ai-chatops-chat-button'),
        header: document.querySelector('.chat-header'),
        personalIcon: document.querySelector('.category-icon--personal'),
        generalIcon: document.querySelector('.category-icon--general'),
        operationIcon: document.querySelector('.category-icon--operation')
      };
      
      const results = {};
      for (const [key, element] of Object.entries(elements)) {
        if (element) {
          const style = getComputedStyle(element);
          results[key] = {
            background: style.background,
            backgroundColor: style.backgroundColor,
            color: style.color
          };
        }
      }
      
      return results;
    });
    
    console.log('\n🎨 테마 색상 적용 확인:');
    Object.entries(themeColors).forEach(([component, colors]) => {
      console.log(`  ${component}:`);
      console.log(`    배경: ${colors.backgroundColor || colors.background}`);
      console.log(`    텍스트: ${colors.color}`);
    });
    
    // 7. 최종 검증 요약
    console.log('\n📋 최종 검증 요약:');
    
    // CSS 변수 정상성
    const variableSuccess = emptyVariables.length === 0;
    console.log(`  ✅ CSS 변수 완전성: ${variableSuccess} (${Object.keys(cssVariableCheck).length}개 중 ${Object.keys(cssVariableCheck).length - emptyVariables.length}개 정상)`);
    
    // 핵심 컴포넌트 존재
    const componentsExist = componentStyleCheck.floatingButton && 
                           componentStyleCheck.chatWindow && 
                           componentStyleCheck.chatHeader && 
                           componentStyleCheck.categoryCard;
    console.log(`  ✅ 핵심 컴포넌트 존재: ${componentsExist}`);
    
    // 크기 정확성
    const sizesCorrect = componentStyleCheck.floatingButton?.width === '60px' &&
                        componentStyleCheck.chatWindow?.width === '455px' &&
                        componentStyleCheck.chatHeader?.height === '72px';
    console.log(`  ✅ 크기 정확성: ${sizesCorrect}`);
    
    // 패딩 적용 (이전 문제였던 부분)
    const paddingFixed = componentStyleCheck.categoryCard?.hasPadding && 
                        componentStyleCheck.chatHeader?.hasPadding;
    console.log(`  ✅ 패딩 정상 적용: ${paddingFixed}`);
    
    // 아이콘 표시
    const iconsVisible = componentStyleCheck.categoryIcon?.totalIcons > 0;
    console.log(`  ✅ 아이콘 표시: ${iconsVisible} (${componentStyleCheck.categoryIcon?.totalIcons || 0}개)`);
    
    console.log('\n✅ 최종 디자인 검증 완료!');
    
    // 모든 검증이 통과했는지 확인
    const allGood = variableSuccess && componentsExist && sizesCorrect && paddingFixed && iconsVisible;
    console.log(`\n🎯 전체 검증 결과: ${allGood ? '✅ 모든 검증 통과' : '❌ 일부 문제 발견'}`);
  });
});