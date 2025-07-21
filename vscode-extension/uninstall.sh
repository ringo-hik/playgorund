#!/bin/bash

echo "========================================"
echo "SWDP ChatOps Extension Uninstall Script"
echo "========================================"

# Extension 언인스톨
echo "[1/2] Uninstalling SWDP ChatOps Extension..."
code --uninstall-extension swdp-team.swdp-chatops-extension
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to uninstall extension or extension not found"
    echo
    echo "Available extensions:"
    code --list-extensions | grep "swdp"
    exit 1
fi

# 언인스톨 확인
echo
echo "[2/2] Verifying uninstallation..."
if code --list-extensions | grep -q "swdp-chatops-extension"; then
    echo "WARNING: Extension may still be installed."
    echo "You may need to restart VSCode."
else
    echo "Extension uninstalled successfully!"
fi

echo
echo "========================================"
echo "Uninstallation completed!"
echo "========================================"