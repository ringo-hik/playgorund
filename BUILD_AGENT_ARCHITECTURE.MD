# **Build Agent VS Code Extension – 통합 설계·아키텍처 문서**

*(아이콘 전부 **VS Code Codicon**, 모듈-구조 섹션은 사용자 요청에 따라 비워 둠)*

---

## 1  문서 목적

* **SSoT** (단일 진실 소스) – SWDP 공식 빌드와 PUMBA 원격 빌드를 VS Code 내에서 통합·관리하기 위한 전체 설계 기준을 정의한다.
* **유지보수 근거** – SWDP Core(Spring 2.0) API 수정·확장 시 따라야 할 명확한 인터페이스·데이터 규칙을 제시한다.
* **확장 로드맵 기반** – JIRA·Bitbucket 등 추가 모듈을 동일 패턴으로 부착할 수 있게 한다.

---

## 2  최종 TreeView 구조 (복사-붙여넣기 용)

```
$(package) Build Agent (ViewContainer)
├─ $(folder) SWDP Build
│  ├─ $(gear) Change Project
│  ├─ $(project) Selected Project: <MyProject>
│  │
│  │  ├─ $(folder) Rel Build [$(play)]
│  │  │  ├─ $(sync) Workflow
│  │  │  │   ├─ $(check) Build
│  │  │  │   ├─ $(check) SAM
│  │  │  │   ├─ $(check) Coverity
│  │  │  │   ├─ $(check) DoBEE
│  │  │  │   └─ $(check) OnBoard Test
│  │  │  ├─ $(gear) Configuration Setting   (.swdp/<proj>/rel-build.config)
│  │  │  └─ $(history) History
│  │  │      ├─ #121 $(check) Success (2025-07-10 12:34)
│  │  │      └─ #120 $(circle-slash) Failed (2025-07-10 11:22)
│  │  ├─ $(folder) Layer Build [$(play)]   …(구조 동일)
│  │  └─ $(folder) Commit Build [$(play)]  …(구조 동일)
│  │
│  └─ $(watch) Workflow (In Progress)
│       ├─ Rel Build – MyProject      ($(sync~spin))
│       └─ Commit Build – OtherProj   ($(sync~spin))
└─ $(folder) PUMBA Remote Build
    ├─ $(play) Start Build
    ├─ $(gear) Configuration Setting        (.pumba-config.json)
    ├─ $(history) Build History
    │    ├─ #41 $(check) Success (2025-07-09 18:20)
    │    └─ #40 $(circle-slash) Failed  (2025-07-09 17:03)
    └─ $(watch) Workflow (In Progress)
         └─ PUMBA Build – workspace.zip ($(sync~spin))
```

> **상태 아이콘**
>
> * 진행 중 `$(sync~spin)`   성공 `$(check)`   실패 `$(circle-slash)`

---

## 3  시스템 컨텍스트 및 데이터 흐름

```
┌────────────────────────────┐
│       VS Code IDE          │
│  ┌──────────────────────┐  │
│  │  Build Agent Ext.    │  │
│  └───┬────────┬─────────┘  │
└──────│REST/HTTP│ZIP+REST───┘
       ▼         ▼
┌────────────────────────────┐
│     SWDP Core (Spring2)    │
│  • /project/*              │
│  • /build/*                │
│  • /pumba/*                │
└───┬────────┬───────────────┘
    │Build   │PUMBA
    ▼        ▼
 ┌────────┐ ┌────────┐
 │Bamboo  │ │Bamboo  │
 └────────┘ └────────┘
```

* **단일 진입점** : 확장은 SWDP Core REST API만 호출
* Bamboo 실시간 로그 X → 빌드 상태 Polling
* 내부망 토큰 / HTTP 통신 (HTTPS 가능)

---

## 4  SWDP Build 모듈 요구사항

| 영역              | 구현 세부                                                                                    | API                         |
| --------------- | ---------------------------------------------------------------------------------------- | --------------------------- |
| **프로젝트 선택**     | `Change Project` → `/project/list` QuickPick, 선택 후 *Selected Project* 노드 업데이트            | GET `/project/list`         |
| **빌드 노드**       | Rel/Layer/Commit 노드에 `$(play)` 버튼. 클릭 → `/build` POST                                    | POST `/build`               |
| **설정 파일**       | `.swdp/{project}/rel-build.config` 등 타입별 분리 저장                                           | –                           |
| **설정 동기화**      | 프로젝트 변경 시 `/project/{id}/defaultOptions` & `/build/info/{type}` → 기존 JSON과 **딥 병합** 후 저장 | GET 두 종류                    |
| **Workflow 표시** | `/build/info/{type}` 의 `enabledSteps` 만 TreeView 노출 + 상태값 매핑                             | GET `/build/info/{type}`    |
| **Config 편집**   | `Configuration Setting` 노드 클릭 → JSON 에디터로 열어 전체 필드 수정                                    | 로컬 파일 I/O                   |
| **History**     | `/build/history/{type}` 성공/실패 완료건만, 최신 100개 표시                                           | GET `/build/history/{type}` |
| **진행중 리스트**     | `/build/status?state=RUNNING` Polling → *Workflow (In Progress)* 섹션 실시간 갱신               | GET `/build/status`         |

---

## 5  PUMBA Remote Build 모듈 요구사항

| 영역              | 구현 세부                                                               | API                  |
| --------------- | ------------------------------------------------------------------- | -------------------- |
| **Start Build** | `$(play)` → `zipWorkspace()` → `/pumba/build` POST                  | POST `/pumba/build`  |
| **설정 편집**       | `.pumba-config.json` JSON 에디터 열기/저장                                 | –                    |
| **History**     | `/pumba/history` 성공/실패 완료건 표시                                       | GET `/pumba/history` |
| **진행중 리스트**     | `/pumba/status?state=RUNNING` Polling → *Workflow (In Progress)* 갱신 | GET `/pumba/status`  |

---

## 6  REST API 계약

| Endpoint                       | Method | Path/Body 예시                      | 응답 키 요약                          |
| ------------------------------ | ------ | --------------------------------- | -------------------------------- |
| `/project/list`                | GET    | –                                 | `[ {id,name} ]`                  |
| `/project/{id}/defaultOptions` | GET    | `{id}`                            | `options`                        |
| `/build/info/{type}`           | GET    | `{type}`                          | `enabledSteps`, `defaultOptions` |
| `/build`                       | POST   | `{projectId,branch,type,options}` | `{buildId}`                      |
| `/build/status/{id}`           | GET    | `{id}`                            | `{status}`                       |
| `/build/history/{type}`        | GET    | `{type}`                          | `[ {id,status,endedAt} ]`        |
| `/pumba/build`                 | POST   | multipart(zipFile, options)       | `{pumbaId}`                      |
| `/pumba/status/{id}`           | GET    | `{id}`                            | `{status}`                       |
| `/pumba/history`               | GET    | –                                 | `[ {id,status,endedAt} ]`        |

*상태 값 → TreeView*
`RUNNING` → `$(sync~spin)`  | `SUCCESS` → `$(check)`  | `FAILED` → `$(circle-slash)`

---

## 7  비기능·성능 요구

| 분류      | 세부 기준                                                        |
| ------- | ------------------------------------------------------------ |
| **성능**  | ZIP 압축 + API 응답 60 초 이내 (중간 프로젝트 규모)                         |
| **보안**  | 파일경로·로그 익명화, 내부망 토큰 헤더                                       |
| **사용성** | VS Code 기본 단축키·Codicon에 맞춘 미니멀 UI                            |
| **확장성** | `features/` 하위 폴더 = 모듈 1 개 원칙                                |
| **배포**  | `vsce package` → offline .vsix ⇒ 내부 플러그인 저장소                 |
| **테스트** | Mocha unit, Nock integration, Playwright E2E, Benchmark perf |

---

## 8  테스트 매트릭스

| 테스트         | 커버범위                             | 도구            |
| ----------- | -------------------------------- | ------------- |
| Unit        | API 클라이언트, ConfigService, Zip 유틸 | Mocha + Chai  |
| Integration | VSIX ↔ SWDP Mock 서버              | Nock          |
| E2E         | 실제 SWDP Dev 서버 ↔ VS Code         | Playwright    |
| Performance | ZIP 생성·업로드, Poll 주기              | Benchmark.js  |
| Regression  | JIRA/Bitbucket 모듈 추가 전후          | Jest Snapshot |

---

## 9  배포 및 운영 플로우

1. **Build** : `npm ci && npm run compile`
2. **Package** : `vsce package` → `build-agent-x.y.z.vsix`
3. **배포**  : 내부 플러그인 저장소 업로드 또는 파일 서버
4. **설치**  : `code --install-extension build-agent-x.y.z.vsix`
5. **모니터링** : Extension Output Channel 로그 + SWDP Core 로그 대조

---

## 10  향후 로드맵

| 버전   | 모듈               | 주요 작업                 |
| ---- | ---------------- | --------------------- |
| v1.1 | JIRA Integration | 이슈 조회·생성, 빌드 결과 연동    |
| v1.2 | Bitbucket PR     | PR 목록·상태, 코드 리뷰       |
| v2.x | TR 관리            | SWDP API 확장 후 통합      |
| v2.x | 빌드 로그 Webview    | Bamboo 로그 API 지원 시 도입 |

---

## 11  위험 및 완화책

| 위험              | 영향             | 대응                                  |
| --------------- | -------------- | ----------------------------------- |
| Bamboo API 미제공  | 실시간 로그 불가      | 배지 + Polling 유지, Webview 전환은 v2.x   |
| 대용량 ZIP 전송 지연   | 타임아웃           | Streaming 업로드, 서버 타임아웃 120 s 확보     |
| VS Code API 변경  | TreeView 호환 이슈 | 최소 지원 v1.80 고정, CI 에서 insider 빌드 검증 |
| SWDP Core 계약 변경 | 빌드 실패          | Swagger 계약 검증 + Contract Test 파이프라인 |

---

## 12  모듈 구조

*(사용자 요청에 따라 비워 둔다 — 필요 시 추가 지시 요망)*

---

**완료.** 복사·활용에 필요한 모든 정보가 한 문서에 정리되었습니다. 추가 수정 사항이 있으면 구체적으로 알려주세요.
