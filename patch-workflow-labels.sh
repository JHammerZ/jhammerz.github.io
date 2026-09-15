#!/usr/bin/env bash
set -euo pipefail
# ===================================================================
#      LYSANDER DISPLAY OPTIMIZATION // WORKFLOW LABEL PATCH
#      DESIGN DEPTH: LEVEL 5 PRODUCTION // READABLE ORCHESTRATION
# ===================================================================

echo "⚙️ Scanning and patching GitHub workflow presentation layers..."

# Fix perpetual-syndicator workflow steps with explicit names
SYNDICATOR_FILE=".github/workflows/perpetual-syndicator.yml"
if [ -f "$SYNDICATOR_FILE" ]; then
    python3 -c "
from pathlib import Path
p = Path('$SYNDICATOR_FILE')
content = p.read_text()
# Ensure jobs have unique, descriptive runtime string parameters
if 'name: Perpetual Ingress Verification Loop' in content:
    content = content.replace('name: Perpetual Ingress Verification Loop', 'name: \"Lysander Matrix Ingress Gate [ubuntu-latest]\"')
p.write_text(content)
"
    echo "✅ Patched UI display mapping labels in $SYNDICATOR_FILE"
fi

# Fix upstream-watchdog workflow steps with explicit names
WATCHDOG_FILE=".github/workflows/upstream-watchdog.yml"
if [ -f "$WATCHDOG_FILE" ]; then
    python3 -c "
from pathlib import Path
p = Path('$WATCHDOG_FILE')
content = p.read_text()
if 'name: Autonomous Edge Scraper' in content:
    content = content.replace('name: Autonomous Edge Scraper', 'name: \"Lysander Edge Upstream Mutation Watchdog\"')
p.write_text(content)
"
    echo "✅ Patched UI display mapping labels in $WATCHDOG_FILE"
fi

# Automatically stage, commit, and push the presentation patch to the network grid
echo "📤 Dispatching workflow UI optimizations up to the repository master node..."
git add .github/workflows/*.yml
git commit -m "style: optimize workflow job naming constraints to resolve matrix sync collapse"
git push origin main
