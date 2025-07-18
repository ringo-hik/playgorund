// 콘솔에서 마크다운 변환 테스트
const testCases = [
    {
        title: "환영 메시지 (마크다운)",
        content: "안녕하세요! 📢 마케팅 전문가입니다.\n\n**마케팅 전략 수립 및 캠페인 관리 지원:**\n- 마케팅 전략 기획 및 수립\n- 디지털 마케팅 캠페인 관리\n- 브랜드 마케팅 및 콘텐츠 기획\n- 마케팅 성과 분석 및 개선\n\n어떤 마케팅 지원이 필요하신가요?"
    },
    {
        title: "순수 마크다운 (헤딩, 리스트, 테이블)",
        content: "## AI 응답 예시\n\n사용자의 질문에 대한 AI 응답입니다.\n\n| 항목 | 내용 |\n|------|------|\n| 응답 시간 | 2025-01-17 12:00:00 |\n| 처리 상태 | **성공** |\n\n> ✅ 응답이 성공적으로 처리되었습니다."
    },
    {
        title: "HTML 콘텐츠",
        content: "<div class=\"markdown-content\"><h2>HTML 테스트</h2><p>이것은 HTML 콘텐츠입니다.</p></div>"
    },
    {
        title: "평문 텍스트",
        content: "이것은 평문 텍스트입니다.\n줄바꿈이 있습니다."
    },
    {
        title: "알림 박스 테스트 (개선된 기능)",
        content: "> [!NOTE]\n> 이것은 정보 알림입니다.\n\n> [!WARNING]\n> 이것은 경고 메시지입니다.\n\n> [!ERROR]\n> 이것은 오류 메시지입니다."
    },
    {
        title: "링크 테스트 (개선된 기능)",
        content: "이것은 [테스트 링크](https://example.com)입니다. 여기에는 [다른 링크](https://google.com)도 있습니다."
    },
    {
        title: "중첩 리스트 테스트 (개선된 기능)",
        content: "- 첫 번째 아이템\n  - 중첩된 아이템 1\n  - 중첩된 아이템 2\n    - 더 깊은 중첩\n- 두 번째 아이템"
    },
    {
        title: "테이블 정렬 테스트 (개선된 기능)",
        content: "| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |\n| :--- | :---: | ---: |\n| 데이터 1 | 데이터 2 | 데이터 3 |\n| 데이터 4 | 데이터 5 | 데이터 6 |"
    }
];

// 브라우저 콘솔에서 실행할 수 있는 테스트 함수
function testMarkdownConversion() {
    console.log("=== 마크다운 변환 테스트 ===");
    
    testCases.forEach((testCase, index) => {
        console.log(`\n--- 테스트 ${index + 1}: ${testCase.title} ---`);
        console.log("원본:", testCase.content);
        
        try {
            // aiChatOpsService 객체가 전역에 있다고 가정
            if (typeof aiChatOpsService !== 'undefined') {
                const contentType = aiChatOpsService.detectContentType(testCase.content);
                console.log("감지된 타입:", contentType);
                
                const isMarkdown = aiChatOpsService.isMarkdown(testCase.content);
                console.log("마크다운 여부:", isMarkdown);
                
                const formatted = aiChatOpsService.formatContentForDisplay(testCase.content);
                console.log("변환 결과:", formatted);
                
                // 개선된 기능 확인
                if (testCase.title.includes("개선된 기능")) {
                    console.log("=== 개선된 기능 확인 ===");
                    
                    // 알림 박스 확인
                    if (formatted.includes("markdown-alert")) {
                        console.log("✅ 알림 박스 클래스 확인");
                        if (formatted.includes("ℹ️") || formatted.includes("⚠️") || formatted.includes("❌")) {
                            console.log("✅ 알림 박스 아이콘 확인");
                        }
                    }
                    
                    // 링크 확인
                    if (formatted.includes("markdown-link")) {
                        console.log("✅ 링크 클래스 확인");
                    }
                    
                    // 중첩 리스트 확인
                    if (formatted.includes("markdown-list-item-level-")) {
                        console.log("✅ 중첩 리스트 레벨 클래스 확인");
                    }
                    
                    // 테이블 정렬 확인
                    if (formatted.includes("text-align:")) {
                        console.log("✅ 테이블 정렬 스타일 확인");
                    }
                }
                
                const copyContent = aiChatOpsService.getContentForCopy(testCase.content);
                console.log("복사용 콘텐츠:", copyContent);
            } else {
                console.error("aiChatOpsService가 정의되지 않았습니다.");
            }
        } catch (error) {
            console.error("오류:", error.message);
        }
    });
}

// 함수를 전역으로 노출
window.testMarkdownConversion = testMarkdownConversion;

console.log("테스트 함수가 준비되었습니다. 브라우저에서 testMarkdownConversion()을 실행하세요.");