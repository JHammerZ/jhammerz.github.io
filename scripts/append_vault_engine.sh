#!/bin/bash
REPO_DIR="/root/jhammerz.github.io"
LEDGER_FILE="/root/.aure_vault/immutable_ledger.json"

echo -e "  \033[1;34m[*] Bundling Cryptographic State Roots for Upstream GitHub Syndication...\033[0m"

mkdir -p "$REPO_DIR/.well-known"
[[ -f "$LEDGER_FILE" ]] && cp -f "$LEDGER_FILE" "$REPO_DIR/.well-known/vault_ledger.json"

cd "$REPO_DIR"
rm -f .git/index.lock 2>/dev/null

git add .
git commit -m "Aurelius Monolithic Convergence Pass [tx-$(date +%s)]" --quiet 2>/dev/null

# Execute the live force-push command directly to your repository origin branch
git push origin main --force

if [ $? -eq 0 ]; then
    echo -e "  -> \033[1;32m[SUCCESS]\033[0m Repository database fully syndicated across live GitHub Pages cells."
else
    echo -e "  -> \033[1;31m[ERROR]\033[0m Git transmission rejected. Verify your container environment credentials."
fi
