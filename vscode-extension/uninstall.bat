@echo off
echo ========================================
echo SWDP ChatOps Extension Uninstall Script
echo ========================================

:: Extension 언인스톨
echo [1/2] Uninstalling SWDP ChatOps Extension...
code --uninstall-extension swdp-team.swdp-chatops-extension
if errorlevel 1 (
    echo ERROR: Failed to uninstall extension or extension not found
    echo.
    echo Available extensions:
    code --list-extensions | findstr "swdp"
    pause
    exit /b 1
)

:: 언인스톨 확인
echo.
echo [2/2] Verifying uninstallation...
code --list-extensions | findstr "swdp-chatops-extension" >nul
if errorlevel 1 (
    echo Extension uninstalled successfully!
) else (
    echo WARNING: Extension may still be installed.
    echo You may need to restart VSCode.
)

echo.
echo ========================================
echo Uninstallation completed!
echo ========================================
pause