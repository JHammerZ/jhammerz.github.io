#!/bin/bash
REPO_DIR="/root/jhammerz.github.io"
LEDGER_FILE="/root/.aure_vault/immutable_ledger.json"

echo -e "\033[1;34m[*] Bundling local state hashes for GitHub Syndication...\033[0m"
mkdir -p "$REPO_DIR/.well-known"
[[ -f "$LEDGER_FILE" ]] && cp -f "$LEDGER_FILE" "$REPO_DIR/.well-known/vault_ledger.json"

cd "$REPO_DIR"
git add .
git commit -m "Aurelius Sovereign State Sync Commit [tx-$(date +%s)]" --quiet 2>/dev/null

# Force-push upstream to blast past tracking conflicts natively
git push origin main --force &>/dev/null
