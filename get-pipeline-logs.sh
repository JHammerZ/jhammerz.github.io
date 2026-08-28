#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# Ensure gh cli is present
if ! command -v gh &> /dev/null; then
    echo "Installing gh cli..."
    pkg install -y gh
fi

echo "=== Fetching Latest Workflow Run ID ==="
RUN_ID=$(gh run list --workflow=build-tma-full.yml --limit 1 --json databaseId --jq '.[0].databaseId')

if [ -z "$RUN_ID" ] || [ "$RUN_ID" = "null" ]; then
    echo "No workflow runs found. Make sure gh auth login is complete."
    exit 1
fi

echo "Targeting Run ID: $RUN_ID"
echo "=== Summary Status ==="
gh run view $RUN_ID

echo "=== Pulling Live Compilation Step Logs ==="
gh run view $RUN_ID --log-step="4. Execute Native Verification Engines" 2>/dev/null || gh run view $RUN_ID --log
