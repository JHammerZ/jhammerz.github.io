#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# Install GitHub CLI if missing
if ! command -v gh &> /dev/null; then
    echo "=== Installing GitHub CLI tool ==="
    pkg install -y gh
fi

echo "=== Current GitHub Action Runs ==="
# Pulls the most recent runs for your workflow file
gh run list --workflow=build-tma-full.yml --limit 5
