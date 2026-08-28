#!/data/data/com.termux/files/usr/bin/bash

echo "=== System Tracking: Pulling Recent Remote Run Matrix ==="
gh run list --limit 10

echo -e "\n========================================================\n"

echo "=== Auto-Detecting Top Failed Workflow Configuration Error ==="
# Extracts the actual ID of the most recent failed run dynamically
FAILED_RUN_ID=$(gh run list --status failure --limit 1 --json databaseId -q ".[0].databaseId")

if [ -z "$FAILED_RUN_ID" ] || [ "$FAILED_RUN_ID" = "null" ]; then
    echo "No explicit failed runs detected in the global tracking log."
else
    echo "Auditing Live Server Feedback for Run ID: $FAILED_RUN_ID"
    echo "--------------------------------------------------------"
    gh run view $FAILED_RUN_ID
    echo "--------------------------------------------------------"
    echo "=== Topmost Error Snippet Logs ==="
    gh run view $FAILED_RUN_ID --log 2>/dev/null || echo "Parser Error: Pre-processing layout syntax rejection."
fi
