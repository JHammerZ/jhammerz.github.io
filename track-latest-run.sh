#!/data/data/com.termux/files/usr/bin/bash

echo "=== Fetching Newest Active Build Identity ==="
# Using exact jq query syntax to prevent parse failure
NEW_RUN_ID=$(gh run list --workflow=build-tma-full.yml --limit 1 --json databaseId -q ".[0].databaseId")

if [ -z "$NEW_RUN_ID" ] || [ "$NEW_RUN_ID" = "null" ]; then
    echo "No workflow runs found yet. Let's try grabbing the generic latest run..."
    NEW_RUN_ID=$(gh run list --limit 1 --json databaseId -q ".[0].databaseId")
fi

if [ -z "$NEW_RUN_ID" ] || [ "$NEW_RUN_ID" = "null" ]; then
    echo "Still no workflow runs found. Check 'gh run list' manually."
    exit 1
fi

echo "Connecting directly to live stream for Run ID: $NEW_RUN_ID"
echo "Press Ctrl+C to stop trailing console text output."
echo "------------------------------------------------"

gh run watch $NEW_RUN_ID

echo "------------------------------------------------"
echo "=== Terminal Run Summary ==="
gh run view $NEW_RUN_ID
