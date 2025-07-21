@echo off
echo ========================================
echo SWDP ChatOps Extension Build Script
echo ========================================

:: 현재 디렉토리 저장
set CURRENT_DIR=%cd%

:: Extension 디렉토리로 이동
cd /d "%~dp0"

:: 기존 .vsix 파일 삭제
echo [1/4] Cleaning old builds...
if exist "*.vsix" (
    del /q "*.vsix"
    echo Old .vsix files removed.
) else (
    echo No old .vsix files found.
)

:: npm 의존성 확인 및 설치
echo.
echo [2/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

:: Extension 패키징
echo.
echo [3/4] Packaging extension...
npx vsce package
if errorlevel 1 (
    echo ERROR: Failed to package extension
    pause
    exit /b 1
)

:: 빌드 완료 확인
echo.
echo [4/4] Build completed successfully!
for %%f in (*.vsix) do (
    echo Created: %%f
    echo Size: 
    dir "%%f" | find "%%f"
)

echo.
echo ========================================
echo Build completed! 
echo Run 'install.bat' to install the extension.
echo ========================================
pause