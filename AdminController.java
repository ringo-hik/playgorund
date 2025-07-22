package com.example.chatops.controller;

import com.example.chatops.dto.*;
import com.example.chatops.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * System Admin Controller for ChatOps Persona Management
 * 
 * 이 컨트롤러는 Vue.js SystemAdminPage와 완전히 호환되도록 설계되었습니다.
 * 모든 엔드포인트는 기존 aiChatOpsService.js의 API 호출과 1:1 매칭됩니다.
 */
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * GET /admin/personas-with-prompts
     * 시스템 프롬프트를 포함한 모든 페르소나 목록 조회
     */
    @GetMapping("/personas-with-prompts")
    public ResponseEntity<ApiResponseDto<List<PersonaDto>>> getPersonasWithPrompts() {
        try {
            List<PersonaDto> personas = adminService.getAllPersonasWithPrompts();
            
            return ResponseEntity.ok(ApiResponseDto.<List<PersonaDto>>builder()
                .success(true)
                .data(personas)
                .message("Personas with prompts loaded successfully")
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.<List<PersonaDto>>builder()
                    .success(false)
                    .errorMessage("Failed to load personas: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * POST /admin/personas
     * 새 페르소나 생성
     */
    @PostMapping("/personas")
    public ResponseEntity<ApiResponseDto<PersonaDto>> createPersona(@Valid @RequestBody PersonaDto personaDto) {
        try {
            // 필수 필드 검증
            if (personaDto.getPersonaCode() == null || personaDto.getPersonaCode().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.<PersonaDto>builder()
                        .success(false)
                        .errorMessage("PersonaCode는 필수 입력 항목입니다.")
                        .timestamp(LocalDateTime.now())
                        .build());
            }
            
            // personaCode 패턴 검증 (영문, 숫자, 언더스코어만 허용)
            if (!personaDto.getPersonaCode().matches("^[a-zA-Z0-9_]+$")) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.<PersonaDto>builder()
                        .success(false)
                        .errorMessage("PersonaCode는 영문, 숫자, 언더스코어만 사용 가능합니다.")
                        .timestamp(LocalDateTime.now())
                        .build());
            }
            
            // 중복 검사
            if (adminService.existsByPersonaCode(personaDto.getPersonaCode())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponseDto.<PersonaDto>builder()
                        .success(false)
                        .errorMessage("이미 존재하는 페르소나 코드입니다.")
                        .timestamp(LocalDateTime.now())
                        .build());
            }
            
            PersonaDto createdPersona = adminService.createPersona(personaDto);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.<PersonaDto>builder()
                    .success(true)
                    .data(createdPersona)
                    .message("페르소나가 성공적으로 생성되었습니다.")
                    .timestamp(LocalDateTime.now())
                    .build());
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.<PersonaDto>builder()
                    .success(false)
                    .errorMessage("페르소나 생성 중 오류가 발생했습니다: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * PUT /admin/personas/{personaCode}
     * 기존 페르소나 정보 수정
     */
    @PutMapping("/personas/{personaCode}")
    public ResponseEntity<ApiResponseDto<PersonaDto>> updatePersona(
            @PathVariable String personaCode,
            @Valid @RequestBody PersonaDto personaDto) {
        try {
            // personaCode 일치성 검증
            if (!personaCode.equals(personaDto.getPersonaCode())) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.<PersonaDto>builder()
                        .success(false)
                        .errorMessage("URL의 personaCode와 요청 데이터의 personaCode가 일치하지 않습니다.")
                        .timestamp(LocalDateTime.now())
                        .build());
            }
            
            PersonaDto updatedPersona = adminService.updatePersona(personaDto);
            
            if (updatedPersona == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(ApiResponseDto.<PersonaDto>builder()
                .success(true)
                .data(updatedPersona)
                .message("페르소나가 성공적으로 수정되었습니다.")
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.<PersonaDto>builder()
                    .success(false)
                    .errorMessage("페르소나 수정 중 오류가 발생했습니다: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * DELETE /admin/personas/{personaCode}
     * 페르소나 삭제
     */
    @DeleteMapping("/personas/{personaCode}")
    public ResponseEntity<ApiResponseDto<Void>> deletePersona(@PathVariable String personaCode) {
        try {
            boolean deleted = adminService.deletePersona(personaCode);
            
            if (!deleted) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(ApiResponseDto.<Void>builder()
                .success(true)
                .message("페르소나가 성공적으로 삭제되었습니다.")
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.<Void>builder()
                    .success(false)
                    .errorMessage("페르소나 삭제 중 오류가 발생했습니다: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * POST /admin/system-prompt/test
     * 시스템 프롬프트 테스트 실행
     */
    @PostMapping("/system-prompt/test")
    public ResponseEntity<ApiResponseDto<String>> testSystemPrompt(
            @Valid @RequestBody SystemPromptTestRequestDto testRequest) {
        try {
            String testResult = adminService.testSystemPrompt(
                testRequest.getPromptContent(), 
                testRequest.getTestInput(), 
                testRequest.getPersonaCode()
            );
            
            return ResponseEntity.ok(ApiResponseDto.<String>builder()
                .success(true)
                .data(testResult)
                .message("시스템 프롬프트 테스트가 완료되었습니다.")
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.<String>builder()
                    .success(false)
                    .errorMessage("시스템 프롬프트 테스트 중 오류가 발생했습니다: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * PUT /admin/system-prompt/{personaCode}
     * 특정 페르소나의 시스템 프롬프트 업데이트
     */
    @PutMapping("/system-prompt/{personaCode}")
    public ResponseEntity<ApiResponseDto<PersonaDto>> updateSystemPrompt(
            @PathVariable String personaCode,
            @RequestBody SystemPromptUpdateRequestDto updateRequest) {
        try {
            PersonaDto updatedPersona = adminService.updatePersonaSystemPrompt(
                personaCode, 
                updateRequest.getSystemPrompt()
            );
            
            if (updatedPersona == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(ApiResponseDto.<PersonaDto>builder()
                .success(true)
                .data(updatedPersona)
                .message("시스템 프롬프트가 성공적으로 업데이트되었습니다.")
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.<PersonaDto>builder()
                    .success(false)
                    .errorMessage("시스템 프롬프트 업데이트 중 오류가 발생했습니다: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * GET /admin/categories
     * 사용 가능한 페르소나 카테고리 목록 조회
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponseDto<List<String>>> getCategories() {
        List<String> categories = Arrays.asList("personal", "general", "operation", "extension");
        
        return ResponseEntity.ok(ApiResponseDto.<List<String>>builder()
            .success(true)
            .data(categories)
            .message("카테고리 목록이 조회되었습니다.")
            .timestamp(LocalDateTime.now())
            .build());
    }

    /**
     * GET /admin/health
     * 관리자 시스템 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponseDto<String>> adminHealthCheck() {
        return ResponseEntity.ok(ApiResponseDto.<String>builder()
            .success(true)
            .data("Admin system is running")
            .message("관리자 시스템이 정상적으로 동작 중입니다.")
            .timestamp(LocalDateTime.now())
            .build());
    }
}