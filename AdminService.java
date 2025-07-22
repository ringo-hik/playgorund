package com.example.chatops.service;

import com.example.chatops.dto.PersonaDto;
import java.util.List;

/**
 * Admin Service Interface
 * 
 * System Admin 기능을 위한 비즈니스 로직 인터페이스입니다.
 * 실제 구현체에서는 데이터베이스나 외부 API와 연동하여 기능을 구현합니다.
 * 
 * 이 인터페이스는 AdminController와 1:1 매칭되며,
 * Vue.js SystemAdminPage의 모든 기능을 지원합니다.
 */
public interface AdminService {

    /**
     * 시스템 프롬프트를 포함한 모든 페르소나 조회
     * 
     * @return 시스템 프롬프트가 포함된 페르소나 목록
     */
    List<PersonaDto> getAllPersonasWithPrompts();

    /**
     * 새로운 페르소나 생성
     * 
     * @param personaDto 생성할 페르소나 정보
     * @return 생성된 페르소나 정보
     * @throws IllegalArgumentException 유효하지 않은 데이터인 경우
     * @throws DuplicatePersonaException 이미 존재하는 페르소나 코드인 경우
     */
    PersonaDto createPersona(PersonaDto personaDto);

    /**
     * 기존 페르소나 정보 수정
     * 
     * @param personaDto 수정할 페르소나 정보
     * @return 수정된 페르소나 정보, 없으면 null
     */
    PersonaDto updatePersona(PersonaDto personaDto);

    /**
     * 페르소나 삭제
     * 
     * @param personaCode 삭제할 페르소나 코드
     * @return 삭제 성공 여부
     */
    boolean deletePersona(String personaCode);

    /**
     * 페르소나 코드 중복 확인
     * 
     * @param personaCode 확인할 페르소나 코드
     * @return 중복 여부 (true: 이미 존재, false: 사용 가능)
     */
    boolean existsByPersonaCode(String personaCode);

    /**
     * 시스템 프롬프트 테스트 실행
     * 
     * @param promptContent 테스트할 시스템 프롬프트
     * @param testInput 테스트용 사용자 입력
     * @param personaCode 페르소나 코드
     * @return 테스트 결과 (마크다운 형식)
     */
    String testSystemPrompt(String promptContent, String testInput, String personaCode);

    /**
     * 특정 페르소나의 시스템 프롬프트 업데이트
     * 
     * @param personaCode 페르소나 코드
     * @param systemPrompt 새로운 시스템 프롬프트
     * @return 업데이트된 페르소나 정보, 없으면 null
     */
    PersonaDto updatePersonaSystemPrompt(String personaCode, String systemPrompt);

    /**
     * 페르소나 코드로 페르소나 조회
     * 
     * @param personaCode 페르소나 코드
     * @return 페르소나 정보, 없으면 null
     */
    PersonaDto getPersonaByCode(String personaCode);

    /**
     * 카테고리별 페르소나 조회
     * 
     * @param category 페르소나 카테고리
     * @return 해당 카테고리의 페르소나 목록
     */
    List<PersonaDto> getPersonasByCategory(String category);

    /**
     * 활성 상태 페르소나만 조회
     * 
     * @return 활성 상태인 페르소나 목록
     */
    List<PersonaDto> getActivePersonas();

    /**
     * 페르소나 검색
     * 
     * @param keyword 검색 키워드 (제목, 설명에서 검색)
     * @return 검색 결과 페르소나 목록
     */
    List<PersonaDto> searchPersonas(String keyword);

    /**
     * 시스템 통계 정보 조회
     * 
     * @return 페르소나 개수, 카테고리별 분포 등 통계 정보
     */
    AdminStatistics getStatistics();

    /**
     * 관리자 통계 정보 DTO
     */
    interface AdminStatistics {
        int getTotalPersonas();
        int getPersonalPersonas();
        int getGeneralPersonas();
        int getOperationPersonas();
        int getExtensionPersonas();
        int getActivePersonas();
        int getInactivePersonas();
        String getLastUpdated();
    }

    /**
     * 시스템 프롬프트 검증
     * 
     * @param systemPrompt 검증할 시스템 프롬프트
     * @return 검증 결과 (문제없으면 빈 문자열, 문제있으면 오류 메시지)
     */
    String validateSystemPrompt(String systemPrompt);

    /**
     * 페르소나 데이터 일괄 가져오기 (백업/복원용)
     * 
     * @return 모든 페르소나 데이터
     */
    List<PersonaDto> exportAllPersonas();

    /**
     * 페르소나 데이터 일괄 적용 (백업/복원용)
     * 
     * @param personas 적용할 페르소나 목록
     * @return 처리 결과 요약
     */
    String importPersonas(List<PersonaDto> personas);

    /**
     * 커스텀 예외 클래스들
     */
    class DuplicatePersonaException extends RuntimeException {
        public DuplicatePersonaException(String message) {
            super(message);
        }
    }

    class PersonaNotFoundException extends RuntimeException {
        public PersonaNotFoundException(String message) {
            super(message);
        }
    }

    class InvalidPersonaDataException extends RuntimeException {
        public InvalidPersonaDataException(String message) {
            super(message);
        }
    }
}