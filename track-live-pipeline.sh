#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

RUN_ID="33208379292"

echo "=== Streaming Live Build Workflow Execution ==="
echo "Press Ctrl+C at any time to exit log stream tracking."
echo "------------------------------------------------"

# Connects directly to the active runner node to dump logs in real-time
gh run watch $RUN_ID

echo "------------------------------------------------"
echo "=== Final Status Breakdown ==="
gh run view $RUN_ID
