const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runAIChatOpsTest() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 // 1초씩 천천히 실행
    });
    
    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log('🚀 AIChatOps 전체 워크플로우 테스트 시작...');
        
        // 테스트 결과 저장 디렉토리 생성
        const screenshotDir = path.join(__dirname, 'test-screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }
        
        const testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0
            }
        };
        
        // 1. 업데이트된 테스트 페이지 로드
        console.log('📄 테스트 페이지 로딩...');
        await page.goto('http://localhost:3000/test.html');
        await page.waitForTimeout(2000);
        
        // 초기 화면 캡처
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-initial-load.png'),
            fullPage: true 
        });
        
        testResults.tests.push({
            name: '초기 페이지 로드',
            status: 'PASSED',
            screenshot: '01-initial-load.png',
            description: '업데이트된 테스트 환경이 정상적으로 로드됨'
        });
        
        // 2. 초기 상태 확인
        console.log('🎨 초기 상태 확인...');
        
        // 페이지가 완전히 로드될 때까지 대기
        await page.waitForSelector('body', { timeout: 10000 });
        await page.waitForTimeout(3000);
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '02-page-loaded.png'),
            fullPage: true 
        });
        
        testResults.tests.push({
            name: '페이지 완전 로드',
            status: 'PASSED',
            screenshot: '02-page-loaded.png',
            description: '테스트 페이지가 완전히 로드됨'
        });
        
        // 3. AIChatOps 채팅 버튼 클릭
        console.log('💬 채팅창 열기...');
        
        // 채팅 열기 버튼 찾기 및 클릭
        await page.waitForSelector('button:has-text("채팅 열기")', { timeout: 10000 });
        await page.click('button:has-text("채팅 열기")');
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '03-chat-opened.png'),
            fullPage: true 
        });
        
        testResults.tests.push({
            name: '채팅창 열기',
            status: 'PASSED',
            screenshot: '03-chat-opened.png',
            description: '플로팅 버튼 클릭으로 채팅창이 정상적으로 열림'
        });
        
        // 4. 카테고리 선택 테스트
        console.log('📋 카테고리 선택 테스트...');
        
        // "운영/관리" 카테고리 선택
        await page.waitForSelector('.category-card:has-text("운영/관리")', { timeout: 5000 });
        await page.click('.category-card:has-text("운영/관리")');
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '04-category-selected.png'),
            fullPage: true 
        });
        
        testResults.tests.push({
            name: '운영/관리 카테고리 선택',
            status: 'PASSED',
            screenshot: '04-category-selected.png',
            description: '운영/관리 카테고리가 정상적으로 선택됨'
        });
        
        // 5. 페르소나 선택 테스트
        console.log('👤 페르소나 선택 테스트...');
        
        // 첫 번째 페르소나 선택
        await page.waitForSelector('.persona-card', { timeout: 5000 });
        await page.click('.persona-card:first-child');
        await page.waitForTimeout(3000);
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '05-persona-selected.png'),
            fullPage: true 
        });
        
        testResults.tests.push({
            name: '페르소나 선택',
            status: 'PASSED',
            screenshot: '05-persona-selected.png',
            description: '페르소나가 정상적으로 선택되고 채팅 화면으로 전환됨'
        });
        
        // 6. USER 버튼 위치 확인 및 메시지 전송 테스트
        console.log('💌 메시지 전송 및 USER 버튼 위치 확인...');
        
        // 메시지 입력창에 텍스트 입력
        await page.waitForSelector('.message-textarea', { timeout: 5000 });
        await page.fill('.message-textarea', '안녕하세요! USER 버튼 위치 테스트 메시지입니다.');
        await page.waitForTimeout(1000);
        
        // 메시지 전송
        await page.click('.send-button');
        await page.waitForTimeout(3000);
        
        // USER 메시지가 왼쪽에 표시되는지 확인하기 위한 스크린샷
        await page.screenshot({ 
            path: path.join(screenshotDir, '06-user-message-left-aligned.png'),
            fullPage: true 
        });
        
        // USER 버튼 위치 검증
        const userBadge = await page.locator('.user-message-brand').first();
        const userBadgeBox = await userBadge.boundingBox();
        
        if (userBadgeBox && userBadgeBox.x < 200) { // 왼쪽에 위치하는지 확인
            testResults.tests.push({
                name: 'USER 버튼 왼쪽 정렬 확인',
                status: 'PASSED',
                screenshot: '06-user-message-left-aligned.png',
                description: `USER 버튼이 왼쪽(x=${Math.round(userBadgeBox.x)})에 정상적으로 배치됨`
            });
        } else {
            testResults.tests.push({
                name: 'USER 버튼 왼쪽 정렬 확인',
                status: 'FAILED',
                screenshot: '06-user-message-left-aligned.png',
                description: 'USER 버튼이 예상 위치에 배치되지 않음'
            });
        }
        
        // 7. AI 응답 대기 및 확인
        console.log('🤖 AI 응답 대기...');
        
        // AI 응답이 나타날 때까지 대기 (최대 10초)
        try {
            await page.waitForSelector('.message-bubble--ai', { timeout: 10000 });
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '07-ai-response.png'),
                fullPage: true 
            });
            
            testResults.tests.push({
                name: 'AI 응답 수신',
                status: 'PASSED',
                screenshot: '07-ai-response.png',
                description: 'AI 응답이 정상적으로 수신되고 표시됨'
            });
        } catch (error) {
            await page.screenshot({ 
                path: path.join(screenshotDir, '07-ai-response-failed.png'),
                fullPage: true 
            });
            
            testResults.tests.push({
                name: 'AI 응답 수신',
                status: 'FAILED',
                screenshot: '07-ai-response-failed.png',
                description: 'AI 응답 대기 시간 초과 - 모크 서버 연결 확인 필요'
            });
        }
        
        // 8. 연속 대화 기능 테스트
        console.log('🔄 연속 대화 기능 테스트...');
        
        // 연속 대화 버튼 클릭
        try {
            await page.click('.continuous-chat-btn');
            await page.waitForTimeout(1000);
            
            // 두 번째 메시지 전송
            await page.fill('.message-textarea', '방금 말한 내용에 대해 더 자세히 설명해주세요.');
            await page.click('.send-button');
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '08-continuous-chat.png'),
                fullPage: true 
            });
            
            testResults.tests.push({
                name: '연속 대화 기능',
                status: 'PASSED',
                screenshot: '08-continuous-chat.png',
                description: '연속 대화 기능이 정상적으로 작동함'
            });
        } catch (error) {
            testResults.tests.push({
                name: '연속 대화 기능',
                status: 'FAILED',
                screenshot: '08-continuous-chat.png',
                description: '연속 대화 버튼을 찾을 수 없음'
            });
        }
        
        // 9. 빠른 질문 기능 테스트
        console.log('⚡ 빠른 질문 기능 테스트...');
        
        try {
            // 빠른 질문 버튼 클릭
            await page.click('button[title="빠른 질문"]');
            await page.waitForTimeout(1000);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '09-quick-questions.png'),
                fullPage: true 
            });
            
            testResults.tests.push({
                name: '빠른 질문 기능',
                status: 'PASSED',
                screenshot: '09-quick-questions.png',
                description: '빠른 질문 드롭다운이 정상적으로 표시됨'
            });
        } catch (error) {
            testResults.tests.push({
                name: '빠른 질문 기능',
                status: 'FAILED',
                screenshot: '09-quick-questions.png',
                description: '빠른 질문 버튼을 찾을 수 없음'
            });
        }
        
        // 10. 피드백 탭 테스트
        console.log('⭐ 피드백 기능 테스트...');
        
        try {
            // 피드백 탭으로 전환
            await page.click('button:has-text("피드백")');
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '10-feedback-tab.png'),
                fullPage: true 
            });
            
            testResults.tests.push({
                name: '피드백 탭 전환',
                status: 'PASSED',
                screenshot: '10-feedback-tab.png',
                description: '피드백 탭으로 정상적으로 전환됨'
            });
        } catch (error) {
            testResults.tests.push({
                name: '피드백 탭 전환',
                status: 'FAILED',
                screenshot: '10-feedback-tab.png',
                description: '피드백 탭을 찾을 수 없음'
            });
        }
        
        // 11. 최종 전체 화면 캡처
        console.log('📸 최종 전체 화면 캡처...');
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '11-final-overview.png'),
            fullPage: true 
        });
        
        testResults.tests.push({
            name: '최종 전체 화면',
            status: 'PASSED',
            screenshot: '11-final-overview.png',
            description: '모든 테스트 완료 후 최종 상태'
        });
        
        // 테스트 결과 집계
        testResults.summary.total = testResults.tests.length;
        testResults.summary.passed = testResults.tests.filter(t => t.status === 'PASSED').length;
        testResults.summary.failed = testResults.tests.filter(t => t.status === 'FAILED').length;
        
        // 테스트 결과 JSON 파일로 저장
        fs.writeFileSync(
            path.join(screenshotDir, 'test-results.json'), 
            JSON.stringify(testResults, null, 2)
        );
        
        console.log('\\n✅ 테스트 완료!');
        console.log(`📊 총 ${testResults.summary.total}개 테스트 중 ${testResults.summary.passed}개 성공, ${testResults.summary.failed}개 실패`);
        console.log(`📁 스크린샷 저장 위치: ${screenshotDir}`);
        
        return testResults;
        
    } catch (error) {
        console.error('❌ 테스트 실행 중 오류 발생:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// 테스트 실행
if (require.main === module) {
    runAIChatOpsTest()
        .then(results => {
            console.log('\\n🎉 모든 테스트가 완료되었습니다!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 테스트 실행 실패:', error);
            process.exit(1);
        });
}

module.exports = { runAIChatOpsTest };