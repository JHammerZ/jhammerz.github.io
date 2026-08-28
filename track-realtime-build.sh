#!/data/data/com.termux/files/usr/bin/bash

echo "=== Fetching Actual Latest Runs ==="
gh run list --workflow=build-tma-full.yml --limit 3

# Safely extract the topmost ID from the recent runs list
LATEST_ID=$(gh run list --workflow=build-tma-full.yml --limit 1 --json databaseId -q ".[0].databaseId")

if [ -z "$LATEST_ID" ] || [ "$LATEST_ID" = "null" ]; then
    echo "Could not parse run list. Pulling generic last run..."
    LATEST_ID=$(gh run list --limit 1 --json databaseId -q ".[0].databaseId")
fi

echo "------------------------------------------------"
echo "Targeting Run ID: $LATEST_ID"
echo "=== Actively Watching Runner Streams ==="

gh run watch $LATEST_ID

echo "------------------------------------------------"
echo "=== Final Run Verification ==="
gh run view $LATEST_ID
