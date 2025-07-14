import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// 고급 캡처 워크플로우를 위한 유틸리티 클래스
class AdvancedCaptureWorkflow {
  private page: any;
  private testName: string;
  private captureIndex: number = 0;
  private baseDir: string;
  
  constructor(page: any, testName: string) {
    this.page = page;
    this.testName = testName.replace(/[^a-zA-Z0-9\-가-힣]/g, '-');
    this.baseDir = `test-results/advanced-capture/${this.testName}`;
    this.ensureDirectory();
  }

  private ensureDirectory() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  // 상황별 스크린샷 캡처
  async captureState(stateName: string, options: {
    fullPage?: boolean;
    element?: string;
    annotation?: string;
    waitForAnimation?: boolean;
  } = {}) {
    const {
      fullPage = true,
      element,
      annotation,
      waitForAnimation = true
    } = options;

    this.captureIndex++;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${String(this.captureIndex).padStart(3, '0')}-${stateName}-${timestamp}.png`;
    const filepath = path.join(this.baseDir, filename);

    // 애니메이션 대기
    if (waitForAnimation) {
      await this.page.waitForTimeout(1000);
    }

    try {
      if (element) {
        // 특정 요소만 캡처
        const locator = this.page.locator(element);
        await locator.screenshot({ path: filepath });
      } else {
        // 전체 페이지 캡처
        await this.page.screenshot({ path: filepath, fullPage });
      }

      // 메타데이터 저장
      const metadataPath = filepath.replace('.png', '.json');
      const metadata = {
        captureIndex: this.captureIndex,
        stateName,
        timestamp,
        annotation,
        element,
        fullPage,
        viewport: await this.page.viewportSize(),
        url: this.page.url()
      };

      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      console.log(`📸 ${stateName} 캡처 완료: ${filename}`);
      return { filepath, metadata };
      
    } catch (error) {
      console.error(`❌ ${stateName} 캡처 실패:`, error.message);
      return null;
    }
  }

  // 비교 캡처 (변경 전후 비교용)
  async captureComparison(beforeAction: () => Promise<void>, afterAction: () => Promise<void>, comparisonName: string) {
    // 변경 전 캡처
    const beforeCapture = await this.captureState(`${comparisonName}-before`, {
      annotation: '변경 전 상태'
    });

    // 액션 수행
    await beforeAction();
    await this.page.waitForTimeout(1000);

    // 변경 후 캡처
    const afterCapture = await this.captureState(`${comparisonName}-after`, {
      annotation: '변경 후 상태'
    });

    // 추가 액션이 있다면 수행
    if (afterAction) {
      await afterAction();
      await this.page.waitForTimeout(1000);
      
      await this.captureState(`${comparisonName}-final`, {
        annotation: '최종 상태'
      });
    }

    return { beforeCapture, afterCapture };
  }

  // 상호작용 시퀀스 캡처
  async captureInteractionSequence(interactions: Array<{
    name: string;
    action: () => Promise<void>;
    waitTime?: number;
    captureOptions?: any;
  }>) {
    const results = [];

    for (let i = 0; i < interactions.length; i++) {
      const interaction = interactions[i];
      
      console.log(`🎬 상호작용 ${i + 1}/${interactions.length}: ${interaction.name}`);
      
      // 액션 수행
      await interaction.action();
      
      // 대기 시간
      if (interaction.waitTime) {
        await this.page.waitForTimeout(interaction.waitTime);
      }
      
      // 캡처
      const result = await this.captureState(
        `interaction-${String(i + 1).padStart(2, '0')}-${interaction.name}`,
        interaction.captureOptions || {}
      );
      
      results.push(result);
    }

    return results;
  }

  // 다중 뷰포트 캡처
  async captureMultiViewport(viewports: Array<{
    name: string;
    width: number;
    height: number;
  }>, stateName: string) {
    const results = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000);

      const result = await this.captureState(
        `${stateName}-${viewport.name}-${viewport.width}x${viewport.height}`,
        {
          annotation: `${viewport.name} 뷰포트 (${viewport.width}x${viewport.height})`
        }
      );

      results.push(result);
    }

    return results;
  }

  // 에러 상태 캡처
  async captureErrorState(errorContext: string, additionalInfo?: any) {
    const errorCapture = await this.captureState(`error-${errorContext}`, {
      annotation: `에러 발생: ${errorContext}`,
      fullPage: true
    });

    // 에러 로그 저장
    if (additionalInfo) {
      const errorLogPath = path.join(this.baseDir, `error-${errorContext}.log`);
      fs.writeFileSync(errorLogPath, JSON.stringify(additionalInfo, null, 2));
    }

    return errorCapture;
  }

  // 최종 리포트 생성
  async generateCaptureReport() {
    const captureFiles = fs.readdirSync(this.baseDir);
    const pngFiles = captureFiles.filter(f => f.endsWith('.png'));
    const jsonFiles = captureFiles.filter(f => f.endsWith('.json'));

    const report = {
      testName: this.testName,
      totalCaptures: pngFiles.length,
      captureDirectory: this.baseDir,
      captures: []
    };

    // 각 캡처의 메타데이터 수집
    for (const pngFile of pngFiles) {
      const jsonFile = pngFile.replace('.png', '.json');
      if (jsonFiles.includes(jsonFile)) {
        const metadata = JSON.parse(fs.readFileSync(path.join(this.baseDir, jsonFile), 'utf-8'));
        report.captures.push({
          image: pngFile,
          ...metadata
        });
      }
    }

    // 리포트 저장
    const reportPath = path.join(this.baseDir, 'capture-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 캡처 리포트 생성됨: ${reportPath}`);
    return report;
  }
}

test.describe('고급 캡처 기반 검증 워크플로우', () => {
  test('1. 전체 UI 플로우 상세 캡처', async ({ page }) => {
    const workflow = new AdvancedCaptureWorkflow(page, '전체-UI-플로우-상세-캡처');
    
    try {
      console.log('🎬 전체 UI 플로우 상세 캡처 시작');
      
      // 페이지 로딩 과정 캡처
      await page.goto('/');
      await workflow.captureState('페이지-로딩-시작');
      
      await page.waitForLoadState('domcontentloaded');
      await workflow.captureState('DOM-로딩-완료');
      
      await page.waitForLoadState('networkidle');
      await workflow.captureState('네트워크-로딩-완료');

      // 상호작용 시퀀스 캡처
      const interactions = [
        {
          name: '플로팅-버튼-호버',
          action: async () => {
            await page.locator('.ai-chatops-chat-button').hover();
          },
          waitTime: 500
        },
        {
          name: '플로팅-버튼-클릭',
          action: async () => {
            await page.locator('.ai-chatops-chat-button').click();
          },
          waitTime: 2000
        },
        {
          name: '카테고리-화면-표시',
          action: async () => {
            // 카테고리 로딩 대기
            await page.waitForSelector('.category-card', { timeout: 5000 });
          },
          waitTime: 1000
        },
        {
          name: '첫번째-카테고리-호버',
          action: async () => {
            await page.locator('.category-card').first().hover();
          },
          waitTime: 500
        },
        {
          name: '첫번째-카테고리-클릭',
          action: async () => {
            await page.locator('.category-card').first().click();
          },
          waitTime: 2000
        }
      ];

      await workflow.captureInteractionSequence(interactions);

      // 페르소나 선택 과정
      const personaExists = await page.locator('.persona-card').count() > 0;
      if (personaExists) {
        await workflow.captureComparison(
          async () => {
            await page.locator('.persona-card').first().hover();
          },
          async () => {
            await page.locator('.persona-card').first().click();
            await page.waitForTimeout(3000);
          },
          '페르소나-선택'
        );
      }

      // 다양한 뷰포트에서 최종 상태 캡처
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];

      await workflow.captureMultiViewport(viewports, '최종-상태');

      // 리포트 생성
      await workflow.generateCaptureReport();

      console.log('✅ 전체 UI 플로우 상세 캡처 완료');
      
    } catch (error) {
      await workflow.captureErrorState('UI-플로우-캡처-오류', {
        error: error.message,
        stack: error.stack,
        url: page.url()
      });
      throw error;
    }
  });

  test('2. 채팅 기능 심화 캡처', async ({ page }) => {
    const workflow = new AdvancedCaptureWorkflow(page, '채팅-기능-심화-캡처');
    
    try {
      console.log('💬 채팅 기능 심화 캡처 시작');
      
      // 초기 설정
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await workflow.captureState('초기-상태');

      // 채팅창 열기
      await page.locator('.ai-chatops-chat-button').click();
      await page.waitForTimeout(2000);
      await workflow.captureState('채팅창-열림');

      // 카테고리 및 페르소나 선택
      if (await page.locator('.category-card').count() > 0) {
        await page.locator('.category-card').first().click();
        await page.waitForTimeout(2000);
        await workflow.captureState('카테고리-선택됨');

        if (await page.locator('.persona-card').count() > 0) {
          await page.locator('.persona-card').first().click();
          await page.waitForTimeout(3000);
          await workflow.captureState('페르소나-선택됨');

          // 메시지 입력 및 전송 캡처
          const messageTests = [
            {
              message: '안녕하세요! 첫 번째 테스트 메시지입니다.',
              name: '첫번째-메시지'
            },
            {
              message: `다중 라인 메시지 테스트:
첫 번째 줄
두 번째 줄
세 번째 줄`,
              name: '멀티라인-메시지'
            },
            {
              message: '이모지 테스트 🚀 🎉 ✨ 메시지입니다.',
              name: '이모지-메시지'
            },
            {
              message: 'JavaScript 코드를 작성해주세요: console.log("Hello World");',
              name: '코드-요청-메시지'
            }
          ];

          for (let i = 0; i < messageTests.length; i++) {
            const testMsg = messageTests[i];
            
            console.log(`📝 메시지 테스트 ${i + 1}: ${testMsg.name}`);
            
            // 메시지 입력 과정 캡처
            await workflow.captureComparison(
              async () => {
                const inputSelectors = ['textarea', '.message-input', '.chat-input'];
                let messageInput = null;
                
                for (const selector of inputSelectors) {
                  if (await page.locator(selector).count() > 0) {
                    messageInput = page.locator(selector).first();
                    break;
                  }
                }
                
                if (messageInput) {
                  await messageInput.clear();
                  await messageInput.fill(testMsg.message);
                }
              },
              async () => {
                // 메시지 전송
                const inputSelectors = ['textarea', '.message-input', '.chat-input'];
                for (const selector of inputSelectors) {
                  if (await page.locator(selector).count() > 0) {
                    const input = page.locator(selector).first();
                    try {
                      await input.press('Enter');
                      break;
                    } catch {
                      // Enter가 작동하지 않으면 전송 버튼 찾기
                      const sendBtn = page.locator('.send-btn, .btn-send');
                      if (await sendBtn.count() > 0) {
                        await sendBtn.click();
                        break;
                      }
                    }
                  }
                }
                await page.waitForTimeout(3000);
              },
              testMsg.name
            );
          }

          // 채팅 히스토리 전체 캡처
          await workflow.captureState('전체-채팅-히스토리', {
            fullPage: true,
            annotation: '모든 메시지 교환 완료 후 상태'
          });
        }
      }

      await workflow.generateCaptureReport();
      console.log('✅ 채팅 기능 심화 캡처 완료');
      
    } catch (error) {
      await workflow.captureErrorState('채팅-기능-캡처-오류', {
        error: error.message,
        stack: error.stack,
        url: page.url()
      });
      throw error;
    }
  });

  test('3. 설정 및 테마 변경 캡처', async ({ page }) => {
    const workflow = new AdvancedCaptureWorkflow(page, '설정-테마-변경-캡처');
    
    try {
      console.log('🎨 설정 및 테마 변경 캡처 시작');
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await workflow.captureState('초기-테마-상태');

      // 채팅창 열기
      await page.locator('.ai-chatops-chat-button').click();
      await page.waitForTimeout(2000);

      // 테마 변경 테스트
      const themeSelector = page.locator('.theme-selector');
      if (await themeSelector.count() > 0) {
        console.log('🎨 테마 변경 캡처');
        
        // 테마 변경 전후 비교
        await workflow.captureComparison(
          async () => {
            await themeSelector.hover();
          },
          async () => {
            await themeSelector.click();
            await page.waitForTimeout(2000);
          },
          '테마-변경'
        );

        // 다양한 뷰포트에서 테마 확인
        await workflow.captureMultiViewport([
          { name: 'mobile', width: 375, height: 667 },
          { name: 'desktop', width: 1920, height: 1080 }
        ], '테마-변경-후');
      }

      // 언어 변경 테스트
      const languageBtn = page.locator('.language-btn');
      if (await languageBtn.count() > 0) {
        console.log('🌐 언어 변경 캡처');
        
        await workflow.captureComparison(
          async () => {
            await languageBtn.hover();
          },
          async () => {
            await languageBtn.click();
            await page.waitForTimeout(2000);
          },
          '언어-변경'
        );
      }

      // 피드백 탭 캡처
      const feedbackTab = page.locator('button').filter({ hasText: '피드백' });
      if (await feedbackTab.count() > 0) {
        console.log('📝 피드백 탭 캡처');
        
        await workflow.captureComparison(
          async () => {
            await feedbackTab.hover();
          },
          async () => {
            await feedbackTab.click();
            await page.waitForTimeout(2000);
          },
          '피드백-탭'
        );
      }

      await workflow.generateCaptureReport();
      console.log('✅ 설정 및 테마 변경 캡처 완료');
      
    } catch (error) {
      await workflow.captureErrorState('설정-테마-캡처-오류', {
        error: error.message,
        stack: error.stack,
        url: page.url()
      });
      throw error;
    }
  });

  test('4. 에러 상황 및 복구 캡처', async ({ page }) => {
    const workflow = new AdvancedCaptureWorkflow(page, '에러-상황-복구-캡처');
    
    try {
      console.log('🔧 에러 상황 및 복구 캡처 시작');
      
      // 페이지 에러 모니터링
      const errors: string[] = [];
      page.on('pageerror', error => {
        errors.push(error.message);
        console.log('❌ Page Error:', error.message);
      });

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
          console.log('❌ Console Error:', msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await workflow.captureState('에러-모니터링-시작');

      // 잘못된 액션 시도 (의도적 에러 유발)
      try {
        await page.locator('.non-existent-element').click({ timeout: 3000 });
      } catch (error) {
        await workflow.captureErrorState('존재하지-않는-요소-클릭', {
          error: error.message,
          type: 'element_not_found'
        });
      }

      // 네트워크 오류 시뮬레이션
      await page.route('**/api/**', route => {
        route.abort('failed');
      });

      await page.reload();
      await page.waitForTimeout(5000);
      await workflow.captureState('네트워크-오류-상태');

      // 복구 과정 캡처
      await page.unroute('**/api/**');
      await page.reload();
      await page.waitForLoadState('networkidle');
      await workflow.captureState('복구-완료-상태');

      // 에러 로그 요약
      const errorSummary = {
        totalErrors: errors.length,
        errors: errors,
        timestamp: new Date().toISOString()
      };

      await workflow.captureErrorState('에러-요약', errorSummary);
      await workflow.generateCaptureReport();
      
      console.log('✅ 에러 상황 및 복구 캡처 완료');
      
    } catch (error) {
      await workflow.captureErrorState('에러-캡처-프로세스-실패', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  });
});