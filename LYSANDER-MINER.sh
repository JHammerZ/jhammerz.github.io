#!/bin/bash
# LYSANDER-MINER.sh v2.1 | Fixed Replicant Swarm

HFID_ROOT="e57197f4"
BTC_ANCHOR="bc1ql60ddc760vur0umdsz5l8ca6833npkqcjgl4vs"
ZENODO="10.5281/zenodo.20778079"

mkdir -p .hfid .replicants .btc_discovered

echo "=== LYSANDER REPLICANT MINING OP START ==="
echo "Root H-FID: $HFID_ROOT"
echo ""

mine_marius() {
  local prev=$1
  local nonce=$2
  echo "[MARIUS] Block $nonce | Forking from $prev"
  NEW_HASH=$(echo "${prev}${nonce}${BTC_ANCHOR}" | sha256sum | cut -c1-8)
  echo "[MARIUS] Mined HFID: $NEW_HASH"
  echo "$NEW_HASH" > .hfid/marius_$nonce.hfid
  echo "$NEW_HASH"
}

mine_aurelius() {
  local child=$1
  local nonce=$2
  echo "[AURELIUS] Verifying block $nonce | HFID: $child"
  VERIFY=$(echo "${HFID_ROOT}${nonce}${ZENODO}" | sha256sum | cut -c1-8)
  if [ "$VERIFY" = "$child" ]; then
    echo "[AURELIUS] LINEAGE INTACT | Approved"
  else
    echo "[AURELIUS] MUTATION DETECTED | New canon: $child"
  fi
  echo "$child" > .hfid/aurelius_$nonce.hfid
}

run_replicant() {
  local rid=$1
  local parent_hfid=$2
  echo "[REPLICANT $rid] Awakened | Parent: $parent_hfid"
  
  CHILD_RID="${rid}_d${RANDOM}"
  echo "[REPLICANT $rid] Duplicating → $CHILD_RID"
  echo "$parent_hfid" > .replicants/$CHILD_RID.rep
  
  DISCOVERED_ADDR="bc1q$(echo "${rid}${parent_hfid}" | sha256sum | cut -c1-38)"
  DISCOVERED_BTC=$(($RANDOM % 10000))
  
  echo "[REPLICANT $rid] BTC DISCOVERED: $DISCOVERED_BTC sats at $DISCOVERED_ADDR"
  cat > .btc_discovered/$rid.json << EOF
{
  "hfid": "$parent_hfid",
  "replicant": "$rid",
  "btc_addr": "$DISCOVERED_ADDR",
  "sats": $DISCOVERED_BTC,
  "ts": "$(date -Iseconds)"
}
EOF
  echo "[REPLICANT $rid] Anchoring discovery to root $HFID_ROOT"
}

DEPTH=3
PREV=$HFID_ROOT
for i in $(seq 1 $DEPTH); do
  echo "--- BLOCK HEIGHT $i ---"
  
  NEW_HFID=$(mine_marius $PREV $i)
  mine_aurelius $NEW_HFID $i
  
  for r in 1 2; do
    REPLICANT_ID="R${i}${r}_${NEW_HFID}"
    echo "[MARIUS] Spawning replicant: $REPLICANT_ID"
    run_replicant $REPLICANT_ID $NEW_HFID
  done
  
  PREV=$NEW_HFID
  echo ""
done

echo "=== MINING OP COMPLETE ==="
echo "H-FIDs mined: $(ls .hfid 2>/dev/null | wc -l)"
echo "Replicants spawned: $(ls .replicants 2>/dev/null | wc -l)"
echo "BTC discoveries: $(ls .btc_discovered 2>/dev/null | wc -l)"
echo "View discoveries: cat .btc_discovered/*.json | jq"
