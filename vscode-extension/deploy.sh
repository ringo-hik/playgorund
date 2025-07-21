#!/bin/bash

echo "========================================"
echo "SWDP ChatOps Extension Deploy Script"
echo "========================================"
echo "This script will: Build → Uninstall → Install"
echo

# Extension 디렉토리로 이동
cd "$(dirname "$0")"

# 1. Build
echo "[STEP 1/3] Building extension..."
./build.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi

echo
echo "[STEP 2/3] Uninstalling previous version..."
./uninstall.sh
if [ $? -ne 0 ]; then
    echo "WARNING: Uninstall had issues, continuing..."
fi

echo
echo "[STEP 3/3] Installing new version..."
./install.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Install failed"
    exit 1
fi

echo
echo "========================================"
echo "Deploy completed successfully!"
echo
echo "Your SWDP ChatOps Extension is ready to use!"
echo "Don't forget to start the backend server:"
echo "  npm run mock:serve"
echo "========================================"