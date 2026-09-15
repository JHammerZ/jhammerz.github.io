#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== Fetching Your True Latest Commit Status ==="
# Get the absolute most recent run ID across the entire repo
TRUE_LATEST_ID=$(gh run list --limit 1 --json databaseId -q "..databaseId")

echo "Targeting Run ID: $TRUE_LATEST_ID"
echo "--------------------------------------------------------"
gh run view $TRUE_LATEST_ID
