# SWDP ChatOps Extension Setup

## 🚀 빠른 실행 가이드

### 1. 개발 환경 설정
```bash
npm install
```

### 2. 확장 컴파일
```bash
npm run compile
```

### 3. 확장 패키징
```bash
npx vsce package
```

### 4. 확장 설치
```bash
code --install-extension swdp-chatops-extension-1.0.0.vsix --force
```

## 🔧 문제 해결

### 확장이 활성화되지 않는 경우
1. VSCode를 완전히 재시작
2. 개발자 도구에서 콘솔 확인 (`Help > Toggle Developer Tools`)
3. 출력 패널에서 "SWDP ChatOps" 로그 확인

### 명령어가 작동하지 않는 경우
1. 명령 팔레트에서 "SWDP ChatOps" 검색
2. 확장이 활성화되었는지 확인
3. 로그 출력 확인

### 트리뷰가 표시되지 않는 경우
1. 왼쪽 Activity Bar에서 SWDP ChatOps 아이콘 클릭
2. 확장 재로드: `Ctrl+Shift+P` → "Developer: Reload Window"

## 📝 디버깅

### 디버그 메시지 확인
- 확장 활성화 시 정보 메시지가 표시됩니다
- 출력 패널에서 로그를 확인할 수 있습니다
- 개발자 도구 콘솔에서 추가 로그 확인 가능

### 개발 모드 실행
1. VSCode에서 이 폴더 열기
2. `F5` 키 또는 `Run > Start Debugging`
3. 새 Extension Development Host 창에서 테스트

## ✅ 정상 작동 확인 사항

- [ ] 확장 설치 성공
- [ ] VSCode 재시작 후 활성화 메시지 표시
- [ ] 왼쪽 Activity Bar에 SWDP ChatOps 아이콘 표시
- [ ] 트리뷰에서 "Weekly Reports" 항목 표시
- [ ] "Process Weekly Report" 명령어 실행 가능
- [ ] "Check Authentication" 명령어 실행 가능
- [ ] Refresh 버튼 작동

## 🔄 빌드 자동화

### Windows
```bash
build.bat
```

### Unix/Linux/macOS
```bash
./build.sh
```

## 📋 주요 파일

- `src/extension.js` - 메인 확장 코드
- `src/chatOpsTreeProvider.js` - 트리뷰 프로바이더
- `src/apiService.js` - API 서비스
- `src/gitUtils.js` - Git 유틸리티
- `package.json` - 확장 매니페스트
- `webpack.config.js` - 빌드 설정