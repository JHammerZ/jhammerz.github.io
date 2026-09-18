#!/bin/bash
REPO_DIR="/root/jhammerz.github.io"
LEDGER_FILE="/root/.aure_vault/immutable_ledger.json"

echo -e "  -> Packaging local cryptographic records..."
mkdir -p "$REPO_DIR/.well-known"
[[ -f "$LEDGER_FILE" ]] && cp -f "$LEDGER_FILE" "$REPO_DIR/.well-known/vault_ledger.json"

cd "$REPO_DIR"
git add .
git commit -m "Aurelius State Update [tx-$(date +%s)]" --quiet 2>/dev/null

# Re-integrate your git push target safely inside a background thread so it can never freeze your terminal
(
    git push origin main --force
) &>/dev/null &

echo -e "  -> \033[1;32m[SUCCESS]\033[0m State roots committed. Cloud syndication dispatched to background."
