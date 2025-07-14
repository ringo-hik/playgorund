import { test, expect } from '@playwright/test';

test('DOM 구조 및 아이콘 렌더링 상세 분석', async ({ page }) => {
  console.log('🔍 DOM 구조 분석 시작');
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // 플로팅 버튼 클릭
  await page.locator('.ai-chatops-chat-button').click();
  await page.waitForTimeout(3000);
  
  // DOM 구조 분석
  const domStructure = await page.evaluate(() => {
    const result = {
      uniconElements: [],
      iconComponents: [],
      svgElements: [],
      allElementsWithIconClasses: []
    };
    
    // 모든 unicon 요소 찾기
    const unicons = document.querySelectorAll('unicon');
    unicons.forEach((el, i) => {
      result.uniconElements.push({
        index: i,
        outerHTML: el.outerHTML,
        attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`),
        children: el.children.length,
        innerHTML: el.innerHTML,
        computed: {
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          width: getComputedStyle(el).width,
          height: getComputedStyle(el).height
        }
      });
    });
    
    // Icon 컴포넌트 찾기 (Vue 컴포넌트로 렌더링된 것들)
    const iconEls = document.querySelectorAll('svg, .iconify');
    iconEls.forEach((el, i) => {
      result.iconComponents.push({
        index: i,
        tagName: el.tagName,
        className: el.className,
        outerHTML: el.outerHTML.substring(0, 200),
        parent: el.parentElement?.tagName,
        computed: {
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          width: getComputedStyle(el).width,
          height: getComputedStyle(el).height
        }
      });
    });
    
    // 모든 SVG 요소
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((el, i) => {
      const parent = el.parentElement;
      result.svgElements.push({
        index: i,
        viewBox: el.getAttribute('viewBox'),
        width: el.getAttribute('width'),
        height: el.getAttribute('height'),
        className: el.className.baseVal || el.className,
        parentTag: parent?.tagName,
        parentClass: parent?.className,
        paths: el.querySelectorAll('path').length,
        computed: {
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
          opacity: getComputedStyle(el).opacity,
          width: getComputedStyle(el).width,
          height: getComputedStyle(el).height
        },
        isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
      });
    });
    
    // 아이콘 관련 클래스를 가진 모든 요소
    const iconElements = document.querySelectorAll('[class*="icon"], [class*="unicon"], .ai-chatops-chat-button');
    iconElements.forEach((el, i) => {
      result.allElementsWithIconClasses.push({
        index: i,
        tagName: el.tagName,
        className: el.className,
        innerHTML: el.innerHTML.substring(0, 100),
        hasChildren: el.children.length > 0,
        childrenTags: Array.from(el.children).map(child => child.tagName),
        computed: {
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility
        }
      });
    });
    
    return result;
  });
  
  console.log('\n📋 unicon 요소들:');
  domStructure.uniconElements.forEach((el, i) => {
    console.log(`  ${i+1}. ${el.outerHTML}`);
    console.log(`     속성: [${el.attributes.join(', ')}]`);
    console.log(`     스타일: display:${el.computed.display}, visibility:${el.computed.visibility}, size:${el.computed.width}x${el.computed.height}`);
  });
  
  console.log('\n🎨 SVG 분석:');
  domStructure.svgElements.forEach((svg, i) => {
    const visible = svg.isVisible ? '✅' : '❌';
    console.log(`  ${i+1}. ${visible} SVG - ${svg.parentTag}.${svg.parentClass} (${svg.computed.width}x${svg.computed.height})`);
    console.log(`     viewBox: ${svg.viewBox}, paths: ${svg.paths}`);
    console.log(`     display: ${svg.computed.display}, visibility: ${svg.computed.visibility}, opacity: ${svg.computed.opacity}`);
  });
  
  console.log('\n🔧 아이콘 관련 요소들:');
  domStructure.allElementsWithIconClasses.forEach((el, i) => {
    console.log(`  ${i+1}. ${el.tagName}.${el.className}`);
    console.log(`     자식: ${el.childrenTags.join(', ')}`);
    console.log(`     innerHTML: ${el.innerHTML}`);
  });
  
  // CSS 규칙 확인
  const cssRules = await page.evaluate(() => {
    const rules = [];
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        if (sheet.cssRules) {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (rule.selectorText && (
              rule.selectorText.includes('svg') ||
              rule.selectorText.includes('icon') ||
              rule.selectorText.includes('unicon')
            )) {
              rules.push({
                selector: rule.selectorText,
                cssText: rule.cssText.substring(0, 200),
                href: sheet.href || 'inline'
              });
            }
          }
        }
      } catch (e) {
        // CORS 제한
      }
    }
    return rules;
  });
  
  console.log('\n🎛️ 관련 CSS 규칙들:');
  cssRules.forEach((rule, i) => {
    console.log(`  ${i+1}. ${rule.selector}`);
    console.log(`     ${rule.cssText}`);
  });
  
  await page.screenshot({ 
    path: 'test-results/icon-structure-debug.png', 
    fullPage: true 
  });
  
  console.log('\n✅ DOM 구조 분석 완료');
});