# SWDP ChatOps Extension - Build Guide

VSCode Extension의 빌드, 설치, 배포를 위한 자동화 스크립트 모음입니다.

## 📁 스크립트 파일들

### Windows (.bat)
- `build.bat` - Extension 빌드
- `install.bat` - Extension 설치  
- `uninstall.bat` - Extension 언인스톨
- `deploy.bat` - 전체 과정 자동화 (빌드→언인스톨→설치)

### Linux/macOS (.sh)
- `build.sh` - Extension 빌드
- `install.sh` - Extension 설치
- `uninstall.sh` - Extension 언인스톨  
- `deploy.sh` - 전체 과정 자동화

## 🚀 사용 방법

### Windows
```cmd
# 1. 빌드만 하기
build.bat

# 2. 설치만 하기 (빌드 파일 있을 때)
install.bat

# 3. 언인스톨하기
uninstall.bat

# 4. 한 번에 모든 작업 (권장)
deploy.bat
```

### Linux/macOS
```bash
# 실행 권한 부여 (최초 1회만)
chmod +x *.sh

# 1. 빌드만 하기
./build.sh

# 2. 설치만 하기 (빌드 파일 있을 때)
./install.sh

# 3. 언인스톨하기
./uninstall.sh

# 4. 한 번에 모든 작업 (권장)
./deploy.sh
```

## 🔧 각 스크립트 기능

### build.bat/build.sh
1. 기존 .vsix 파일 정리
2. npm 의존성 확인 및 설치
3. vsce package 실행하여 Extension 패키징
4. 빌드 결과 확인

### install.bat/install.sh
1. .vsix 파일 찾기
2. 기존 버전 언인스톨 (있다면)
3. 새 버전 설치
4. 설치 검증

### uninstall.bat/uninstall.sh  
1. Extension 언인스톨
2. 언인스톨 검증

### deploy.bat/deploy.sh
1. build 스크립트 실행
2. uninstall 스크립트 실행  
3. install 스크립트 실행
4. 전체 프로세스 완료 확인

## 📋 사전 요구사항

### 필수 도구
- **Node.js** (v16 이상)
- **npm** 
- **VSCode**
- **vsce** (Visual Studio Code Extension Manager)

### vsce 설치
```bash
npm install -g vsce
```

## ✅ 빌드 성공 확인

빌드가 성공하면 다음 파일이 생성됩니다:
```
swdp-chatops-extension-1.0.0.vsix
```

## 🐛 문제 해결

### "vsce not found" 오류
```bash
npm install -g vsce
```

### "code command not found" 오류  
VSCode의 PATH 설정이 필요합니다:
1. VSCode 열기
2. `Ctrl+Shift+P` → "Shell Command: Install 'code' command in PATH"

### Extension이 Activity Bar에 안 보임
1. VSCode 재시작
2. `View > Extensions`에서 "SWDP ChatOps Extension" 활성화 확인

### 백엔드 연결 오류
백엔드 서버 실행 확인:
```bash
cd ..  # 상위 디렉토리로 이동
npm run mock:serve  # localhost:3004에서 실행
```

## 🔄 개발 워크플로우

1. **코드 수정** - src/ 디렉토리의 파일들 수정
2. **빌드 테스트** - `build.bat` 또는 `./build.sh` 실행
3. **Extension 테스트** - `install.bat` 또는 `./install.sh` 실행  
4. **검증** - VSCode에서 Extension 기능 테스트
5. **재배포** - `deploy.bat` 또는 `./deploy.sh` 실행

## 📝 로그 및 디버깅

### Extension 개발 모드
VSCode에서 `F5` 키를 눌러 Extension Development Host 실행

### 로그 확인
- **Output 패널** → "SWDP ChatOps Extension" 선택
- **Developer Tools** → `Help > Toggle Developer Tools`

## 🎯 배포 체크리스트

- [ ] 코드 수정 완료
- [ ] `package.json` 버전 업데이트
- [ ] 테스트 완료
- [ ] `deploy.bat/.sh` 실행
- [ ] VSCode에서 기능 검증
- [ ] 백엔드 연동 테스트

이제 `deploy.bat` (Windows) 또는 `./deploy.sh` (Linux/macOS)를 실행하면 전체 빌드/배포 과정이 자동화됩니다!