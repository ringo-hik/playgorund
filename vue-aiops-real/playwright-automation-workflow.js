#!/usr/bin/env node

/**
 * AI ChatOps 완전 자동화 테스트 워크플로우
 * 
 * 이 스크립트는 다음 기능을 제공합니다:
 * 1. 다양한 테스트 스위트 실행
 * 2. 스크린샷 기반 검증
 * 3. 자동 리포트 생성
 * 4. CI/CD 통합 지원
 * 5. 실패 시 자동 재시도
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

class PlaywrightAutomationWorkflow {
  constructor() {
    this.config = {
      retryCount: 3,
      timeout: 300000, // 5분
      parallel: false,
      browsers: ['chromium'], // 'firefox', 'webkit' 추가 가능
      outputDir: 'test-results/automation-workflow',
      reportsDir: 'test-results/automation-workflow/reports',
      screenshotsDir: 'test-results/automation-workflow/screenshots'
    };
    
    this.testSuites = [
      {
        name: 'comprehensive-e2e-test',
        description: '종합 E2E 테스트',
        file: 'tests/comprehensive-e2e-test.spec.ts',
        priority: 'high',
        timeout: 120000
      },
      {
        name: 'advanced-capture-workflow',
        description: '고급 캡처 워크플로우',
        file: 'tests/advanced-capture-workflow.spec.ts',
        priority: 'high',
        timeout: 180000
      },
      {
        name: 'markdown-report-generator',
        description: 'Markdown 리포트 생성',
        file: 'tests/markdown-report-generator.spec.ts',
        priority: 'medium',
        timeout: 90000
      },
      {
        name: 'comprehensive-test',
        description: '기존 종합 테스트',
        file: 'tests/comprehensive-test.spec.ts',
        priority: 'medium',
        timeout: 60000
      },
      {
        name: 'final-scenario-test',
        description: '최종 시나리오 테스트',
        file: 'tests/final-scenario-test.spec.ts',
        priority: 'medium',
        timeout: 90000
      }
    ];

    this.results = {
      startTime: new Date(),
      endTime: null,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      suiteResults: [],
      screenshots: [],
      errors: []
    };

    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = [this.config.outputDir, this.config.reportsDir, this.config.screenshotsDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '💡',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'debug': '🔍'
    }[level] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    // 로그 파일에도 저장
    const logPath = path.join(this.config.outputDir, 'automation.log');
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(logPath, logEntry);
  }

  async checkPrerequisites() {
    this.log('필수 조건 확인 중...', 'info');
    
    try {
      // Playwright 설치 확인
      await execAsync('npx playwright --version');
      this.log('Playwright 설치 확인됨', 'success');
      
      // 브라우저 설치 확인
      await execAsync('npx playwright install --dry-run');
      this.log('브라우저 설치 확인됨', 'success');
      
      // 개발 서버 실행 확인 (선택적)
      try {
        const response = await fetch('http://localhost:5175');
        this.log('개발 서버 실행 중 (localhost:5175)', 'success');
      } catch {
        this.log('개발 서버가 실행되지 않음 - 자동으로 시작할 예정', 'warning');
      }
      
      return true;
    } catch (error) {
      this.log(`필수 조건 확인 실패: ${error.message}`, 'error');
      return false;
    }
  }

  async startDevServer() {
    return new Promise((resolve, reject) => {
      this.log('개발 서버 시작 중...', 'info');
      
      const server = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });

      let serverReady = false;

      server.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('localhost:5175') && !serverReady) {
          serverReady = true;
          this.log('개발 서버 시작됨 (localhost:5175)', 'success');
          setTimeout(() => resolve(server), 3000); // 3초 대기
        }
      });

      server.stderr.on('data', (data) => {
        this.log(`서버 오류: ${data.toString()}`, 'warning');
      });

      server.on('error', (error) => {
        this.log(`서버 시작 실패: ${error.message}`, 'error');
        reject(error);
      });

      // 30초 후에도 서버가 시작되지 않으면 타임아웃
      setTimeout(() => {
        if (!serverReady) {
          this.log('서버 시작 타임아웃', 'error');
          reject(new Error('Server start timeout'));
        }
      }, 30000);
    });
  }

  async runTestSuite(suite) {
    this.log(`테스트 스위트 실행: ${suite.name}`, 'info');
    
    const startTime = Date.now();
    let attempt = 0;
    let lastError = null;

    while (attempt < this.config.retryCount) {
      try {
        attempt++;
        this.log(`${suite.name} 실행 (시도 ${attempt}/${this.config.retryCount})`, 'info');
        
        const command = `npx playwright test ${suite.file} --reporter=json --output-dir=${this.config.outputDir}`;
        const { stdout, stderr } = await execAsync(command, {
          timeout: suite.timeout
        });

        // 결과 파싱
        const result = this.parseTestResult(stdout, suite);
        result.duration = Date.now() - startTime;
        result.attempts = attempt;
        
        this.log(`${suite.name} 완료 - ${result.passed}/${result.total} 통과`, 'success');
        return result;

      } catch (error) {
        lastError = error;
        this.log(`${suite.name} 실패 (시도 ${attempt}): ${error.message}`, 'warning');
        
        if (attempt < this.config.retryCount) {
          this.log(`${this.config.retryCount - attempt}번 더 시도합니다...`, 'info');
          await this.delay(5000); // 5초 대기
        }
      }
    }

    // 모든 시도 실패
    const failedResult = {
      suiteName: suite.name,
      status: 'failed',
      total: 0,
      passed: 0,
      failed: 1,
      skipped: 0,
      duration: Date.now() - startTime,
      attempts: attempt,
      error: lastError.message,
      screenshots: []
    };

    this.log(`${suite.name} 최종 실패`, 'error');
    return failedResult;
  }

  parseTestResult(stdout, suite) {
    try {
      const jsonResult = JSON.parse(stdout);
      
      const result = {
        suiteName: suite.name,
        status: 'passed',
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        attempts: 1,
        error: null,
        screenshots: []
      };

      if (jsonResult.suites) {
        jsonResult.suites.forEach(suiteData => {
          suiteData.specs.forEach(spec => {
            result.total++;
            
            spec.tests.forEach(test => {
              if (test.results) {
                test.results.forEach(testResult => {
                  switch (testResult.status) {
                    case 'passed':
                      result.passed++;
                      break;
                    case 'failed':
                      result.failed++;
                      break;
                    case 'skipped':
                      result.skipped++;
                      break;
                  }

                  // 스크린샷 수집
                  if (testResult.attachments) {
                    testResult.attachments.forEach(attachment => {
                      if (attachment.contentType === 'image/png') {
                        result.screenshots.push(attachment.path);
                      }
                    });
                  }
                });
              }
            });
          });
        });
      }

      if (result.failed > 0) {
        result.status = 'failed';
      }

      return result;

    } catch (error) {
      this.log(`결과 파싱 실패: ${error.message}`, 'warning');
      return {
        suiteName: suite.name,
        status: 'unknown',
        total: 1,
        passed: 0,
        failed: 1,
        skipped: 0,
        duration: 0,
        attempts: 1,
        error: '결과 파싱 실패',
        screenshots: []
      };
    }
  }

  async runAllTests() {
    this.log('='.repeat(60), 'info');
    this.log('AI ChatOps 자동화 테스트 워크플로우 시작', 'info');
    this.log('='.repeat(60), 'info');

    // 필수 조건 확인
    const prerequisitesOk = await this.checkPrerequisites();
    if (!prerequisitesOk) {
      throw new Error('필수 조건이 충족되지 않음');
    }

    // 개발 서버 시작 (필요한 경우)
    let devServer = null;
    try {
      const response = await fetch('http://localhost:5175');
    } catch {
      devServer = await this.startDevServer();
    }

    try {
      // 우선순위별로 테스트 실행
      const highPriorityTests = this.testSuites.filter(s => s.priority === 'high');
      const mediumPriorityTests = this.testSuites.filter(s => s.priority === 'medium');
      const lowPriorityTests = this.testSuites.filter(s => s.priority === 'low');

      const allTestSuites = [...highPriorityTests, ...mediumPriorityTests, ...lowPriorityTests];

      for (const suite of allTestSuites) {
        const result = await this.runTestSuite(suite);
        this.results.suiteResults.push(result);
        
        // 전체 통계 업데이트
        this.results.totalTests += result.total;
        this.results.passedTests += result.passed;
        this.results.failedTests += result.failed;
        this.results.skippedTests += result.skipped;
        this.results.screenshots.push(...result.screenshots);

        if (result.error) {
          this.results.errors.push({
            suite: suite.name,
            error: result.error
          });
        }

        // 고우선순위 테스트 실패 시 중단 여부 결정
        if (suite.priority === 'high' && result.status === 'failed') {
          this.log(`고우선순위 테스트 ${suite.name} 실패 - 계속 진행`, 'warning');
        }
      }

      this.results.endTime = new Date();
      
      // 최종 리포트 생성
      await this.generateFinalReport();
      
      this.log('='.repeat(60), 'info');
      this.log('자동화 테스트 워크플로우 완료', 'success');
      this.log(`총 ${this.results.totalTests}개 테스트 중 ${this.results.passedTests}개 통과`, 'info');
      this.log('='.repeat(60), 'info');

    } finally {
      // 개발 서버 종료
      if (devServer) {
        devServer.kill();
        this.log('개발 서버 종료됨', 'info');
      }
    }
  }

  async generateFinalReport() {
    this.log('최종 리포트 생성 중...', 'info');
    
    const totalDuration = this.results.endTime.getTime() - this.results.startTime.getTime();
    const successRate = this.results.totalTests > 0 ? 
      Math.round((this.results.passedTests / this.results.totalTests) * 100) : 0;

    // Markdown 리포트
    let report = `# 🤖 AI ChatOps 자동화 테스트 최종 리포트\n\n`;
    report += `**실행 시간**: ${this.results.startTime.toLocaleString('ko-KR')} ~ ${this.results.endTime.toLocaleString('ko-KR')}\n`;
    report += `**총 소요 시간**: ${Math.round(totalDuration / 1000)}초\n`;
    report += `**성공률**: ${successRate}%\n\n`;

    report += `## 📊 실행 결과 요약\n\n`;
    report += `| 항목 | 값 |\n`;
    report += `|------|----|\n`;
    report += `| 총 테스트 수 | ${this.results.totalTests} |\n`;
    report += `| ✅ 통과 | ${this.results.passedTests} |\n`;
    report += `| ❌ 실패 | ${this.results.failedTests} |\n`;
    report += `| ⏭️ 건너뜀 | ${this.results.skippedTests} |\n`;
    report += `| 🖼️ 스크린샷 수 | ${this.results.screenshots.length} |\n\n`;

    report += `## 📋 스위트별 결과\n\n`;
    this.results.suiteResults.forEach(result => {
      const statusIcon = result.status === 'passed' ? '✅' : 
                        result.status === 'failed' ? '❌' : '❓';
      
      report += `### ${statusIcon} ${result.suiteName}\n\n`;
      report += `- **상태**: ${result.status}\n`;
      report += `- **통과/전체**: ${result.passed}/${result.total}\n`;
      report += `- **소요시간**: ${Math.round(result.duration / 1000)}초\n`;
      report += `- **시도횟수**: ${result.attempts}\n`;
      
      if (result.error) {
        report += `- **오류**: ${result.error}\n`;
      }
      
      if (result.screenshots.length > 0) {
        report += `- **스크린샷**: ${result.screenshots.length}개\n`;
      }
      
      report += `\n`;
    });

    if (this.results.errors.length > 0) {
      report += `## ❌ 오류 목록\n\n`;
      this.results.errors.forEach((error, index) => {
        report += `${index + 1}. **${error.suite}**: ${error.error}\n`;
      });
      report += `\n`;
    }

    report += `## 💡 권장사항\n\n`;
    if (this.results.failedTests > 0) {
      report += `- 실패한 테스트의 스크린샷을 확인하여 문제점을 파악하세요.\n`;
      report += `- 네트워크 연결 상태와 개발 서버 안정성을 점검하세요.\n`;
    }
    if (successRate < 100) {
      report += `- 테스트 안정성 향상을 위해 대기 시간 조정을 고려하세요.\n`;
    }
    report += `- 정기적인 자동화 테스트 실행을 권장합니다.\n\n`;

    report += `---\n`;
    report += `*이 리포트는 AI ChatOps 자동화 워크플로우에 의해 생성되었습니다.*\n`;

    // 리포트 저장
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.config.reportsDir, `final-report-${timestamp}.md`);
    fs.writeFileSync(reportPath, report);

    // 최신 리포트 링크
    const latestReportPath = path.join(this.config.reportsDir, 'latest-report.md');
    fs.writeFileSync(latestReportPath, report);

    // JSON 결과도 저장
    const jsonPath = path.join(this.config.reportsDir, `results-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));

    this.log(`최종 리포트 저장됨: ${reportPath}`, 'success');
    return reportPath;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI 실행
if (require.main === module) {
  const workflow = new PlaywrightAutomationWorkflow();
  
  workflow.runAllTests().catch(error => {
    console.error('❌ 워크플로우 실행 실패:', error.message);
    process.exit(1);
  });
}

module.exports = PlaywrightAutomationWorkflow;