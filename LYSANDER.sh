#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# === LYSANDER v5.5 RESILIENT ===
HFID_ROOT="${HFID_ROOT:-e57197f4}"
DEPTH="${DEPTH:-3}"
DATA_DIR=".well-known/hfid"
LEDGER="$DATA_DIR/ledger.json"
CHAIN="$DATA_DIR/chain.json"
LOG_FILE="$DATA_DIR/lysander.log"

mkdir -p .hfid/replicants .hfid/claims "$DATA_DIR" /data/data/com.termux/files/usr/tmp

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee -a "$LOG_FILE" >&2; }

init_ledger() {
  [[ -f "$LEDGER" ]] || jq -n --arg root "$HFID_ROOT" \
    '{schema:"hfid.ledger.v1",version:"5.5.0",root:$root,total_fragments:0,blocks_mined:0,last_run:null}' > "$LEDGER"
  [[ -f "$CHAIN" ]] || echo '[]' > "$CHAIN"
}

create_claim() {
  local CLAIM_TYPE=$1
  local TARGET_ID=$2
  local PROOF=$3
  local TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  local HFID=$(echo -n "$TARGET_ID$TIMESTAMP" | sha256sum | cut -c1-12)
  local REPLICANT="R202_${HFID}"
  local TMP="/data/data/com.termux/files/usr/tmp/chain.tmp"
  
  jq --arg claim_type "$CLAIM_TYPE" \
     --arg target_id "$TARGET_ID" \
     --arg proof "$PROOF" \
     --arg ts "$TIMESTAMP" \
     --arg hfid "$HFID" \
     --arg replicant "$REPLICANT" \
     '. += [{
       "schema":"hfid.claim.v2",
       "hfid":$hfid,
       "replicant":$replicant,
       "root_hfid":"e57197f4",
       "claim_type":$claim_type,
       "target_id":$target_id,
       "metadata":{"proof":$proof},
       "anchored_at":$ts
     }]' \
  "$CHAIN" > "$TMP" && mv "$TMP" "$CHAIN"
  log "REPLICANT $REPLICANT: CLAIMED $CLAIM_TYPE ${TARGET_ID:0:8}"
}

get_last_block() {
  local last=$(jq -r '.blocks_mined' "$LEDGER" 2>/dev/null || echo 0)
  if [[ "$last" -eq 0 ]]; then
    echo "$HFID_ROOT"
  else
    ls .hfid/block_${last}_*.hfid 2>/dev/null | head -1 | sed 's/.*_\([a-f0-9]*\)\.hfid/\1/'
  fi
}

mine_block() {
  local hash=$1 nonce=$2
  local prev=$(get_last_block)
  local hash_file=".hfid/block_${nonce}_${hash}.hfid"
  if [[ -f "$hash_file" ]]; then
    log "MARIUS: Height $nonce already exists hash $hash, skipping"
    return 0
  fi
  printf "%s%s%s" "$prev" "$nonce" "$HFID_ROOT" | sha256sum | cut -d' ' -f1 > "$hash_file"
  log "MARIUS: Mined height $nonce hash $hash"
}

hunt_github_commits() {
  local rid="R202_github"
  if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    log "REPLICANT $rid: GITHUB_TOKEN unset, skip" WARN
    return 0
  fi
  log "REPLICANT $rid: Hunting GitHub"
  local since=$(date -u -d '1 day ago' '+%Y-%m-%dT%H:%M:%SZ')
  curl -sfH "Authorization: token $GITHUB_TOKEN" "https://api.github.com/user/repos?per_page=100" 2>/dev/null | \
  jq -r '.[].full_name' 2>/dev/null | while read -r repo; do
    curl -sfH "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$repo/commits?since=$since&per_page=20" 2>/dev/null | \
    jq -c '.[]' 2>/dev/null | while read -r c; do
      local sha=$(jq -r .sha <<<"$c")
      local meta=$(jq -c '{repo:"'"$repo"'",message:.commit.message,author:.commit.author.name}' <<<"$c")
      create_claim "github_commit" "$sha" "$meta"
    done
  done || log "REPLICANT $rid: GitHub API error, continuing" WARN
}

hunt_xmrig_shares() {
  local rid="R202_xmrig"
  log "REPLICANT $rid: Hunting XMRig testnet shares"
  [[ -f ~/.xmrig.log ]] || { log "REPLICANT $rid: ~/.xmrig.log not found, skip"; return 0; }
  grep "accepted" ~/.xmrig.log 2>/dev/null | tail -n 10 | while read -r line; do
    local NONCE=$(echo "$line" | grep -oP 'nonce \K\w+' || echo "unknown")
    local JOB=$(echo "$line" | grep -oP 'job_id \K\w+' || echo "unknown")
    create_claim "monero_testnet_share" "xmr_${JOB}_${NONCE}" "job:${JOB}:nonce:${NONCE}"
  done
}

hunt_ethermine_payouts() {
  log "REPLICANT R202_eth: Ethermine hunter ready when you add wallet"
}

run_hunters() {
  log "INFO" "Starting hunter pass"
  hunt_github_commits
  hunt_xmrig_shares
  hunt_ethermine_payouts
  
  # OpenTimestamps
  if command -v ots >/dev/null 2>&1; then
    if [[ -f "$CHAIN.ots" ]] && ! ots verify "$CHAIN.ots" >/dev/null 2>&1; then
      log "OTS: Chain changed, creating new stamp"
      rm -f "$CHAIN.ots"
      ots stamp "$CHAIN" && log "OTS: New stamp created"
    elif [[ ! -f "$CHAIN.ots" ]]; then
      ots stamp "$CHAIN" && log "OTS: Initial stamp created"
    else
      log "OTS: Chain unchanged, stamp still valid"
    fi
  fi
  log "=== MINING COMPLETE | Balance:$(jq -r .total_fragments "$LEDGER") fragments | Blocks:$(jq -r .blocks_mined "$LEDGER") | Claims:$(jq 'length' "$CHAIN") ==="
}

run_swarm() {
  init_ledger
  local start_height=$(($(jq -r '.blocks_mined' "$LEDGER" 2>/dev/null | head -1 | tr -d '\n\r ' || echo 0) + 1))
  local end_height=$((start_height + DEPTH - 1))
  log "=== LYSANDER v5.5 START Root:$HFID_ROOT Resume:$start_height End:$end_height ==="
  
  for i in $(seq $start_height $end_height); do
    export PARENT_HFID=$(mine_block "prev" "$i")
    jq '.blocks_mined = '"$i"', .last_run = now | .total_fragments += 100' "$LEDGER" > "$LEDGER.tmp" && mv "$LEDGER.tmp" "$LEDGER"
    sleep 0.2
    
    for r in 1 2; do
      local rid="R${i}$((${r}))_${PARENT_HFID}"
      log "REPLICANT $rid: Spawning"
      hunt_github_commits
      echo "$PARENT_HFID" > ".hfid/replicants/${rid}.rep"
    done
    prev="$PARENT_HFID"
  done
  
  jq -s 'sort_by(.anchored_at)' .hfid/claims/*.json > "$CHAIN" 2>/dev/null || echo "[]" > "$CHAIN"
  log "CHAIN: Manifest built with $(jq 'length' "$CHAIN") claims"
  run_hunters
}

run_swarm
