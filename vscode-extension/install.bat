@echo off
echo ========================================
echo SWDP ChatOps Extension Install Script
echo ========================================

:: 현재 디렉토리 저장
set CURRENT_DIR=%cd%

:: Extension 디렉토리로 이동
cd /d "%~dp0"

:: .vsix 파일 찾기
set VSIX_FILE=
for %%f in (*.vsix) do set VSIX_FILE=%%f

if "%VSIX_FILE%"=="" (
    echo ERROR: No .vsix file found!
    echo Please run 'build.bat' first to create the extension package.
    pause
    exit /b 1
)

echo Found extension: %VSIX_FILE%

:: 기존 extension 언인스톨 (있다면)
echo.
echo [1/3] Uninstalling previous version (if exists)...
code --uninstall-extension swdp-team.swdp-chatops-extension >nul 2>&1
if errorlevel 1 (
    echo No previous version found or failed to uninstall.
) else (
    echo Previous version uninstalled successfully.
)

:: 잠시 대기 (VSCode가 언인스톨을 완료할 시간)
timeout /t 2 /nobreak >nul

:: Extension 설치
echo.
echo [2/3] Installing extension...
code --install-extension "%VSIX_FILE%"
if errorlevel 1 (
    echo ERROR: Failed to install extension
    pause
    exit /b 1
)

:: 설치 확인
echo.
echo [3/3] Verifying installation...
code --list-extensions | findstr "swdp-chatops-extension" >nul
if errorlevel 1 (
    echo WARNING: Extension may not be properly installed.
) else (
    echo Extension installed successfully!
)

echo.
echo ========================================
echo Installation completed!
echo.
echo To use the extension:
echo 1. Open VSCode
echo 2. Look for the robot icon in the Activity Bar
echo 3. Click on 'SWDP ChatOps' to see the tree view
echo.
echo Make sure your backend server is running:
echo   npm run mock:serve
echo ========================================
pause