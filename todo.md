# Build Agent VS Code Extension - To-Do List

## TreeView Architecture Diagram

```
📦 Build Agent (ViewContainer)
├───📂 SWDP Build
│   ├───⚙️ Change Project (Button)
│   ├───🏗️ Selected Project: [Project Name]
│   │   ├───📂 Rel Build ▶️
│   │   │   ├───🔄 Workflow
│   │   │   │   ├───✅ Build (완료/대기/진행중)
│   │   │   │   ├───✅ SAM (완료/대기/진행중)
│   │   │   │   ├───✅ Coverity (완료/대기/진행중)
│   │   │   │   ├───✅ DoBEE (완료/대기/진행중)
│   │   │   │   └───✅ OnBoard Test (완료/대기/진행중)
│   │   │   └───⚙️ Configuration Setting (Click to edit .config)
│   │   │   └───📜 History
│   │   │       ├───Build #121 Success (YYYY-MM-DD HH:MM)
│   │   │       └───Build #120 Failed (YYYY-MM-DD HH:MM)
│   │   ├───📂 Layer Build ▶️
│   │   │   ├───🔄 Workflow
│   │   │   │   ├───✅ Build (완료/대기/진행중)
│   │   │   │   ├───✅ SAM (완료/대기/진행중)
│   │   │   │   ├───✅ Coverity (완료/대기/진행중)
│   │   │   │   ├───✅ DoBEE (완료/대기/진행중)
│   │   │   │   └───✅ OnBoard Test (완료/대기/진행중)
│   │   │   └───⚙️ Configuration Setting (Click to edit .config)
│   │   │   └───📜 History
│   │   │       ├───Build #121 Success (YYYY-MM-DD HH:MM)
│   │   │       └───Build #120 Failed (YYYY-MM-DD HH:MM)
│   │   └───📂 Commit Build ▶️
│   │       ├───🔄 Workflow
│   │       │   ├───✅ Build (완료/대기/진행중)
│   │       │   ├───✅ SAM (완료/대기/진행중)
│   │       │   ├───✅ Coverity (완료/대기/진행중)
│   │       │   ├───✅ DoBEE (완료/대기/진행중)
│   │       │   └───✅ OnBoard Test (완료/대기/진행중)
│   │       └───⚙️ Configuration Setting (Click to edit .config)
│   │       └───📜 History
│   │           ├───Build #121 Success (YYYY-MM-DD HH:MM)
│   │           └───Build #120 Failed (YYYY-MM-DD HH:MM)
│   └───🚧 Workflow (In Progress)
│       ├───[Build Type] - [Project Name] (Status)
│       └───...
│
└───📂 PUMBA Remote Build
    ├───▶️ Start Build
    ├───⚙️ Configuration Setting (Click to edit .config)
    ├───📜 Build History
    │   ├───Build #121 Success (YYYY-MM-DD HH:MM)
    │   └───Build #120 Failed (YYYY-MM-DD HH:MM)
    └───🚧 Workflow (In Progress)
        ├───[Build Type] - [Project Name] (Status)
        └───...
```
## 0. 문서 업데이트 
다음 사항을 모두 읽고 코드 베이스 분석 + BUILD_AGENT_ARCHITECTURE.MD를 상세히 파악한 뒤에 
CLAUDE.MD , BUILD_AGENT_ARCHITECTURE.MD를 현재 코드 베이스와 문서 내용에 맞게 모두 업데이트 한다. 
CHECKLIST.MD를 작성하여 최종 완성본을 만들기 위해서 수행해야할 모든 작업을 세분화해서 체크리스트를 구성한다.

## 1. SWDP Build Module

### 1.1 프로젝트 선택 및 변경 기능
*   **트리뷰 상단:** "SWDP Build" 뷰 컨테이너 내에 `⚙️ Change Project (Button)` 항목을 추가하여 현재 선택된 프로젝트를 변경할 수 있도록 합니다.
*   **프로젝트 표시:** `🏗️ Selected Project: [Project Name]` 형태로 현재 선택된 프로젝트를 표시합니다.

### 1.2 빌드 타입별 트리뷰 및 설정 파일 관리
*   선택된 프로젝트 하위에 `📂 Rel Build`, `📂 Layer Build`, `📂 Commit Build` 트리뷰 항목을 추가합니다. 각 항목 옆에는 빌드 시작을 위한 재생 버튼(▶️)이 위치합니다.
*   **설정 파일 경로:** 각 빌드 타입(Rel, Layer, Commit)별 개별 설정 파일 경로를 정의합니다:
    *   `.swdp/{project_name}/rel-build.config`
    *   `.swdp/{project_name}/layer-build.config`
    *   `.swdp/{project_name}/commit-build.config`
*   **설정 파일 동기화:** 프로젝트 선택 시 SWDP API로부터 해당 빌드 타입(REL, LAYER, COMMIT)의 빌드 정보를 요청하고, 전달받은 정보를 해당 JSON 설정 파일에 덮어씁니다. 만약 파일이 이미 존재하면 기존 정보를 유지하면서 새로운 정보를 병합하는 구조로 처리합니다.

### 1.3 빌드 Workflow 하위 트리 (Rel, Layer, Commit Build 공통)
*   각 빌드 타입(Rel, Layer, Commit Build) 하위에 `🔄 Workflow` 트리뷰 항목을 추가합니다.
*   `Workflow` 하위에는 다음 고정 항목을 표시합니다: `✅ Build`, `✅ SAM`, `✅ Coverity`, `✅ DoBEE`, `✅ OnBoard Test`.
*   SWDP API 응답에 따라 `Enable`된 항목만 체크박스(✅) 표기와 함께 표시합니다.
*   각 항목별 상태를 `(완료/대기/진행중)`으로 표시합니다 (SWDP API로부터 전달받은 정보).
*   `⚙️ Configuration Setting` 항목을 추가합니다:
    *   클릭 시 별도 창(에디터)을 띄워 해당 빌드 타입의 `.config` 파일(예: `rel-build.config`) 데이터를 수정/확인 가능하도록 구현합니다.
    *   모든 JSON 항목을 불러와 수정 가능해야 하며, on/off 설정 외에 build option과 같은 텍스트 입력 필드도 지원합니다.

### 1.4 빌드 히스토리 하위 트리 (Rel, Layer, Commit Build 공통)
*   각 빌드 타입(Rel, Layer, Commit Build) 하위에 `📜 History` 트리뷰 항목을 추가합니다.
*   PUMBA Remote Build의 히스토리 구현 형태를 참고하여 표시합니다.
*   빌드 번호와 상태, 완료 시간을 표시합니다: `Build #121 Success (YYYY-MM-DD HH:MM)`.
*   모든 빌드(Build부터 OnBoard Test까지)가 완료된 항목만 History에 표시합니다.
*   SWDP API 호출을 통해 가져온 데이터를 기반으로 구현하며, 표시 방식은 현재 "Last Build" 보여주는 형태와 유사하게 구현합니다.

### 1.5 빌드 진행 중 Workflow
*   `SWDP Build` 뷰 컨테이너 내에 `🚧 Workflow (In Progress)` 섹션을 추가하여 현재 빌드 진행 중인 항목들을 표시합니다.
*   표시 형식: `[Build Type] - [Project Name] (Status)`.

## 2. PUMBA Remote Build Module

### 2.1 간소화된 구성
*   `PUMBA Remote Build` 뷰 컨테이너는 SWDP Build와 유사하게 구성하되, 프로젝트 설정 및 `REL`, `LAYER`, `COMMIT` 빌드 타입 옵션은 제외합니다.
*   다음 항목만 직접 표시합니다: `▶️ Start Build`, `⚙️ Configuration Setting`, `📜 Build History`.
*   `Start Build`는 PUMBA 빌드를 시작하는 버튼입니다.
*   `Configuration Setting`은 PUMBA 빌드 설정을 수정/확인하는 별도 창을 띄웁니다.
*   `Build History`는 PUMBA 빌드의 완료된 히스토리를 표시합니다 (SWDP Build의 History와 유사한 형식).

### 2.2 빌드 진행 중 Workflow
*   `PUMBA Remote Build` 뷰 컨테이너 내에 `🚧 Workflow (In Progress)` 섹션을 추가하여 현재 빌드 진행 중인 항목들을 표시합니다 (SWDP Build와 동일한 형식).

# 임시 CheckList

## 1. SWDP BUILD
- [ ] 프로젝트 선택/변경 버튼 구현
- [ ] Rel·Layer·Commit Build 트리 및 설정 파일 경로 분리
- [ ] SWDP API → 설정 JSON 덮어쓰기 로직
- [ ] Build Configuration(5 항목) 체크박스·상태 표시
- [ ] Configuration Setting 편집 패널
- [ ] Build History(번호·결과·시간) 표시
- [ ] ▶ Start Build + 확인 알림
- [ ] Build In Progress 실시간 표기

## 2. PUMBA REMOTE BUILD
- [ ] Start Build / Configuration Setting / Build History 트리
- [ ] PUMBA 설정 로딩·편집·저장
- [ ] History 완료 빌드 목록 표시

## 3. 공통
- [ ] TreeView 새로고침 시 상태 Polling
- [ ] “Dev Build” → “Layer Build” 명칭 교체
- [ ] Build Agent Help/Info 화면 (이모지 제거)
- [ ] 프로젝트 명 규칙 준수 예시 적용
