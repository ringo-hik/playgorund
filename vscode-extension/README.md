# SWDP ChatOps Extension

VSCode extension for SWDP ChatOps integration with one-click automation.

## Features

- **주간보고 자동 생성**: Git 사용자 정보를 기반으로 주간보고서를 자동으로 생성합니다.
- **실시간 피드백**: 생성된 보고서에 피드백을 제공하여 내용을 개선할 수 있습니다.
- **자동 저장**: 보고서를 `swdp_chatops/weekly_report` 디렉토리에 자동으로 저장합니다.
- **미니멀한 UI**: 트리뷰 기반의 직관적인 인터페이스를 제공합니다.

## Installation

1. VSCode를 실행합니다.
2. Extensions view를 엽니다 (`Ctrl+Shift+X`).
3. "SWDP ChatOps Extension"을 검색합니다.
4. Install 버튼을 클릭합니다.

## Usage

### 주간보고 생성

1. Activity Bar에서 SWDP ChatOps 아이콘을 클릭합니다.
2. **Reports** > **주간보고 생성하기**를 클릭합니다.
3. 자동으로 주간보고서가 생성되고 새 에디터 탭에서 열립니다.

### 피드백 제공

1. 주간보고서를 생성한 후, **피드백 입력**을 클릭합니다.
2. 입력창에 개선 사항이나 추가할 내용을 입력합니다.
3. Enter를 누르면 피드백이 반영된 새로운 보고서가 생성됩니다.

### 보고서 저장

1. **리포트 저장**을 클릭합니다.
2. 보고서가 `swdp_chatops/weekly_report/weekly_report_YYMMDD.md` 형식으로 저장됩니다.
3. 저장된 파일이 자동으로 에디터에서 열립니다.

## Configuration

### API 엔드포인트

Extension은 기본적으로 `https://localhost:443/devportal`에 연결합니다.

### Git 설정 요구사항

이 Extension을 사용하기 위해서는 Git이 올바르게 구성되어 있어야 합니다:

```bash
git config user.email "your.email@company.com"
git config user.name "Your Name"
```

사용자 ID는 이메일 주소의 `@` 앞부분에서 자동으로 추출됩니다.

## Troubleshooting

### "No git email found" 오류

Git 이메일이 설정되지 않은 경우 발생합니다:

```bash
git config --global user.email "your.email@company.com"
```

### "Network error" 오류

API 서버에 연결할 수 없는 경우 발생합니다. 다음을 확인하세요:

1. 백엔드 서버가 실행 중인지 확인
2. `https://localhost:443/devportal` 엔드포인트가 접근 가능한지 확인
3. 방화벽 설정 확인

### "No workspace folder found" 오류

VSCode에서 폴더나 워크스페이스를 열지 않은 경우 발생합니다:

1. `File > Open Folder`를 사용하여 프로젝트 폴더를 엽니다.
2. Extension을 다시 실행합니다.

## File Structure

Extension이 생성하는 파일들:

```
your-workspace/
├── swdp_chatops/
│   └── weekly_report/
│       ├── weekly_report_250721.md
│       ├── weekly_report_250714.md
│       └── ...
```

## Development

### Local Development

1. 이 레포지토리를 클론합니다.
2. `npm install`을 실행합니다.
3. VSCode에서 `F5`를 누르면 Extension Development Host가 실행됩니다.

### Dependencies

- axios: HTTP 클라이언트
- vscode: VSCode Extension API

## License

MIT License

## Support

문제가 발생하거나 기능 요청이 있는 경우 이슈를 생성해 주세요.