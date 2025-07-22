package com.example.chatops.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard API Response DTO
 * 
 * Vue.js aiChatOpsService.js의 모든 API 응답 구조와 완전 호환됩니다.
 * 모든 컨트롤러에서 일관된 응답 형식을 제공하기 위한 표준 DTO입니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseDto<T> {

    /**
     * 요청 성공 여부
     * Vue.js에서 response.success로 접근
     */
    @Builder.Default
    private Boolean success = true;

    /**
     * 응답 데이터
     * Vue.js에서 response.data로 접근
     */
    private T data;

    /**
     * 성공 메시지
     * Vue.js에서 response.message로 접근
     */
    private String message;

    /**
     * 오류 메시지 (실패 시)
     * Vue.js에서 response.errorMessage로 접근
     */
    private String errorMessage;

    /**
     * 응답 생성 시각
     * ISO 8601 형식으로 직렬화
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * 세션 ID (선택적)
     * Vue.js에서 response.sessionId로 접근
     */
    private String sessionId;

    /**
     * 추가 메타데이터 (선택적)
     */
    private ResponseMetadata metadata;

    /**
     * 응답 메타데이터 내부 클래스
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ResponseMetadata {
        
        /**
         * 요청 처리 시간 (밀리초)
         */
        private Long processingTime;
        
        /**
         * API 버전
         */
        private String apiVersion;
        
        /**
         * 요청 ID (추적용)
         */
        private String requestId;
        
        /**
         * 페이지네이션 정보 (목록 조회 시)
         */
        private PaginationInfo pagination;
        
        /**
         * 추가 정보
         */
        private Object additional;
    }

    /**
     * 페이지네이션 정보 클래스
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PaginationInfo {
        private Integer page;
        private Integer size;
        private Long totalElements;
        private Integer totalPages;
        private Boolean hasNext;
        private Boolean hasPrevious;
    }

    /**
     * 성공 응답 생성 헬퍼 메서드
     */
    public static <T> ApiResponseDto<T> success(T data) {
        return ApiResponseDto.<T>builder()
            .success(true)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 성공 응답 생성 헬퍼 메서드 (메시지 포함)
     */
    public static <T> ApiResponseDto<T> success(T data, String message) {
        return ApiResponseDto.<T>builder()
            .success(true)
            .data(data)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 실패 응답 생성 헬퍼 메서드
     */
    public static <T> ApiResponseDto<T> error(String errorMessage) {
        return ApiResponseDto.<T>builder()
            .success(false)
            .errorMessage(errorMessage)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 실패 응답 생성 헬퍼 메서드 (예외 포함)
     */
    public static <T> ApiResponseDto<T> error(String errorMessage, Exception exception) {
        return ApiResponseDto.<T>builder()
            .success(false)
            .errorMessage(errorMessage)
            .timestamp(LocalDateTime.now())
            .metadata(ResponseMetadata.builder()
                .additional(exception.getClass().getSimpleName())
                .build())
            .build();
    }

    /**
     * 메타데이터와 함께 성공 응답 생성
     */
    public static <T> ApiResponseDto<T> successWithMetadata(T data, String message, ResponseMetadata metadata) {
        return ApiResponseDto.<T>builder()
            .success(true)
            .data(data)
            .message(message)
            .metadata(metadata)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 세션 ID와 함께 성공 응답 생성
     */
    public static <T> ApiResponseDto<T> successWithSession(T data, String message, String sessionId) {
        return ApiResponseDto.<T>builder()
            .success(true)
            .data(data)
            .message(message)
            .sessionId(sessionId)
            .timestamp(LocalDateTime.now())
            .build();
    }

    /**
     * 응답 요약 정보 생성
     */
    public String getSummary() {
        return String.format("ApiResponse[success=%s, hasData=%s, message=%s]", 
                           success, 
                           data != null, 
                           message != null ? message : errorMessage);
    }

    /**
     * Vue.js 호환성을 위한 타임스탬프 문자열 반환
     */
    public String getTimestampString() {
        return timestamp != null ? timestamp.toString() : null;
    }
}