#!/bin/bash
REPO_DIR="/root/jhammerz.github.io"
LEDGER_FILE="/root/.aure_vault/immutable_ledger.json"

# Move vault copies to tracking folders
mkdir -p "$REPO_DIR/.well-known"
[[ -f "$LEDGER_FILE" ]] && cp -f "$LEDGER_FILE" "$REPO_DIR/.well-known/vault_ledger.json"

cd "$REPO_DIR"
# Force stage ALL local modifications (including llms.txt)
git add .

# Force commit with an automated message parameter to bypass interactive text editors
git commit -m "Aurelius System State Sync Commit Pass [tx-$(date +%s)]" --quiet 2>/dev/null

# Push updates upstream cleanly
git push origin main --force &>/dev/null
