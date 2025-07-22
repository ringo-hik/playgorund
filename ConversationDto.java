package com.example.chatops.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 대화 내역 데이터 전송 객체
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDto {
    
    private Long id;
    
    private String personaCode;
    
    private String userQuery;
    
    private String aiResponse;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;
    
    private String userId;
    
    private String sessionId;
    
    private Integer responseTime; // milliseconds
    
    private Boolean success;
    
    private String errorMessage;
    
    // 통계용 계산 필드
    private Integer queryLength;
    
    private Integer responseLength;
}