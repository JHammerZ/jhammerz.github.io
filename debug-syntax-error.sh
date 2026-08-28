#!/data/data/com.termux/files/usr/bin/bash

# Target the absolute newest failed run from your dashboard
LATEST_FAILED_ID=$(gh run list --workflow=build-tma-full.yml --status failure --limit 1 --json databaseId -q "..databaseId")

if [ -z "$LATEST_FAILED_ID" ] || [ "$LATEST_FAILED_ID" = "null" ]; then
    echo "Pulling latest generic run failure..."
    LATEST_FAILED_ID=$(gh run list --status failure --limit 1 --json databaseId -q "..databaseId")
fi

echo "=== System Log Audit: Run ID $LATEST_FAILED_ID ==="
echo "--------------------------------------------------------"
gh run view $LATEST_FAILED_ID
echo "--------------------------------------------------------"
echo "=== Fetching Raw Error Output ==="
gh run view $LATEST_FAILED_ID --log | grep -i -E "error|yaml|parser|syntax" | head -n 20
