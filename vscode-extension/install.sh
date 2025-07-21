#!/bin/bash

echo "========================================"
echo "SWDP ChatOps Extension Install Script"
echo "========================================"

# Extension 디렉토리로 이동
cd "$(dirname "$0")"

# .vsix 파일 찾기
VSIX_FILE=$(ls *.vsix 2>/dev/null | head -1)

if [ -z "$VSIX_FILE" ]; then
    echo "ERROR: No .vsix file found!"
    echo "Please run './build.sh' first to create the extension package."
    exit 1
fi

echo "Found extension: $VSIX_FILE"

# 기존 extension 언인스톨 (있다면)
echo
echo "[1/3] Uninstalling previous version (if exists)..."
code --uninstall-extension swdp-team.swdp-chatops-extension >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Previous version uninstalled successfully."
else
    echo "No previous version found or failed to uninstall."
fi

# 잠시 대기 (VSCode가 언인스톨을 완료할 시간)
sleep 2

# Extension 설치
echo
echo "[2/3] Installing extension..."
code --install-extension "$VSIX_FILE"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install extension"
    exit 1
fi

# 설치 확인
echo
echo "[3/3] Verifying installation..."
if code --list-extensions | grep -q "swdp-chatops-extension"; then
    echo "Extension installed successfully!"
else
    echo "WARNING: Extension may not be properly installed."
fi

echo
echo "========================================"
echo "Installation completed!"
echo
echo "To use the extension:"
echo "1. Open VSCode"
echo "2. Look for the robot icon in the Activity Bar"
echo "3. Click on 'SWDP ChatOps' to see the tree view"
echo
echo "Make sure your backend server is running:"
echo "  npm run mock:serve"
echo "========================================"