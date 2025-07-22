package com.example.chatops.service.impl;

import com.example.chatops.dto.PersonaDto;
import com.example.chatops.service.AdminService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Admin Service Implementation
 * 
 * Mock 데이터를 사용한 AdminService 구현체입니다.
 * 실제 프로덕션 환경에서는 JPA Repository나 외부 API를 사용하여 구현합니다.
 * 
 * 이 구현체는 테스트와 개발 목적으로 메모리 기반 데이터 저장소를 사용합니다.
 */
@Service
public class AdminServiceImpl implements AdminService {

    // 메모리 기반 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
    private final Map<String, PersonaDto> personaStore = new ConcurrentHashMap<>();
    
    // 초기 Mock 데이터 로딩
    public AdminServiceImpl() {
        initializeMockData();
    }

    @Override
    public List<PersonaDto> getAllPersonasWithPrompts() {
        return new ArrayList<>(personaStore.values());
    }

    @Override
    public PersonaDto createPersona(PersonaDto personaDto) {
        // 유효성 검증
        validatePersonaData(personaDto);
        
        // 중복 확인
        if (existsByPersonaCode(personaDto.getPersonaCode())) {
            throw new DuplicatePersonaException("이미 존재하는 페르소나 코드입니다: " + personaDto.getPersonaCode());
        }
        
        // 기본값 설정
        personaDto.setDefaultSystemPrompt();
        personaDto.setDefaultWelcomeMessage();
        personaDto.setCreatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        personaDto.setUpdatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        if (personaDto.getTags() == null) {
            personaDto.setTags(new ArrayList<>());
        }
        
        // 저장
        personaStore.put(personaDto.getPersonaCode(), personaDto);
        
        return personaDto;
    }

    @Override
    public PersonaDto updatePersona(PersonaDto personaDto) {
        if (!existsByPersonaCode(personaDto.getPersonaCode())) {
            return null;
        }
        
        validatePersonaData(personaDto);
        
        PersonaDto existing = personaStore.get(personaDto.getPersonaCode());
        
        // 생성일은 유지하고 수정일만 업데이트
        personaDto.setCreatedDate(existing.getCreatedDate());
        personaDto.setUpdatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        personaStore.put(personaDto.getPersonaCode(), personaDto);
        
        return personaDto;
    }

    @Override
    public boolean deletePersona(String personaCode) {
        return personaStore.remove(personaCode) != null;
    }

    @Override
    public boolean existsByPersonaCode(String personaCode) {
        return personaStore.containsKey(personaCode);
    }

    @Override
    public String testSystemPrompt(String promptContent, String testInput, String personaCode) {
        // Mock AI 응답 생성
        PersonaDto persona = getPersonaByCode(personaCode);
        String personaTitle = persona != null ? persona.getTitle() : personaCode;
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy. M. d. a h:mm:ss"));
        int randomResponseTime = (int) (Math.random() * 500 + 100);
        int estimatedTokens = promptContent.length() / 4;
        
        return String.format("""
            # 🤖 AI 시스템 프롬프트 테스트 결과
            
            ## 📋 테스트 정보
            
            | 항목 | 값 |
            |------|-----|
            | **페르소나** | `%s` |
            | **시스템 프롬프트 길이** | %d자 |
            | **사용자 질문** | "%s" |
            | **테스트 시간** | %s |
            
            ---
            
            ## 💬 AI 응답 내용
            
            안녕하세요! 현재 **테스트 모드**에서 동작하고 있습니다.
            
            입력하신 시스템 프롬프트를 분석하여 다음과 같이 응답드립니다:
            
            ### 사용자 질문에 대한 응답
            
            > **"%s"**
            
            이 질문에 대해 시스템 프롬프트의 지시사항을 따라 응답을 생성했습니다.
            
            ### 🔍 시스템 프롬프트 분석
            
            **주요 특징:**
            - **길이**: %s
            - **복잡도**: %s
            - **구조화 정도**: %s
            
            **프롬프트 내용 미리보기:**
            ```
            %s
            ```
            
            ---
            
            ## ✅ 테스트 결과 요약
            
            - ✅ **프롬프트 로딩**: 성공 (%d자)
            - ✅ **페르소나 식별**: %s
            - ✅ **사용자 입력 처리**: "%s"
            - ✅ **응답 생성**: 완료 (%s)
            - ✅ **마크다운 형식**: 지원됨
            
            ### 📊 성능 지표
            
            - **응답 시간**: ~%dms
            - **토큰 사용량**: ~%d개
            - **처리 상태**: 정상
            
            ---
            
            ## ⚠️ 참고사항
            
            > 🔧 **현재는 Spring Boot Mock 서비스 테스트 모드입니다**
            > 
            > 실제 AI 서비스 연동 시에는:
            > - 시스템 프롬프트가 AI 모델의 동작을 실제로 제어합니다
            > - 더 정교하고 맥락에 맞는 응답을 생성합니다
            > - 실시간 학습 및 개선이 이루어집니다
            
            ### 다음 단계
            1. **프롬프트 최적화**: 더 구체적인 지시사항 추가
            2. **테스트 케이스 확장**: 다양한 질문으로 테스트
            3. **실제 AI 연동**: 프로덕션 환경 배포
            
            ---
            
            *✨ 테스트 완료 시간: %s*
            """,
            personaCode,
            promptContent.length(),
            testInput,
            currentTime,
            testInput,
            getPromptLengthCategory(promptContent.length()),
            getPromptComplexity(promptContent),
            getPromptStructure(promptContent),
            promptContent.length() > 200 ? promptContent.substring(0, 200) + "..." : promptContent,
            promptContent.length(),
            personaCode,
            testInput,
            currentTime,
            randomResponseTime,
            estimatedTokens,
            currentTime
        );
    }

    @Override
    public PersonaDto updatePersonaSystemPrompt(String personaCode, String systemPrompt) {
        PersonaDto persona = personaStore.get(personaCode);
        if (persona == null) {
            return null;
        }
        
        persona.setSystemPrompt(systemPrompt);
        persona.setUpdatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        return persona;
    }

    @Override
    public PersonaDto getPersonaByCode(String personaCode) {
        return personaStore.get(personaCode);
    }

    @Override
    public List<PersonaDto> getPersonasByCategory(String category) {
        return personaStore.values().stream()
            .filter(persona -> category.equals(persona.getCategory()))
            .collect(Collectors.toList());
    }

    @Override
    public List<PersonaDto> getActivePersonas() {
        return personaStore.values().stream()
            .filter(persona -> Boolean.TRUE.equals(persona.getActive()))
            .collect(Collectors.toList());
    }

    @Override
    public List<PersonaDto> searchPersonas(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return personaStore.values().stream()
            .filter(persona -> 
                persona.getTitle().toLowerCase().contains(lowerKeyword) ||
                persona.getDescription().toLowerCase().contains(lowerKeyword) ||
                persona.getPersonaCode().toLowerCase().contains(lowerKeyword)
            )
            .collect(Collectors.toList());
    }

    @Override
    public AdminStatistics getStatistics() {
        return new AdminStatisticsImpl();
    }

    @Override
    public String validateSystemPrompt(String systemPrompt) {
        if (systemPrompt == null || systemPrompt.trim().isEmpty()) {
            return "시스템 프롬프트가 비어있습니다.";
        }
        
        if (systemPrompt.length() < 10) {
            return "시스템 프롬프트가 너무 짧습니다. (최소 10자)";
        }
        
        if (systemPrompt.length() > 10000) {
            return "시스템 프롬프트가 너무 깁니다. (최대 10000자)";
        }
        
        // 추가 검증 로직 (욕설, 부적절한 내용 등)
        // 실제 환경에서는 더 정교한 검증 로직 추가
        
        return ""; // 문제없음
    }

    @Override
    public List<PersonaDto> exportAllPersonas() {
        return new ArrayList<>(personaStore.values());
    }

    @Override
    public String importPersonas(List<PersonaDto> personas) {
        int imported = 0;
        int skipped = 0;
        int errors = 0;
        
        for (PersonaDto persona : personas) {
            try {
                if (existsByPersonaCode(persona.getPersonaCode())) {
                    skipped++;
                } else {
                    createPersona(persona);
                    imported++;
                }
            } catch (Exception e) {
                errors++;
            }
        }
        
        return String.format("가져오기 완료: %d개 성공, %d개 건너뜀, %d개 오류", imported, skipped, errors);
    }

    // 초기 Mock 데이터 설정
    private void initializeMockData() {
        createMockPersona("personal_assistant", "개인 업무 어시스턴트", 
            "개인 업무 및 일정 관리를 도와드립니다.", 
            "Helps with personal tasks and schedule management.", 
            "personal");
            
        createMockPersona("project_manager", "프로젝트 매니저", 
            "프로젝트 관리 및 팀 협업을 지원합니다.", 
            "Supports project management and team collaboration.", 
            "personal");
            
        createMockPersona("hr_specialist", "HR 전문가", 
            "인사 업무 및 직원 관리를 지원합니다.", 
            "Supports HR operations and employee management.", 
            "general");
            
        createMockPersona("system_admin", "시스템 관리자", 
            "시스템 운영 및 관리 업무를 담당합니다.", 
            "Responsible for system operations and management.", 
            "operation");
            
        createMockPersona("developer", "개발자", 
            "소프트웨어 개발 및 기술 지원을 제공합니다.", 
            "Provides software development and technical support.", 
            "operation");
    }

    private void createMockPersona(String code, String title, String desc, String descEn, String category) {
        PersonaDto persona = PersonaDto.builder()
            .personaCode(code)
            .title(title)
            .description(desc)
            .descriptionEn(descEn)
            .category(category)
            .tags(Arrays.asList(category, "mock", "test"))
            .welcomeMsg(String.format("안녕하세요! %s입니다.\n\n도움이 필요하시면 언제든 말씀해 주세요.", title))
            .active(true)
            .createdDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
            .updatedDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
            .build();
            
        persona.setDefaultSystemPrompt();
        personaStore.put(code, persona);
    }

    private void validatePersonaData(PersonaDto personaDto) {
        if (!personaDto.isValid()) {
            throw new InvalidPersonaDataException("유효하지 않은 페르소나 데이터입니다.");
        }
    }

    private String getPromptLengthCategory(int length) {
        if (length < 100) return "짧음 📝";
        if (length < 500) return "보통 📄";
        if (length < 1000) return "길음 📃";
        return "매우 길음 📚";
    }

    private String getPromptComplexity(String prompt) {
        long lineCount = prompt.lines().count();
        if (lineCount < 5) return "단순함 🟢";
        if (lineCount < 15) return "보통 🟡";
        return "복잡함 🔴";
    }

    private String getPromptStructure(String prompt) {
        if (prompt.contains("1.") || prompt.contains("-") || prompt.contains("*")) {
            return "구조화됨 📋";
        }
        return "자유형식 📝";
    }

    // AdminStatistics 구현체
    private class AdminStatisticsImpl implements AdminStatistics {
        @Override
        public int getTotalPersonas() {
            return personaStore.size();
        }

        @Override
        public int getPersonalPersonas() {
            return (int) getPersonasByCategory("personal").size();
        }

        @Override
        public int getGeneralPersonas() {
            return (int) getPersonasByCategory("general").size();
        }

        @Override
        public int getOperationPersonas() {
            return (int) getPersonasByCategory("operation").size();
        }

        @Override
        public int getExtensionPersonas() {
            return (int) getPersonasByCategory("extension").size();
        }

        @Override
        public int getActivePersonas() {
            return getActivePersonas().size();
        }

        @Override
        public int getInactivePersonas() {
            return getTotalPersonas() - getActivePersonas();
        }

        @Override
        public String getLastUpdated() {
            return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
    }
}