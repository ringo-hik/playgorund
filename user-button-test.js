const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testUserButtonPosition() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1500
    });
    
    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log('🔍 USER 버튼 위치 테스트 시작...');
        
        // 스크린샷 저장 디렉토리 생성
        const screenshotDir = path.join(__dirname, 'user-button-test');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }
        
        // 페이지 로드
        await page.goto('http://localhost:3000/test.html');
        await page.waitForTimeout(3000);
        
        console.log('📸 1. 초기 화면 캡처');
        await page.screenshot({ 
            path: path.join(screenshotDir, '1-initial.png'),
            fullPage: true 
        });
        
        // 채팅 열기
        console.log('💬 2. 채팅 열기');
        await page.click('button:has-text("채팅 열기")');
        await page.waitForTimeout(3000);
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '2-chat-opened.png'),
            fullPage: true 
        });
        
        // 채팅 컨테이너 확인
        const chatContainer = await page.$('.ai-chatops-window');
        if (chatContainer) {
            console.log('✅ 채팅 창이 정상적으로 열렸습니다.');
            
            // 채팅 창만 별도로 캡처
            const chatBounds = await chatContainer.boundingBox();
            await page.screenshot({ 
                path: path.join(screenshotDir, '3-chat-window-only.png'),
                clip: chatBounds
            });
            
            // 개발자 도구로 Elements.vue의 스타일 확인
            const userBadgeStyles = await page.evaluate(() => {
                const userBrand = document.querySelector('.user-message-brand');
                if (userBrand) {
                    const styles = window.getComputedStyle(userBrand);
                    return {
                        textAlign: styles.textAlign,
                        justifyContent: styles.justifyContent,
                        display: styles.display
                    };
                }
                return null;
            });
            
            console.log('🎨 User message brand 스타일:', userBadgeStyles);
            
            // USER 버튼 스타일 확인
            const userBadgeButtonStyles = await page.evaluate(() => {
                const userBadge = document.querySelector('.user-badge');
                if (userBadge) {
                    const styles = window.getComputedStyle(userBadge);
                    return {
                        background: styles.background,
                        borderRadius: styles.borderRadius,
                        padding: styles.padding,
                        fontSize: styles.fontSize,
                        boxShadow: styles.boxShadow
                    };
                }
                return null;
            });
            
            console.log('🏷️ User badge 스타일:', userBadgeButtonStyles);
            
            // 테스트 메시지를 입력할 수 있는지 확인
            const messageInput = await page.$('.message-textarea');
            if (messageInput) {
                console.log('📝 3. 테스트 메시지 입력');
                
                // 메시지 입력
                await page.fill('.message-textarea', 'USER 버튼 위치 테스트 메시지입니다. 왼쪽에 배치되었는지 확인해주세요!');
                await page.waitForTimeout(1000);
                
                // 메시지 전송 (모킹된 환경이므로 실제 전송은 안 될 수 있음)
                try {
                    await page.click('.send-button');
                    await page.waitForTimeout(2000);
                    
                    // 사용자 메시지가 화면에 나타났는지 확인
                    const userMessages = await page.$$('.user-message-brand');
                    if (userMessages.length > 0) {
                        console.log('✅ 사용자 메시지가 화면에 표시됨');
                        
                        // USER 버튼 위치 측정
                        const firstUserMessage = userMessages[0];
                        const userMessageBounds = await firstUserMessage.boundingBox();
                        
                        console.log('📍 USER 메시지 위치:', {
                            x: userMessageBounds.x,
                            y: userMessageBounds.y,
                            width: userMessageBounds.width,
                            height: userMessageBounds.height
                        });
                        
                        // 왼쪽 정렬 확인 (x 좌표가 200px 미만이면 왼쪽으로 간주)
                        const isLeftAligned = userMessageBounds.x < 200;
                        console.log(isLeftAligned ? '✅ USER 버튼이 왼쪽에 정렬됨' : '❌ USER 버튼이 오른쪽에 정렬됨');
                        
                        await page.screenshot({ 
                            path: path.join(screenshotDir, '4-user-message-sent.png'),
                            fullPage: true 
                        });
                    } else {
                        console.log('⚠️ 사용자 메시지가 화면에 표시되지 않음 (모킹 환경)');
                    }
                } catch (error) {
                    console.log('⚠️ 메시지 전송 중 오류 (예상됨):', error.message);
                }
            } else {
                console.log('❌ 메시지 입력창을 찾을 수 없음');
            }
            
        } else {
            console.log('❌ 채팅 창이 열리지 않았습니다.');
        }
        
        console.log('📸 5. 최종 상태 캡처');
        await page.screenshot({ 
            path: path.join(screenshotDir, '5-final-state.png'),
            fullPage: true 
        });
        
        console.log(`✅ USER 버튼 테스트 완료! 스크린샷: ${screenshotDir}`);
        
    } catch (error) {
        console.error('❌ 테스트 중 오류:', error);
    } finally {
        await browser.close();
    }
}

testUserButtonPosition();