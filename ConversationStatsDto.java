package com.example.chatops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.List;

/**
 * 대화 통계 데이터 전송 객체
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationStatsDto {
    
    // 전체 통계
    private long totalConversations;
    
    private long totalUsers;
    
    private long totalPersonas;
    
    // 기간별 통계
    private double dailyAverage;
    
    private long todayCount;
    
    private long weekCount;
    
    private long monthCount;
    
    // 페르소나별 통계
    private Map<String, PersonaStatsDto> personaStats;
    
    // 시간대별 통계
    private Map<Integer, Long> hourlyDistribution;
    
    // 사용자별 상위 통계
    private List<UserStatsDto> topUsers;
    
    // 응답 시간 통계
    private ResponseTimeStatsDto responseTimeStats;
    
    // 성공률 통계
    private double successRate;
    
    private long successCount;
    
    private long failureCount;
    
    /**
     * 페르소나별 통계 내부 클래스
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonaStatsDto {
        private String personaCode;
        private String title;
        private long totalCount;
        private double dailyAverage;
        private double successRate;
        private double avgResponseTime;
        private long uniqueUsers;
    }
    
    /**
     * 사용자별 통계 내부 클래스
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserStatsDto {
        private String userId;
        private long conversationCount;
        private long uniquePersonas;
        private String mostUsedPersona;
        private String lastActiveDate;
    }
    
    /**
     * 응답 시간 통계 내부 클래스
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResponseTimeStatsDto {
        private double avgResponseTime;
        private double minResponseTime;
        private double maxResponseTime;
        private double medianResponseTime;
        private Map<String, Long> responseTimeRanges; // "0-1s", "1-3s", "3-5s", "5s+" 등
    }
}