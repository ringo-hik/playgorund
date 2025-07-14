import { test, expect } from '@playwright/test';

test.describe('아이콘 로딩 문제 디버깅', () => {
  test('아이콘 CDN 연결 및 로딩 상태 확인', async ({ page }) => {
    console.log('🔍 아이콘 로딩 디버깅 시작');
    
    // 네트워크 요청 모니터링
    const iconRequests = [];
    const failedRequests = [];
    
    page.on('request', request => {
      if (request.url().includes('api.iconify.design') || 
          request.url().includes('iconify') ||
          request.url().includes('uil:')) {
        console.log(`아이콘 요청: ${request.url()}`);
        iconRequests.push(request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('api.iconify.design') || 
          response.url().includes('iconify')) {
        console.log(`아이콘 응답: ${response.url()} - Status: ${response.status()}`);
        if (!response.ok()) {
          failedRequests.push({ url: response.url(), status: response.status() });
        }
      }
    });
    
    // 콘솔 에러 모니터링
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`콘솔 에러: ${msg.text()}`);
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 플로팅 버튼 클릭하여 아이콘들 로드
    await page.locator('.ai-chatops-chat-button').click();
    await page.waitForTimeout(3000);
    
    // 아이콘 요소들 확인
    const iconElements = await page.evaluate(() => {
      const icons = [];
      
      // unicon 컴포넌트들 찾기
      const uniconElements = document.querySelectorAll('unicon');
      uniconElements.forEach((el, index) => {
        const computedStyle = getComputedStyle(el);
        icons.push({
          index,
          tagName: el.tagName,
          name: el.getAttribute('name') || 'unknown',
          innerHTML: el.innerHTML.substring(0, 100),
          classes: el.className,
          width: computedStyle.width,
          height: computedStyle.height,
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          hasContent: el.innerHTML.trim().length > 0,
          isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
        });
      });
      
      return icons;
    });
    
    console.log(`\n📊 아이콘 요소 분석 (총 ${iconElements.length}개):`);
    iconElements.forEach((icon, i) => {
      const status = icon.isVisible ? '✅ 표시됨' : '❌ 숨겨짐';
      const content = icon.hasContent ? '📄 내용있음' : '📄 내용없음';
      console.log(`  ${i+1}. ${icon.name} - ${status} ${content} (${icon.width}x${icon.height})`);
    });
    
    // SVG 요소들 확인
    const svgElements = await page.evaluate(() => {
      const svgs = [];
      const svgElements = document.querySelectorAll('svg');
      svgElements.forEach((svg, index) => {
        const computedStyle = getComputedStyle(svg);
        svgs.push({
          index,
          width: computedStyle.width,
          height: computedStyle.height,
          viewBox: svg.getAttribute('viewBox'),
          paths: svg.querySelectorAll('path').length,
          isVisible: svg.offsetWidth > 0 && svg.offsetHeight > 0,
          parentTagName: svg.parentElement?.tagName
        });
      });
      return svgs;
    });
    
    console.log(`\n🎨 SVG 요소 분석 (총 ${svgElements.length}개):`);
    svgElements.forEach((svg, i) => {
      const status = svg.isVisible ? '✅ 표시됨' : '❌ 숨겨짐';
      console.log(`  ${i+1}. SVG - ${status} (${svg.width}x${svg.height}) paths:${svg.paths} parent:${svg.parentTagName}`);
    });
    
    // Iconify 상태 확인
    const iconifyState = await page.evaluate(() => {
      return {
        iconifyExists: typeof window.Iconify !== 'undefined',
        iconifyVersion: window.Iconify?.version || 'not available',
        loadedIcons: window.Iconify?.iconExists ? 'available' : 'not available',
        config: window.Iconify?.getConfig ? window.Iconify.getConfig() : 'not available'
      };
    });
    
    console.log('\n🔧 Iconify 라이브러리 상태:', JSON.stringify(iconifyState, null, 2));
    
    // 특정 아이콘들 테스트
    const testIcons = ['comment', 'cog', 'users-alt', 'angle-right'];
    console.log('\n🧪 개별 아이콘 테스트:');
    
    for (const iconName of testIcons) {
      const iconStatus = await page.evaluate((name) => {
        const iconEl = document.querySelector(`unicon[name="${name}"]`);
        if (!iconEl) return { found: false };
        
        return {
          found: true,
          visible: iconEl.offsetWidth > 0 && iconEl.offsetHeight > 0,
          content: iconEl.innerHTML.length > 0,
          computedDisplay: getComputedStyle(iconEl).display,
          clientSize: `${iconEl.clientWidth}x${iconEl.clientHeight}`
        };
      }, iconName);
      
      console.log(`  ${iconName}: ${JSON.stringify(iconStatus)}`);
    }
    
    // 최종 스크린샷
    await page.screenshot({ 
      path: 'test-results/icon-debug-full.png', 
      fullPage: true 
    });
    
    // 요약 리포트
    console.log('\n📋 문제 분석 요약:');
    console.log(`- 아이콘 요청 수: ${iconRequests.length}`);
    console.log(`- 실패한 요청: ${failedRequests.length}`);
    console.log(`- 콘솔 에러: ${consoleErrors.length}`);
    console.log(`- unicon 요소: ${iconElements.length}`);
    console.log(`- SVG 요소: ${svgElements.length}`);
    console.log(`- 표시되는 아이콘: ${iconElements.filter(i => i.isVisible).length}`);
    
    if (failedRequests.length > 0) {
      console.log('\n❌ 실패한 요청들:');
      failedRequests.forEach(req => console.log(`  ${req.url} (${req.status})`));
    }
    
    if (consoleErrors.length > 0) {
      console.log('\n❌ 콘솔 에러들:');
      consoleErrors.forEach(err => console.log(`  ${err}`));
    }
    
    console.log('\n✅ 아이콘 디버깅 완료');
  });
});