@echo off
echo ========================================
echo SWDP ChatOps Extension Deploy Script
echo ========================================
echo This script will: Build → Uninstall → Install
echo.

:: 현재 디렉토리 저장
set CURRENT_DIR=%cd%

:: Extension 디렉토리로 이동
cd /d "%~dp0"

:: 1. Build
echo [STEP 1/3] Building extension...
call build.bat
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [STEP 2/3] Uninstalling previous version...
call uninstall.bat
if errorlevel 1 (
    echo WARNING: Uninstall had issues, continuing...
)

echo.
echo [STEP 3/3] Installing new version...
call install.bat
if errorlevel 1 (
    echo ERROR: Install failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deploy completed successfully!
echo.
echo Your SWDP ChatOps Extension is ready to use!
echo Don't forget to start the backend server:
echo   npm run mock:serve
echo ========================================
pause