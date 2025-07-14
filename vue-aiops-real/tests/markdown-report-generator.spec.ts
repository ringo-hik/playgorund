import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Markdown 리포트 생성기 클래스
class MarkdownReportGenerator {
  private testResults: any[] = [];
  private startTime: Date = new Date();
  private reportDir: string;
  private screenshotDir: string;
  
  constructor() {
    this.reportDir = 'test-results/markdown-reports';
    this.screenshotDir = path.join(this.reportDir, 'screenshots');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  // 테스트 결과 추가
  addTestResult(result: {
    testName: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    screenshots: string[];
    errors: string[];
    metrics?: any;
    details?: any;
  }) {
    this.testResults.push({
      ...result,
      timestamp: new Date().toISOString()
    });
  }

  // 상세 Markdown 리포트 생성
  generateDetailedReport(): string {
    const totalDuration = new Date().getTime() - this.startTime.getTime();
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const skipped = this.testResults.filter(r => r.status === 'skipped').length;
    const total = this.testResults.length;

    let report = '';

    // 헤더
    report += `# 🤖 AI ChatOps 테스트 상세 리포트\n\n`;
    report += `**생성일시**: ${new Date().toLocaleString('ko-KR')}\n`;
    report += `**테스트 시작**: ${this.startTime.toLocaleString('ko-KR')}\n`;
    report += `**총 소요시간**: ${Math.round(totalDuration / 1000)}초\n`;
    report += `**브라우저**: Chromium (Playwright)\n\n`;

    // 실행 요약
    report += `## 📊 실행 요약\n\n`;
    report += `| 항목 | 값 |\n`;
    report += `|------|----|\n`;
    report += `| 총 테스트 수 | ${total} |\n`;
    report += `| ✅ 통과 | ${passed} |\n`;
    report += `| ❌ 실패 | ${failed} |\n`;
    report += `| ⏭️ 건너뜀 | ${skipped} |\n`;
    report += `| 성공률 | ${total > 0 ? Math.round((passed / total) * 100) : 0}% |\n\n`;

    // 성능 메트릭
    const totalTestDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = total > 0 ? Math.round(totalTestDuration / total) : 0;
    
    report += `## 🚀 성능 메트릭\n\n`;
    report += `| 메트릭 | 값 |\n`;
    report += `|--------|----|\n`;
    report += `| 평균 테스트 시간 | ${avgDuration}ms |\n`;
    report += `| 최장 테스트 시간 | ${Math.max(...this.testResults.map(r => r.duration))}ms |\n`;
    report += `| 최단 테스트 시간 | ${Math.min(...this.testResults.map(r => r.duration))}ms |\n`;
    report += `| 총 스크린샷 수 | ${this.testResults.reduce((sum, r) => sum + r.screenshots.length, 0)} |\n\n`;

    // 테스트 결과 상세
    report += `## 📋 테스트 결과 상세\n\n`;
    
    this.testResults.forEach((result, index) => {
      const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
      
      report += `### ${index + 1}. ${statusIcon} ${result.testName}\n\n`;
      report += `- **상태**: ${result.status.toUpperCase()}\n`;
      report += `- **소요시간**: ${result.duration}ms\n`;
      report += `- **실행시각**: ${new Date(result.timestamp).toLocaleString('ko-KR')}\n`;
      
      if (result.errors && result.errors.length > 0) {
        report += `- **오류 내용**:\n`;
        result.errors.forEach(error => {
          report += `  - \`${error}\`\n`;
        });
      }

      if (result.screenshots && result.screenshots.length > 0) {
        report += `- **스크린샷** (${result.screenshots.length}개):\n`;
        result.screenshots.forEach((screenshot, idx) => {
          const filename = path.basename(screenshot);
          report += `  ${idx + 1}. ![${filename}](screenshots/${filename})\n`;
        });
      }

      if (result.metrics) {
        report += `- **성능 메트릭**:\n`;
        Object.entries(result.metrics).forEach(([key, value]) => {
          report += `  - ${key}: ${value}\n`;
        });
      }

      if (result.details) {
        report += `- **상세 정보**:\n`;
        report += `\`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`\n`;
      }
      
      report += `\n---\n\n`;
    });

    // 권장사항
    report += `## 💡 권장사항\n\n`;
    
    if (failed > 0) {
      report += `### 🔧 실패한 테스트 해결방안\n\n`;
      const failedTests = this.testResults.filter(r => r.status === 'failed');
      failedTests.forEach(test => {
        report += `- **${test.testName}**: ${test.errors.length > 0 ? test.errors[0] : '원인 불명'}\n`;
      });
      report += `\n`;
    }

    if (avgDuration > 5000) {
      report += `### ⚡ 성능 최적화\n\n`;
      report += `- 평균 테스트 시간이 ${avgDuration}ms로 다소 길습니다.\n`;
      report += `- 네트워크 대기 시간 단축을 고려하세요.\n`;
      report += `- 불필요한 waitForTimeout 줄이기를 권장합니다.\n\n`;
    }

    report += `### 📈 개선 제안\n\n`;
    report += `- 정기적인 회귀 테스트 실행\n`;
    report += `- 실패 케이스에 대한 상세 로깅 강화\n`;
    report += `- 성능 벤치마크 기준 설정\n`;
    report += `- CI/CD 파이프라인에 테스트 통합\n\n`;

    // 푸터
    report += `---\n\n`;
    report += `*이 리포트는 Playwright 자동화 테스트를 통해 생성되었습니다.*\n`;
    report += `*리포트 생성시간: ${new Date().toISOString()}*\n`;

    return report;
  }

  // 요약 리포트 생성
  generateSummaryReport(): string {
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const total = this.testResults.length;

    let summary = `# 📋 AI ChatOps 테스트 요약\n\n`;
    summary += `**결과**: ${passed}/${total} 통과 `;
    
    if (failed === 0) {
      summary += `✅ 모든 테스트 성공!\n\n`;
    } else {
      summary += `❌ ${failed}개 실패\n\n`;
    }

    summary += `## 📊 빠른 통계\n\n`;
    summary += `- 성공률: ${total > 0 ? Math.round((passed / total) * 100) : 0}%\n`;
    summary += `- 총 스크린샷: ${this.testResults.reduce((sum, r) => sum + r.screenshots.length, 0)}개\n`;
    summary += `- 평균 실행시간: ${total > 0 ? Math.round(this.testResults.reduce((sum, r) => sum + r.duration, 0) / total) : 0}ms\n\n`;

    if (failed > 0) {
      summary += `## ❌ 실패한 테스트\n\n`;
      this.testResults.filter(r => r.status === 'failed').forEach(test => {
        summary += `- ${test.testName}\n`;
      });
      summary += `\n`;
    }

    summary += `*상세 리포트는 별도 파일을 확인하세요.*\n`;
    
    return summary;
  }

  // 대시보드 HTML 생성
  generateHTMLDashboard(): string {
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const total = this.testResults.length;
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI ChatOps 테스트 대시보드</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
        .total { color: #007bff; }
        .rate { color: #6f42c1; }
        .test-results { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .test-item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; justify-content: space-between; align-items: center; }
        .test-item:last-child { border-bottom: none; }
        .test-name { font-weight: 500; }
        .test-status { padding: 5px 15px; border-radius: 20px; color: white; font-size: 0.9em; }
        .passed { background: #28a745; }
        .failed { background: #dc3545; }
        .skipped { background: #6c757d; }
        .screenshot-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 10px; }
        .screenshot { width: 100%; height: 100px; object-fit: cover; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI ChatOps 테스트 대시보드</h1>
            <p>생성일시: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number total">${total}</div>
                <div>총 테스트</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success">${passed}</div>
                <div>성공</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failure">${failed}</div>
                <div>실패</div>
            </div>
            <div class="stat-card">
                <div class="stat-number rate">${successRate}%</div>
                <div>성공률</div>
            </div>
        </div>
        
        <div class="test-results">
            <h2>테스트 결과</h2>
            ${this.testResults.map(test => `
                <div class="test-item">
                    <div>
                        <div class="test-name">${test.testName}</div>
                        <div style="color: #666; font-size: 0.9em;">${test.duration}ms</div>
                        ${test.screenshots.length > 0 ? `
                            <div class="screenshot-gallery">
                                ${test.screenshots.map(screenshot => `
                                    <img src="screenshots/${path.basename(screenshot)}" class="screenshot" alt="스크린샷">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="test-status ${test.status}">${test.status.toUpperCase()}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  }

  // 모든 리포트 저장
  async saveAllReports() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // 상세 리포트
    const detailedReport = this.generateDetailedReport();
    const detailedPath = path.join(this.reportDir, `detailed-report-${timestamp}.md`);
    fs.writeFileSync(detailedPath, detailedReport);

    // 요약 리포트
    const summaryReport = this.generateSummaryReport();
    const summaryPath = path.join(this.reportDir, `summary-report-${timestamp}.md`);
    fs.writeFileSync(summaryPath, summaryReport);

    // HTML 대시보드
    const htmlDashboard = this.generateHTMLDashboard();
    const htmlPath = path.join(this.reportDir, `dashboard-${timestamp}.html`);
    fs.writeFileSync(htmlPath, htmlDashboard);

    // 최신 리포트 링크 생성
    const latestDetailedPath = path.join(this.reportDir, 'latest-detailed.md');
    const latestSummaryPath = path.join(this.reportDir, 'latest-summary.md');
    const latestHtmlPath = path.join(this.reportDir, 'latest-dashboard.html');
    
    fs.writeFileSync(latestDetailedPath, detailedReport);
    fs.writeFileSync(latestSummaryPath, summaryReport);
    fs.writeFileSync(latestHtmlPath, htmlDashboard);

    return {
      detailed: detailedPath,
      summary: summaryPath,
      html: htmlPath,
      latestDetailed: latestDetailedPath,
      latestSummary: latestSummaryPath,
      latestHtml: latestHtmlPath
    };
  }

  // 스크린샷 복사
  copyScreenshot(originalPath: string): string {
    if (!fs.existsSync(originalPath)) {
      return '';
    }

    const filename = path.basename(originalPath);
    const newPath = path.join(this.screenshotDir, filename);
    
    try {
      fs.copyFileSync(originalPath, newPath);
      return newPath;
    } catch (error) {
      console.warn(`스크린샷 복사 실패: ${originalPath}`);
      return '';
    }
  }
}

// 전역 리포트 생성기 인스턴스
const reportGenerator = new MarkdownReportGenerator();

test.describe('Markdown 리포트 생성 테스트', () => {
  test.beforeAll(async () => {
    console.log('📝 Markdown 리포트 생성 테스트 시작');
  });

  test.afterAll(async () => {
    const reportPaths = await reportGenerator.saveAllReports();
    console.log('📊 테스트 리포트 생성 완료:');
    console.log(`- 상세 리포트: ${reportPaths.detailed}`);
    console.log(`- 요약 리포트: ${reportPaths.summary}`);
    console.log(`- HTML 대시보드: ${reportPaths.html}`);
  });

  test('리포트 생성을 위한 종합 테스트 실행', async ({ page }) => {
    const testStart = Date.now();
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('🏃 종합 테스트 실행 중...');
      
      // 페이지 로딩 테스트
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadingScreenshot = 'test-results/markdown-reports/screenshots/01-loading.png';
      await page.screenshot({ path: loadingScreenshot, fullPage: true });
      screenshots.push(reportGenerator.copyScreenshot(loadingScreenshot));

      // 성능 메트릭 수집
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          resourceCount: performance.getEntriesByType('resource').length
        };
      });

      // 채팅 기능 테스트
      const chatButton = page.locator('.ai-chatops-chat-button');
      if (await chatButton.isVisible()) {
        await chatButton.click();
        await page.waitForTimeout(2000);
        
        const chatScreenshot = 'test-results/markdown-reports/screenshots/02-chat-opened.png';
        await page.screenshot({ path: chatScreenshot, fullPage: true });
        screenshots.push(reportGenerator.copyScreenshot(chatScreenshot));
      }

      // UI 요소 분석
      const uiAnalysis = await page.evaluate(() => {
        return {
          totalElements: document.querySelectorAll('*').length,
          buttons: document.querySelectorAll('button').length,
          inputs: document.querySelectorAll('input, textarea').length,
          images: document.querySelectorAll('img').length
        };
      });

      reportGenerator.addTestResult({
        testName: '종합 기능 테스트',
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        metrics: performanceMetrics,
        details: uiAnalysis
      });

      console.log('✅ 종합 테스트 완료');
      
    } catch (error) {
      errors.push(error.message);
      reportGenerator.addTestResult({
        testName: '종합 기능 테스트',
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        metrics: null,
        details: null
      });
      
      console.log('❌ 종합 테스트 실패:', error.message);
    }
  });

  test('반응형 디자인 테스트', async ({ page }) => {
    const testStart = Date.now();
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('📱 반응형 디자인 테스트 실행 중...');
      
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];

      const responsiveResults = [];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const screenshotPath = `test-results/markdown-reports/screenshots/responsive-${viewport.name}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        screenshots.push(reportGenerator.copyScreenshot(screenshotPath));

        const layoutMetrics = await page.evaluate(() => {
          return {
            viewport: { width: window.innerWidth, height: window.innerHeight },
            scrollHeight: document.documentElement.scrollHeight,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
          };
        });

        responsiveResults.push({
          viewport: viewport.name,
          ...layoutMetrics
        });
      }

      reportGenerator.addTestResult({
        testName: '반응형 디자인 테스트',
        status: 'passed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        metrics: { viewportsTested: viewports.length },
        details: responsiveResults
      });

      console.log('✅ 반응형 디자인 테스트 완료');
      
    } catch (error) {
      errors.push(error.message);
      reportGenerator.addTestResult({
        testName: '반응형 디자인 테스트',
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        metrics: null,
        details: null
      });
      
      console.log('❌ 반응형 디자인 테스트 실패:', error.message);
    }
  });

  test('접근성 및 사용성 테스트', async ({ page }) => {
    const testStart = Date.now();
    const screenshots: string[] = [];
    const errors: string[] = [];
    
    try {
      console.log('♿ 접근성 및 사용성 테스트 실행 중...');
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScreenshot = 'test-results/markdown-reports/screenshots/accessibility-check.png';
      await page.screenshot({ path: accessibilityScreenshot, fullPage: true });
      screenshots.push(reportGenerator.copyScreenshot(accessibilityScreenshot));

      // 접근성 검사
      const accessibilityCheck = await page.evaluate(() => {
        const issues = [];
        
        // 이미지 alt 속성 검사
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
          issues.push(`${imagesWithoutAlt.length}개 이미지에 alt 속성 누락`);
        }

        // 버튼 레이블 검사
        const buttonsWithoutLabel = Array.from(document.querySelectorAll('button')).filter(btn => 
          !btn.textContent?.trim() && !btn.getAttribute('aria-label')
        );
        if (buttonsWithoutLabel.length > 0) {
          issues.push(`${buttonsWithoutLabel.length}개 버튼에 레이블 누락`);
        }

        // 색상 대비 관련 요소 확인
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        return {
          totalIssues: issues.length,
          issues,
          interactiveElementsCount: interactiveElements.length,
          hasSkipLink: document.querySelector('a[href="#main"], a[href="#content"]') !== null,
          hasMainLandmark: document.querySelector('main, [role="main"]') !== null
        };
      });

      // 키보드 내비게이션 테스트
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      
      const keyboardNavScreenshot = 'test-results/markdown-reports/screenshots/keyboard-navigation.png';
      await page.screenshot({ path: keyboardNavScreenshot, fullPage: true });
      screenshots.push(reportGenerator.copyScreenshot(keyboardNavScreenshot));

      const status = accessibilityCheck.totalIssues === 0 ? 'passed' : 'failed';
      if (accessibilityCheck.totalIssues > 0) {
        errors.push(`접근성 문제 ${accessibilityCheck.totalIssues}개 발견`);
      }

      reportGenerator.addTestResult({
        testName: '접근성 및 사용성 테스트',
        status,
        duration: Date.now() - testStart,
        screenshots,
        errors,
        metrics: { 
          accessibilityScore: Math.max(0, 100 - (accessibilityCheck.totalIssues * 10)),
          issuesFound: accessibilityCheck.totalIssues
        },
        details: accessibilityCheck
      });

      console.log('✅ 접근성 및 사용성 테스트 완료');
      
    } catch (error) {
      errors.push(error.message);
      reportGenerator.addTestResult({
        testName: '접근성 및 사용성 테스트',
        status: 'failed',
        duration: Date.now() - testStart,
        screenshots,
        errors,
        metrics: null,
        details: null
      });
      
      console.log('❌ 접근성 및 사용성 테스트 실패:', error.message);
    }
  });
});