#!/bin/bash

echo "========================================"
echo "SWDP ChatOps Extension Build Script"
echo "========================================"

# Extension 디렉토리로 이동
cd "$(dirname "$0")"

# 기존 .vsix 파일 삭제
echo "[1/4] Cleaning old builds..."
if ls *.vsix 1> /dev/null 2>&1; then
    rm -f *.vsix
    echo "Old .vsix files removed."
else
    echo "No old .vsix files found."
fi

# npm 의존성 확인 및 설치
echo
echo "[2/4] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
else
    echo "Dependencies already installed."
fi

# Extension 패키징
echo
echo "[3/4] Packaging extension..."
npx vsce package
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to package extension"
    exit 1
fi

# 빌드 완료 확인
echo
echo "[4/4] Build completed successfully!"
for file in *.vsix; do
    if [ -f "$file" ]; then
        echo "Created: $file"
        echo "Size: $(ls -lh "$file" | awk '{print $5}')"
    fi
done

echo
echo "========================================"
echo "Build completed!"
echo "Run './install.sh' to install the extension."
echo "========================================"