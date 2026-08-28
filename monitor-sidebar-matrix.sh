#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== System Monitoring: Tracking Decoupled Sidebar Workflows ==="
echo "Fetching the 10 most recent automated engine runs..."
echo "--------------------------------------------------------"

# List out the active runs, sorting by current status and event age
gh run list --limit 10

echo "--------------------------------------------------------"
echo "To deep-dive into the logs of a specific file, execute:"
echo "  gh run view <RUN_ID> --log"
