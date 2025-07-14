import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// 테스트 결과를 저장할 디렉토리 생성
const RESULTS_DIR = 'test-results/comprehensive';
const SCREENSHOTS_DIR = path.join(RESULTS_DIR, 'screenshots');
const REPORTS_DIR = path.join(RESULTS_DIR, 'reports');

// 디렉토리 생성 함수
function ensureDirectories() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

// 테스트 결과 저장을 위한 인터페이스
interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  screenshots: string[];
  errors: string[];
  details: any;
}

// 테스트 세션 관리 클래스
class TestSession {
  public results: TestResult[] = [];
  public startTime: Date = new Date();
  
  addResult(result: TestResult) {
    this.results.push(result);
  }

  generateMarkdownReport(): string {
    const duration = new Date().getTime() - this.startTime.getTime();
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;

    let report = `# AI ChatOps 종합 테스트 리포트\n\n`;
    report += `**테스트 실행 시간**: ${new Date().toLocaleString('ko-KR')}\n`;
    report += `**총 소요 시간**: ${Math.round(duration / 1000)}초\n`;
    report += `**테스트 결과**: ${passed}/${total} 통과 (${failed}개 실패)\n\n`;

    // 테스트 결과 요약
    report += `## 📊 테스트 결과 요약\n\n`;
    report += `| 테스트명 | 상태 | 소요시간 | 스크린샷 |\n`;
    report += `|---------|------|---------|----------|\n`;

    this.results.forEach(result => {
      const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
      const screenshots = result.screenshots.map(s => `![${path.basename(s)}](${s})`).join(' ');
      report += `| ${result.testName} | ${statusIcon} ${result.status} | ${result.duration}ms | ${result.screenshots.length}개 |\n`;
    });

    // 상세 결과
    report += `\n## 📋 상세 테스트 결과\n\n`;
    this.results.forEach(result => {
      report += `### ${result.testName}\n\n`;
      report += `- **상태**: ${result.status === 'passed' ? '✅ 통과' : result.status === 'failed' ? '❌ 실패' : '⏭️ 건너뜀'}\n`;
      report += `- **소요시간**: ${result.duration}ms\n`;
      
      if (result.errors.length > 0) {
        report += `- **오류 내용**:\n`;
        result.errors.forEach(error => {
          report += `  - ${error}\n`;
        });
      }

      if (result.screenshots.length > 0) {
        report += `- **스크린샷**:\n`;
        result.screenshots.forEach(screenshot => {
          const filename = path.basename(screenshot);
          report += `  - ![${filename}](${screenshot})\n`;
        });
      }

      if (result.details) {
        report += `- **상세 정보**:\n`;
        report += `\`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`\n`;
      }
      
      report += `\n`;
    });

    return report;
  }

  saveReport() {
    const report = this.generateMarkdownReport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `comprehensive-test-report-${timestamp}.md`;
    const filepath = path.join(REPORTS_DIR, filename);
    
    fs.writeFileSync(filepath, report);
    console.log(`📝 테스트 리포트 저장됨: ${filepath}`);
    
    return filepath;
  }
}

const testSession = new TestSession();

test.describe('AI ChatOps 완전 종합 테스트 스위트', () => {
  test.beforeAll(async () => {
    ensureDirectories();
    console.log('🚀 AI ChatOps 종합 테스트 스위트 시작');
  });

  test.afterAll(async () => {
    const reportPath = testSession.saveReport();
    console.log(`✅ 모든 테스트 완료. 리포트 위치: ${reportPath}`);
  });

  test('1. 초기 로딩 및 UI 구조 검증', async ({ page }) => {
    const testStart = Date.now();
    const testName = '초기 로딩 및 UI 구조 검증';
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('🔍 1단계: 초기 로딩 및 UI 구조 검증 시작');
      
      // 페이지 에러 모니터링
      page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // 초기 화면 스크린샷
      const initialScreenshot = path.join(SCREENSHOTS_DIR, '01-initial-load.png');
      await page.screenshot({ path: initialScreenshot, fullPage: true });
      screenshots.push(initialScreenshot);

      // UI 요소 검증
      const chatButton = page.locator('.ai-chatops-chat-button');
      await expect(chatButton).toBeVisible();
      
      // 페이지 구조 분석
      const pageStructure = await page.evaluate(() => {
        return {
          title: document.title,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          elementsCount: {
            divs: document.querySelectorAll('div').length,
            buttons: document.querySelectorAll('button').length,
            images: document.querySelectorAll('img').length
          }
        };
      });

      testSession.addResult({
        testName,
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: pageStructure
      });

      console.log('✅ 초기 로딩 검증 완료');
      
    } catch (error) {
      errors.push(`Test Error: ${error.message}`);
      testSession.addResult({
        testName,
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: null
      });
      
      console.log('❌ 초기 로딩 검증 실패:', error.message);
      throw error;
    }
  });

  test('2. 채팅 인터페이스 활성화 및 카테고리 선택', async ({ page }) => {
    const testStart = Date.now();
    const testName = '채팅 인터페이스 활성화 및 카테고리 선택';
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('💬 2단계: 채팅 인터페이스 활성화 및 카테고리 선택');
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 채팅 버튼 클릭
      const chatButton = page.locator('.ai-chatops-chat-button');
      await chatButton.click();
      await page.waitForTimeout(3000);

      const chatOpenedScreenshot = path.join(SCREENSHOTS_DIR, '02-chat-opened.png');
      await page.screenshot({ path: chatOpenedScreenshot, fullPage: true });
      screenshots.push(chatOpenedScreenshot);

      // 카테고리 분석
      const categories = await page.evaluate(() => {
        const categoryCards = document.querySelectorAll('.category-card');
        return Array.from(categoryCards).map((card, index) => ({
          index,
          text: card.textContent?.trim() || '',
          classes: card.className,
          hasIcon: card.querySelector('i, svg, .icon') !== null
        }));
      });

      console.log(`발견된 카테고리: ${categories.length}개`);
      categories.forEach((cat, i) => {
        console.log(`  ${i + 1}. ${cat.text}`);
      });

      // 각 카테고리별 스크린샷
      for (let i = 0; i < Math.min(categories.length, 3); i++) {
        const categoryCard = page.locator('.category-card').nth(i);
        await categoryCard.click();
        await page.waitForTimeout(2000);

        const categoryScreenshot = path.join(SCREENSHOTS_DIR, `02-category-${i + 1}-selected.png`);
        await page.screenshot({ path: categoryScreenshot, fullPage: true });
        screenshots.push(categoryScreenshot);

        // 뒤로가기 (다음 카테고리 테스트를 위해)
        if (i < categories.length - 1) {
          const backButton = page.locator('.back-btn, .btn-back');
          if (await backButton.count() > 0) {
            await backButton.click();
            await page.waitForTimeout(1000);
          }
        }
      }

      testSession.addResult({
        testName,
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: { categories }
      });

      console.log('✅ 채팅 인터페이스 및 카테고리 선택 검증 완료');
      
    } catch (error) {
      errors.push(`Test Error: ${error.message}`);
      testSession.addResult({
        testName,
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: null
      });
      
      console.log('❌ 채팅 인터페이스 검증 실패:', error.message);
      throw error;
    }
  });

  test('3. 페르소나 선택 및 채팅 기능 테스트', async ({ page }) => {
    const testStart = Date.now();
    const testName = '페르소나 선택 및 채팅 기능 테스트';
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('👤 3단계: 페르소나 선택 및 채팅 기능 테스트');
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 채팅 인터페이스 열기
      await page.locator('.ai-chatops-chat-button').click();
      await page.waitForTimeout(2000);

      // 첫 번째 카테고리 선택
      await page.locator('.category-card').first().click();
      await page.waitForTimeout(2000);

      const personaListScreenshot = path.join(SCREENSHOTS_DIR, '03-persona-list.png');
      await page.screenshot({ path: personaListScreenshot, fullPage: true });
      screenshots.push(personaListScreenshot);

      // 페르소나 분석
      const personas = await page.evaluate(() => {
        const personaCards = document.querySelectorAll('.persona-card');
        return Array.from(personaCards).map((card, index) => ({
          index,
          name: card.querySelector('.persona-name, .name')?.textContent?.trim() || `페르소나 ${index + 1}`,
          description: card.querySelector('.persona-description, .description')?.textContent?.trim() || '',
          classes: card.className
        }));
      });

      console.log(`발견된 페르소나: ${personas.length}개`);

      if (personas.length > 0) {
        // 첫 번째 페르소나 선택
        await page.locator('.persona-card').first().click();
        await page.waitForTimeout(3000);

        const chatInterfaceScreenshot = path.join(SCREENSHOTS_DIR, '03-chat-interface.png');
        await page.screenshot({ path: chatInterfaceScreenshot, fullPage: true });
        screenshots.push(chatInterfaceScreenshot);

        // 메시지 입력 테스트
        const testMessages = [
          '안녕하세요! 테스트 메시지입니다.',
          '현재 시간을 알려주세요.',
          '간단한 계산: 2 + 2 = ?'
        ];

        for (let i = 0; i < testMessages.length; i++) {
          const message = testMessages[i];
          
          // 입력 필드 찾기
          const inputSelectors = ['textarea', '.message-input', '.chat-input', 'input[type="text"]'];
          let messageInput = null;
          
          for (const selector of inputSelectors) {
            const elements = page.locator(selector);
            if (await elements.count() > 0) {
              messageInput = elements.first();
              break;
            }
          }

          if (messageInput) {
            await messageInput.fill(message);
            await page.waitForTimeout(1000);

            const messageTypedScreenshot = path.join(SCREENSHOTS_DIR, `03-message-${i + 1}-typed.png`);
            await page.screenshot({ path: messageTypedScreenshot, fullPage: true });
            screenshots.push(messageTypedScreenshot);

            // 메시지 전송 (Enter 키 또는 전송 버튼)
            try {
              await messageInput.press('Enter');
            } catch {
              const sendButton = page.locator('.send-btn, .btn-send');
              if (await sendButton.count() > 0) {
                await sendButton.click();
              }
            }
            
            await page.waitForTimeout(3000);

            const messageSentScreenshot = path.join(SCREENSHOTS_DIR, `03-message-${i + 1}-sent.png`);
            await page.screenshot({ path: messageSentScreenshot, fullPage: true });
            screenshots.push(messageSentScreenshot);
          }
        }
      }

      testSession.addResult({
        testName,
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: { personas, messagesSent: testMessages.length }
      });

      console.log('✅ 페르소나 및 채팅 기능 검증 완료');
      
    } catch (error) {
      errors.push(`Test Error: ${error.message}`);
      testSession.addResult({
        testName,
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: null
      });
      
      console.log('❌ 페르소나 및 채팅 기능 검증 실패:', error.message);
      throw error;
    }
  });

  test('4. 반응형 디자인 및 다양한 뷰포트 테스트', async ({ page }) => {
    const testStart = Date.now();
    const testName = '반응형 디자인 및 다양한 뷰포트 테스트';
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('📱 4단계: 반응형 디자인 테스트');
      
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'ultrawide', width: 2560, height: 1440 }
      ];

      const responsiveResults = [];

      for (const viewport of viewports) {
        console.log(`📏 ${viewport.name} 뷰포트 테스트 (${viewport.width}x${viewport.height})`);
        
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const initialScreenshot = path.join(SCREENSHOTS_DIR, `04-${viewport.name}-initial.png`);
        await page.screenshot({ path: initialScreenshot, fullPage: true });
        screenshots.push(initialScreenshot);

        // 채팅 버튼 클릭
        const chatButton = page.locator('.ai-chatops-chat-button');
        if (await chatButton.isVisible()) {
          await chatButton.click();
          await page.waitForTimeout(2000);

          const chatOpenedScreenshot = path.join(SCREENSHOTS_DIR, `04-${viewport.name}-chat-opened.png`);
          await page.screenshot({ path: chatOpenedScreenshot, fullPage: true });
          screenshots.push(chatOpenedScreenshot);
        }

        // 레이아웃 분석
        const layoutAnalysis = await page.evaluate(() => {
          const chatModal = document.querySelector('.chat-modal, .chat-overlay');
          const chatButton = document.querySelector('.ai-chatops-chat-button');
          
          return {
            chatModalVisible: chatModal ? window.getComputedStyle(chatModal).display !== 'none' : false,
            chatButtonPosition: chatButton ? {
              top: chatButton.offsetTop,
              left: chatButton.offsetLeft,
              width: chatButton.offsetWidth,
              height: chatButton.offsetHeight
            } : null,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          };
        });

        responsiveResults.push({
          viewport: viewport.name,
          ...layoutAnalysis
        });
      }

      testSession.addResult({
        testName,
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: { responsiveResults }
      });

      console.log('✅ 반응형 디자인 검증 완료');
      
    } catch (error) {
      errors.push(`Test Error: ${error.message}`);
      testSession.addResult({
        testName,
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: null
      });
      
      console.log('❌ 반응형 디자인 검증 실패:', error.message);
      throw error;
    }
  });

  test('5. 고급 기능 및 설정 테스트', async ({ page }) => {
    const testStart = Date.now();
    const testName = '고급 기능 및 설정 테스트';
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('⚙️ 5단계: 고급 기능 및 설정 테스트');
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 채팅 인터페이스 열기
      await page.locator('.ai-chatops-chat-button').click();
      await page.waitForTimeout(2000);

      const initialSettingsScreenshot = path.join(SCREENSHOTS_DIR, '05-settings-initial.png');
      await page.screenshot({ path: initialSettingsScreenshot, fullPage: true });
      screenshots.push(initialSettingsScreenshot);

      // 테마 변경 테스트
      const themeSelector = page.locator('.theme-selector');
      if (await themeSelector.count() > 0) {
        console.log('🎨 테마 변경 테스트');
        await themeSelector.click();
        await page.waitForTimeout(2000);

        const themeChangedScreenshot = path.join(SCREENSHOTS_DIR, '05-theme-changed.png');
        await page.screenshot({ path: themeChangedScreenshot, fullPage: true });
        screenshots.push(themeChangedScreenshot);
      }

      // 언어 변경 테스트
      const languageBtn = page.locator('.language-btn');
      if (await languageBtn.count() > 0) {
        console.log('🌐 언어 변경 테스트');
        await languageBtn.click();
        await page.waitForTimeout(2000);

        const languageChangedScreenshot = path.join(SCREENSHOTS_DIR, '05-language-changed.png');
        await page.screenshot({ path: languageChangedScreenshot, fullPage: true });
        screenshots.push(languageChangedScreenshot);
      }

      // 피드백 탭 테스트
      const feedbackTab = page.locator('button').filter({ hasText: '피드백' });
      if (await feedbackTab.count() > 0) {
        console.log('📝 피드백 탭 테스트');
        await feedbackTab.click();
        await page.waitForTimeout(2000);

        const feedbackScreenshot = path.join(SCREENSHOTS_DIR, '05-feedback-tab.png');
        await page.screenshot({ path: feedbackScreenshot, fullPage: true });
        screenshots.push(feedbackScreenshot);
      }

      // 고급 기능 분석
      const advancedFeatures = await page.evaluate(() => {
        return {
          hasThemeSelector: document.querySelector('.theme-selector') !== null,
          hasLanguageSelector: document.querySelector('.language-btn') !== null,
          hasFeedbackTab: document.querySelector('button')?.textContent?.includes('피드백') || false,
          hasSettings: document.querySelector('.settings, .options') !== null,
          totalInteractiveElements: document.querySelectorAll('button, input, select, textarea').length
        };
      });

      testSession.addResult({
        testName,
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: { advancedFeatures }
      });

      console.log('✅ 고급 기능 및 설정 검증 완료');
      
    } catch (error) {
      errors.push(`Test Error: ${error.message}`);
      testSession.addResult({
        testName,
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: null
      });
      
      console.log('❌ 고급 기능 및 설정 검증 실패:', error.message);
      throw error;
    }
  });

  test('6. 성능 및 접근성 검증', async ({ page }) => {
    const testStart = Date.now();
    const testName = '성능 및 접근성 검증';
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('🚀 6단계: 성능 및 접근성 검증');
      
      // 성능 메트릭 수집 시작
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
      });

      // 접근성 검증
      const accessibilityCheck = await page.evaluate(() => {
        const elements = {
          imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
          buttonsWithoutLabel: Array.from(document.querySelectorAll('button')).filter(btn => 
            !btn.textContent?.trim() && !btn.getAttribute('aria-label')
          ).length,
          inputsWithoutLabel: Array.from(document.querySelectorAll('input')).filter(input => 
            !input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`)
          ).length,
          headingsStructure: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.tagName)
        };
        
        return elements;
      });

      const performanceScreenshot = path.join(SCREENSHOTS_DIR, '06-performance-analysis.png');
      await page.screenshot({ path: performanceScreenshot, fullPage: true });
      screenshots.push(performanceScreenshot);

      testSession.addResult({
        testName,
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: { performanceMetrics, accessibilityCheck }
      });

      console.log('✅ 성능 및 접근성 검증 완료');
      console.log(`로딩 시간: ${performanceMetrics.loadTime}ms`);
      console.log(`DOM 로딩: ${performanceMetrics.domContentLoaded}ms`);
      
    } catch (error) {
      errors.push(`Test Error: ${error.message}`);
      testSession.addResult({
        testName,
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        details: null
      });
      
      console.log('❌ 성능 및 접근성 검증 실패:', error.message);
      throw error;
    }
  });
});