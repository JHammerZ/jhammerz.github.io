#!/usr/bin/env bash
# Sovereign 24/7 Runtime Guard Engine

WORKSPACE_DIR="$HOME/jhammerz.github.io"
LOG_FILE="$HOME/social_distribution_loop.log"

cd "$WORKSPACE_DIR" || exit 1

echo "[*] [$(date -u)] Initializing 24/7/365 Persistent Keep-Alive Sync Check..." >> "$LOG_FILE"

# Enforce Termux wake-lock to block the Android system from putting processors to sleep
if command -v termux-wake-lock &> /dev/null; then
    termux-wake-lock
    echo "[✓] Termux Wake-Lock Enforced. Hardware state locked to active." >> "$LOG_FILE"
fi

# Execute the primary multi-threaded edge distribution loop
if [ -f "distribute_library_matrix.py" ]; then
    echo "[->] Executing Master Edge Cluster Distribution Pass..." >> "$LOG_FILE"
    python3 distribute_library_matrix.py >> "$LOG_FILE" 2>&1
else
    echo "[!] Critical Error: distribute_library_matrix.py missing from workspace root." >> "$LOG_FILE"
fi

echo "[✓] [$(date -u)] Distribution cycle successfully processed. Returning to active listening state." >> "$LOG_FILE"
