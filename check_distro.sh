#!/bin/bash
set -euo pipefail
# ZVD_v1.3 :: Sovereign Distribution Health Check

echo "=== JHammerZ Sovereign Distribution Audit ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

echo "[1] CANNON V4.2 STATUS"
grep -E "system_state|monitor_status|hash_chain_tip".well-known/cannon.json
echo ""

echo "[2] LAST 5 AUTO-LOG COMMITS"
git log --oneline --grep="Auto-log:" --grep="hfid:" -5
echo ""

echo "[3] INGEST ENGINE"
grep -c "jhammerz-think" tools/cannon.py && echo "jhammerz-think: FOUND" || echo "jhammerz-think: MISSING"
grep -c "N09 AUDIT LOOP" tools/cannon.py && echo "N09 AUDIT LOOP: FOUND" || echo "N09 AUDIT LOOP: MISSING"
grep -c "fetch_state()" tools/cannon.py && echo "fetch_state(): FOUND" || echo "fetch_state(): MISSING"
echo ""

echo "[4] HASH CHAIN"
TIP=$(jq -r.hash_chain_tip.well-known/cannon.json 2>/dev/null || grep hash_chain_tip.well-known/cannon.json | cut -d'"' -f4)
HEAD=$(git rev-parse HEAD)
echo "Current tip: $TIP"
echo "Last commit: $HEAD"
[[ "$TIP" == "$HEAD" ]] && echo "CHAIN: INTACT" || echo "CHAIN: DRIFT DETECTED"
echo ""

echo "[5] SINGLE POINT OF TRUTH"
curl -sI https://jhammerz.github.io | head -n 1
echo ""

echo "[6] ANTI-DECAY"
echo "Last rotate: $(git log --oneline --grep="chore: rotate" -1)"
LAST_AUTO=$(git log -1 --grep="Auto-log:" --format=%ct)
NOW=$(date +%s)
echo "Minutes since Auto-log: $(( ($NOW - $LAST_AUTO) / 60 ))"
echo ""

echo "=== VERDICT ==="
if [[ $(grep "AUTONOMOUS_BROADCAST".well-known/cannon.json) ]] && [[ $(( ($NOW - $LAST_AUTO) / 60 )) -lt 120 ]]; then
  echo "DISTRIBUTION: ARMED"
else
  echo "DISTRIBUTION: CHECK REQUIRED"
fi
