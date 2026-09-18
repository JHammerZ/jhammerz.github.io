#!/bin/bash
REPO_DIR="/root/jhammerz.github.io"
LEDGER_FILE="/root/.aure_vault/immutable_ledger.json"

echo -e "  \033[1;34m[*] Initializing Outbound Git Handshake with Remote GitHub Pages Repo...\033[0m"

mkdir -p "$REPO_DIR/.well-known"
[[ -f "$LEDGER_FILE" ]] && cp -f "$LEDGER_FILE" "$REPO_DIR/.well-known/vault_ledger.json"

cd "$REPO_DIR"
# Erase old lock structures that cause system collisions
rm -f .git/index.lock 2>/dev/null

git add .
git commit -m "Aurelius Core Synchronization Pass [tx-$(date +%s)]" --quiet 2>/dev/null

# Execute the live force-push command directly to your repository main target branch
git push origin main --force

if [ $? -eq 0 ]; then
    echo -e "  -> \033[1;32m[SUCCESS]\033[0m State assets syndicated globally across GitHub Pages CDN."
else
    echo -e "  -> \033[1;31m[ERROR]\033[0m Git transmission rejected. Verify your GitHub Personal Access Token settings."
fi
