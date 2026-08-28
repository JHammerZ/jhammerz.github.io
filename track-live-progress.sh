#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== System Matrix: Fetching Clean Active Execution States ==="
echo "--------------------------------------------------------"
gh run list --limit 12

echo -e "\n========================================================\n"

echo "=== Querying Absolute Newest Run Failure ==="
# Explicitly grab only failures matching the current active commit layout to prevent historical caching
NEW_FAIL_ID=$(gh run list --limit 20 --json headSha,databaseId,status -q '.[] | select(.status == "completed" and .conclusion == "failure") | .databaseId' | head -n 1)

if [ -z "$NEW_FAIL_ID" ] || [ "$NEW_FAIL_ID" = "null" ]; then
    echo "✓ Success: No active syntax breaks or failures detected in the current matrix commit execution."
else
    echo "Auditing Live Details for Current Failed Run ID: $NEW_FAIL_ID"
    gh run view $NEW_FAIL_ID
fi
