package com.example.chatops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 페이지네이션된 대화 내역 응답 객체
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationPageDto {
    
    private List<ConversationDto> conversations;
    
    private int currentPage;
    
    private int pageSize;
    
    private int totalPages;
    
    private long totalElements;
    
    private boolean first;
    
    private boolean last;
    
    private boolean hasNext;
    
    private boolean hasPrevious;
    
    // 필터 정보
    private String personaCode;
    
    private String userId;
    
    private String startDate;
    
    private String endDate;
}