#!/bin/bash
set -euo pipefail
# =====================================================================
#         SOVEREIGN SUBSTRATE // SYSTEM WORKSPACE PRUNING MATRIX
# =====================================================================
echo "=== LYSANDER SUBSURFACE: INITIALIZING COMPONENT PURGE SWEEP ==="

# Locate and recursively delete compiled python byte-code artifacts
echo "[*] Purging toxic compiled binary caches (.pyc / __pycache__)..."
find . -type f -name "*.pyc" -delete
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null

# Remove localized testing debris and directory caches safely
echo "[*] Clearing transient testing debris matrices..."
rm -rf .pytest_cache/ 2>/dev/null

# Clear any lingering uncommitted log structures matching volatile criteria
echo "[*] Evacuating isolated tracking garbage dumps..."
git rm -r --cached $(git check-ignore *) 2>/dev/null

echo "[+] Workspace matrix optimization sweep complete: BALANCED"
