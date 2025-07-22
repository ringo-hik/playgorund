package com.example.chatops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * System Prompt Update Request DTO
 * 
 * SystemAdminPage.vue의 savePrompt() 메서드에서 전송하는 요청 데이터와 완전 호환됩니다.
 * aiChatOpsService.updatePersonaSystemPrompt() 메서드의 매개변수 구조와 동일합니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemPromptUpdateRequestDto {

    /**
     * 업데이트할 시스템 프롬프트 내용
     */
    @NotBlank(message = "시스템 프롬프트 내용은 필수입니다.")
    @Size(min = 10, max = 10000, message = "시스템 프롬프트는 10-10000자 사이여야 합니다.")
    private String systemPrompt;

    /**
     * 업데이트 메타데이터 (선택적)
     */
    private UpdateMetadata metadata;

    /**
     * 업데이트 메타데이터 내부 클래스
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateMetadata {
        
        /**
         * 업데이트 이유/코멘트
         */
        private String updateReason;
        
        /**
         * 업데이트 수행자
         */
        private String updatedBy;
        
        /**
         * 백업 생성 여부
         */
        @Builder.Default
        private Boolean createBackup = true;
        
        /**
         * 버전 태그
         */
        private String versionTag;
        
        /**
         * 테스트 완료 여부
         */
        @Builder.Default
        private Boolean tested = false;
    }

    /**
     * 유효성 검증 헬퍼 메서드
     */
    public boolean isValid() {
        return systemPrompt != null && 
               !systemPrompt.trim().isEmpty() &&
               systemPrompt.length() >= 10 && 
               systemPrompt.length() <= 10000;
    }

    /**
     * 업데이트 요약 정보 생성
     */
    public String getSummary() {
        return String.format("System Prompt Update: %d characters", 
                           systemPrompt != null ? systemPrompt.length() : 0);
    }

    /**
     * 기본 메타데이터 설정
     */
    public void setDefaultMetadata(String updatedBy) {
        if (this.metadata == null) {
            this.metadata = UpdateMetadata.builder()
                .updatedBy(updatedBy)
                .updateReason("System prompt updated via admin interface")
                .build();
        }
    }
}