package com.example.chatops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * System Prompt Test Request DTO
 * 
 * SystemAdminPage.vue의 testPrompt() 메서드에서 전송하는 요청 데이터와 완전 호환됩니다.
 * aiChatOpsService.testSystemPrompt() 메서드의 매개변수 구조와 동일합니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemPromptTestRequestDto {

    /**
     * 테스트할 시스템 프롬프트 내용
     */
    @NotBlank(message = "시스템 프롬프트 내용은 필수입니다.")
    @Size(min = 10, max = 10000, message = "시스템 프롬프트는 10-10000자 사이여야 합니다.")
    private String promptContent;

    /**
     * 테스트용 사용자 입력
     */
    @NotBlank(message = "테스트 입력은 필수입니다.")
    @Size(min = 1, max = 1000, message = "테스트 입력은 1-1000자 사이여야 합니다.")
    private String testInput;

    /**
     * 테스트 대상 페르소나 코드
     */
    @NotBlank(message = "페르소나 코드는 필수입니다.")
    private String personaCode;

    /**
     * 추가 테스트 옵션 (선택적)
     */
    private TestOptions options;

    /**
     * 테스트 옵션 내부 클래스
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestOptions {
        
        /**
         * 응답 최대 길이 제한
         */
        @Builder.Default
        private Integer maxResponseLength = 2000;
        
        /**
         * 응답 타임아웃 (초)
         */
        @Builder.Default
        private Integer timeoutSeconds = 30;
        
        /**
         * 마크다운 포맷 사용 여부
         */
        @Builder.Default
        private Boolean useMarkdown = true;
        
        /**
         * 디버그 모드 활성화 여부
         */
        @Builder.Default
        private Boolean debugMode = false;
        
        /**
         * 테스트 환경 식별자
         */
        @Builder.Default
        private String environment = "development";
    }

    /**
     * 유효성 검증 헬퍼 메서드
     */
    public boolean isValid() {
        return promptContent != null && !promptContent.trim().isEmpty() &&
               testInput != null && !testInput.trim().isEmpty() &&
               personaCode != null && !personaCode.trim().isEmpty() &&
               promptContent.length() >= 10 && promptContent.length() <= 10000 &&
               testInput.length() >= 1 && testInput.length() <= 1000;
    }

    /**
     * 테스트 요청 요약 정보 생성
     */
    public String getSummary() {
        return String.format("Persona: %s, Prompt Length: %d chars, Test Input: %s", 
                           personaCode, 
                           promptContent != null ? promptContent.length() : 0,
                           testInput != null && testInput.length() > 50 ? 
                               testInput.substring(0, 47) + "..." : testInput);
    }

    /**
     * 기본 테스트 옵션 설정
     */
    public void setDefaultOptions() {
        if (this.options == null) {
            this.options = TestOptions.builder().build();
        }
    }
}