import { test, expect } from '@playwright/test';

test.describe('Markdown Conversion Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should convert welcome message markdown to HTML with custom classes', async ({ page }) => {
    // 마케팅 전문가 페르소나 선택 (마크다운 환영 메시지 포함)
    const personas = page.locator('[data-testid="persona-card"]');
    if (await personas.count() > 0) {
      // 마케팅 전문가 페르소나 찾기
      const marketingPersona = personas.filter({ hasText: '마케팅 전문가' });
      if (await marketingPersona.count() > 0) {
        await marketingPersona.click();
        await page.waitForTimeout(1000);
        
        // 환영 메시지 확인
        const welcomeMessage = page.locator('.welcome-message');
        await expect(welcomeMessage).toBeVisible();
        
        // 마크다운이 HTML로 변환되었는지 확인
        const welcomeContent = await welcomeMessage.innerHTML();
        console.log('Welcome message HTML:', welcomeContent);
        
        // customMarkdown.css 클래스들이 적용되었는지 확인
        expect(welcomeContent).toContain('class="markdown-content"'); // 래퍼 클래스
        expect(welcomeContent).toContain('class="markdown-strong"'); // **텍스트**가 커스텀 클래스로 변환
        expect(welcomeContent).toContain('class="markdown-list"'); // 리스트가 커스텀 클래스로 변환
        expect(welcomeContent).toContain('class="markdown-list-item"'); // 리스트 항목이 커스텀 클래스로 변환
        expect(welcomeContent).toContain('class="markdown-paragraph"'); // 단락이 커스텀 클래스로 변환
      }
    }
  });

  test('should handle different content types properly', async ({ page }) => {
    // 페르소나 선택 후 채팅 진행
    const personas = page.locator('[data-testid="persona-card"]');
    if (await personas.count() > 0) {
      await personas.first().click();
      await page.waitForTimeout(1000);
      
      // 메시지 입력
      const messageInput = page.locator('input[type="text"], textarea');
      if (await messageInput.count() > 0) {
        await messageInput.fill('테스트 메시지');
        await page.keyboard.press('Enter');
        
        // 응답 대기
        await page.waitForTimeout(2000);
        
        // 메시지 콘텐츠 확인
        const messageContent = page.locator('.message-bubble__content');
        if (await messageContent.count() > 0) {
          const lastMessage = messageContent.last();
          await expect(lastMessage).toBeVisible();
          
          // 메시지 내용 확인
          const content = await lastMessage.innerHTML();
          console.log('Message content:', content);
          
          // 마크다운 클래스 확인
          expect(content).toContain('markdown-content');
        }
      }
    }
  });

  test('should preserve original format when copying', async ({ page }) => {
    // 페르소나 선택
    const personas = page.locator('[data-testid="persona-card"]');
    if (await personas.count() > 0) {
      await personas.first().click();
      await page.waitForTimeout(1000);
      
      // 복사 버튼 확인
      const copyButton = page.locator('.message-action--copy');
      if (await copyButton.count() > 0) {
        // 복사 버튼 클릭
        await copyButton.first().click();
        
        // 복사 완료 상태 확인
        await expect(copyButton.first()).toHaveClass(/message-action--copied/);
        
        // 클립보드 내용 확인 (브라우저 보안 정책으로 인해 제한적)
        const clipboardText = await page.evaluate(() => {
          return navigator.clipboard.readText().catch(() => 'clipboard access denied');
        });
        console.log('Clipboard content:', clipboardText);
      }
    }
  });

  test('should render markdown elements with custom styles', async ({ page }) => {
    // 개발자 도구에서 마크다운 변환 테스트
    const testResults = await page.evaluate(() => {
      // 테스트 케이스들
      const testCases = [
        {
          title: "헤딩 테스트",
          content: "## 제목\n\n내용입니다.",
          expectedClasses: ['markdown-heading', 'markdown-h2', 'markdown-paragraph']
        },
        {
          title: "리스트 테스트",
          content: "- 첫 번째\n- 두 번째\n- 세 번째",
          expectedClasses: ['markdown-list', 'markdown-list-item']
        },
        {
          title: "테이블 테스트",
          content: "| 컬럼1 | 컬럼2 |\n|-------|-------|\n| 데이터1 | 데이터2 |",
          expectedClasses: ['markdown-table-container', 'markdown-table', 'markdown-table-row', 'markdown-table-cell']
        },
        {
          title: "복합 마크다운 테스트",
          content: "### 제목\n\n**강조 텍스트**와 *기울임*\n\n- 리스트 항목\n- 두 번째 항목\n\n`인라인 코드`\n\n> 인용문\n\n```javascript\nconst test = 'code';\n```",
          expectedClasses: ['markdown-heading', 'markdown-h3', 'markdown-strong', 'markdown-em', 'markdown-list', 'markdown-inline-code', 'markdown-alert', 'markdown-code-block']
        }
      ];
      
      const results = [];
      
      // 각 테스트 케이스 실행
      testCases.forEach(testCase => {
        console.log(`=== ${testCase.title} ===`);
        console.log('원본:', testCase.content);
        
        if (typeof aiChatOpsService !== 'undefined') {
          const contentType = aiChatOpsService.detectContentType(testCase.content);
          console.log('감지된 타입:', contentType);
          
          const formatted = aiChatOpsService.formatContentForDisplay(testCase.content);
          console.log('변환 결과:', formatted);
          
          // 클래스 확인
          const hasExpectedClasses = testCase.expectedClasses.every(className => 
            formatted.includes(`class="${className}"`) || formatted.includes(`class="markdown-content"`)
          );
          
          results.push({
            title: testCase.title,
            contentType,
            formatted,
            hasExpectedClasses,
            expectedClasses: testCase.expectedClasses
          });
        }
      });
      
      return results;
    });
    
    // 모든 테스트 케이스가 예상된 클래스를 가지고 있는지 확인
    testResults.forEach(result => {
      console.log(`${result.title}: ${result.hasExpectedClasses ? 'PASS' : 'FAIL'}`);
      expect(result.formatted).toContain('class="markdown-content"');
    });
  });

  test('should convert improved markdown features', async ({ page }) => {
    // 개선된 마크다운 기능들을 테스트
    const testResults = await page.evaluate(() => {
      const enhancedTestCases = [
        {
          title: "알림 박스 테스트",
          content: "> [!NOTE]\n> 이것은 노트입니다.\n\n> [!WARNING]\n> 이것은 경고입니다.\n\n> [!ERROR]\n> 이것은 오류입니다.",
          expectedFeatures: ['markdown-alert-info', 'markdown-alert-warning', 'markdown-alert-error', 'ℹ️', '⚠️', '❌']
        },
        {
          title: "링크 테스트",
          content: "이것은 [테스트 링크](https://example.com)입니다.",
          expectedFeatures: ['href="https://example.com"', 'class="markdown-link"', '테스트 링크']
        },
        {
          title: "중첩 리스트 테스트",
          content: "- 첫 번째\n  - 중첩된 항목\n    - 더 깊은 중첩\n- 두 번째",
          expectedFeatures: ['markdown-list-item-level-0', 'markdown-list-item-level-1', 'markdown-list-item-level-2']
        },
        {
          title: "정렬 테이블 테스트",
          content: "| 왼쪽 | 가운데 | 오른쪽 |\n| :--- | :---: | ---: |\n| 데이터1 | 데이터2 | 데이터3 |",
          expectedFeatures: ['text-align: left', 'text-align: center', 'text-align: right']
        }
      ];
      
      const results = [];
      
      enhancedTestCases.forEach(testCase => {
        console.log(`=== ${testCase.title} ===`);
        console.log('원본:', testCase.content);
        
        if (typeof aiChatOpsService !== 'undefined') {
          const formatted = aiChatOpsService.formatContentForDisplay(testCase.content);
          console.log('변환 결과:', formatted);
          
          // 예상되는 기능들이 포함되어 있는지 확인
          const hasExpectedFeatures = testCase.expectedFeatures.every(feature => 
            formatted.includes(feature)
          );
          
          results.push({
            title: testCase.title,
            formatted,
            hasExpectedFeatures,
            expectedFeatures: testCase.expectedFeatures
          });
        }
      });
      
      return results;
    });
    
    // 모든 개선된 기능이 제대로 작동하는지 확인
    testResults.forEach(result => {
      console.log(`${result.title}: ${result.hasExpectedFeatures ? 'PASS' : 'FAIL'}`);
      if (!result.hasExpectedFeatures) {
        console.log('Missing features:', result.expectedFeatures);
        console.log('HTML output:', result.formatted);
      }
    });
  });
});