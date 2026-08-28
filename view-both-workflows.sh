#!/data/data/com.termux/files/usr/bin/bash

echo "=== VIEWING DEPLOY-WORKER.YML ==="
if [ -f ".github/workflows/deploy-worker.yml" ]; then
    cat .github/workflows/deploy-worker.yml
else
    echo "deploy-worker.yml not found."
fi

echo -e "\n=================================\n"

echo "=== VIEWING HFID-FORENSIC-AUDIT.YML ==="
if [ -f ".github/workflows/hfid-forensic-audit.yml" ]; then
    cat .github/workflows/hfid-forensic-audit.yml
else
    echo "hfid-forensic-audit.yml not found."
fi
