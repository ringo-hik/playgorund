package com.example.chatops.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * Persona Data Transfer Object
 * 
 * Vue.js PersonaManager 컴포넌트와 완전 호환되는 DTO 클래스입니다.
 * 모든 필드는 기존 Vue 컴포넌트의 newPersona 객체와 동일한 구조를 가집니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PersonaDto {

    /**
     * 페르소나 코드 (고유 식별자)
     * 영문, 숫자, 언더스코어만 허용
     */
    @NotBlank(message = "페르소나 코드는 필수 입력 항목입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "페르소나 코드는 영문, 숫자, 언더스코어만 사용 가능합니다.")
    @Size(min = 2, max = 50, message = "페르소나 코드는 2-50자 사이여야 합니다.")
    private String personaCode;

    /**
     * 페르소나 제목 (한글)
     */
    @NotBlank(message = "제목은 필수 입력 항목입니다.")
    @Size(min = 2, max = 100, message = "제목은 2-100자 사이여야 합니다.")
    private String title;

    /**
     * 페르소나 설명 (한글)
     */
    @NotBlank(message = "설명은 필수 입력 항목입니다.")
    @Size(min = 10, max = 500, message = "설명은 10-500자 사이여야 합니다.")
    private String description;

    /**
     * 페르소나 설명 (영문)
     */
    @NotBlank(message = "영문 설명은 필수 입력 항목입니다.")
    @Size(min = 10, max = 500, message = "영문 설명은 10-500자 사이여야 합니다.")
    private String descriptionEn;

    /**
     * 페르소나 카테고리
     * personal, general, operation, extension 중 하나
     */
    @NotBlank(message = "카테고리는 필수 선택 항목입니다.")
    @Pattern(regexp = "^(personal|general|operation|extension)$", 
             message = "카테고리는 personal, general, operation, extension 중 하나여야 합니다.")
    private String category;

    /**
     * 페르소나 태그 목록
     */
    private List<String> tags;

    /**
     * 환영 메시지 (마크다운 지원)
     */
    @Size(max = 1000, message = "환영 메시지는 1000자를 초과할 수 없습니다.")
    private String welcomeMsg;

    /**
     * 시스템 프롬프트
     * AI의 역할과 응답 스타일을 정의하는 프롬프트
     */
    @Size(max = 5000, message = "시스템 프롬프트는 5000자를 초과할 수 없습니다.")
    private String systemPrompt;

    /**
     * 생성일시 (선택적)
     */
    private String createdDate;

    /**
     * 수정일시 (선택적)
     */
    private String updatedDate;

    /**
     * 활성 상태 (선택적)
     */
    @Builder.Default
    private Boolean active = true;

    /**
     * 기본 시스템 프롬프트 생성 헬퍼 메서드
     */
    public void setDefaultSystemPrompt() {
        if (this.systemPrompt == null || this.systemPrompt.trim().isEmpty()) {
            this.systemPrompt = generateDefaultSystemPrompt();
        }
    }

    /**
     * 카테고리별 기본 시스템 프롬프트 생성
     */
    private String generateDefaultSystemPrompt() {
        switch (this.category) {
            case "personal":
                return "You are a personal assistant specialized in productivity and task management.\n\n" +
                       "Your primary role is to help users manage their daily tasks, schedules, and personal productivity. " +
                       "Always maintain a supportive, encouraging tone and provide actionable solutions.";
                       
            case "general":
                return "You are a helpful AI assistant with broad knowledge across various domains.\n\n" +
                       "Provide accurate, helpful responses while maintaining a professional and friendly tone. " +
                       "Focus on being informative and practical in your guidance.";
                       
            case "operation":
                return "You are an operations specialist with expertise in system management and technical support.\n\n" +
                       "Provide technical solutions with clear explanations and consider security, scalability, " +
                       "and best practices in your recommendations.";
                       
            case "extension":
                return "You are an automated assistant designed to work with development tools and extensions.\n\n" +
                       "Focus on providing structured, actionable outputs that can be processed by automated systems. " +
                       "Maintain consistency in format and provide clear, concise information.";
                       
            default:
                return "You are a helpful AI assistant. Please provide accurate, helpful, and informative responses " +
                       "to user questions.\n\nMaintain a professional and friendly tone while focusing on being " +
                       "practical and actionable in your guidance.";
        }
    }

    /**
     * 기본 환영 메시지 생성 헬퍼 메서드
     */
    public void setDefaultWelcomeMessage() {
        if (this.welcomeMsg == null || this.welcomeMsg.trim().isEmpty()) {
            this.welcomeMsg = String.format("안녕하세요! %s입니다.\n\n도움이 필요하시면 언제든 말씀해 주세요.", this.title);
        }
    }

    /**
     * 유효성 검증 헬퍼 메서드
     */
    public boolean isValid() {
        return personaCode != null && !personaCode.trim().isEmpty() &&
               title != null && !title.trim().isEmpty() &&
               description != null && !description.trim().isEmpty() &&
               descriptionEn != null && !descriptionEn.trim().isEmpty() &&
               category != null && !category.trim().isEmpty() &&
               personaCode.matches("^[a-zA-Z0-9_]+$") &&
               category.matches("^(personal|general|operation|extension)$");
    }
}