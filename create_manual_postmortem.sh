#!/bin/bash
set -euo pipefail
TS=$(date +%s)
LOG=".sovereign-postmortem-$TS"
mkdir -p "$LOG"

echo "TIMESTAMP: $(date -Iseconds)" > "$LOG/postmortem.txt"
echo "EXIT_CODE: $?" >> "$LOG/postmortem.txt"
echo "LAST_COMMAND: $BASH_COMMAND" >> "$LOG/postmortem.txt"
echo "LINE_NO: $LINENO" >> "$LOG/postmortem.txt"
echo "PWD: $(pwd)" >> "$LOG/postmortem.txt"
echo "--- GIT STATUS ---" >> "$LOG/postmortem.txt"
git status >> "$LOG/postmortem.txt" 2>&1
echo "--- ENV ---" >> "$LOG/postmortem.txt"
env >> "$LOG/postmortem.txt" 2>&1
echo "--- LAST 50 LINES OF SCRIPT ---" >> "$LOG/postmortem.txt"
tail -50 sovereign-audit-fix.sh >> "$LOG/postmortem.txt" 2>&1

tar -czf "$LOG.tar.gz" "$LOG"
echo "Postmortem: $LOG.tar.gz"
