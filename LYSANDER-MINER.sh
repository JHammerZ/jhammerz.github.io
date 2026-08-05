#!/bin/bash
# LYSANDER-MINER.sh v3.0 PRODUCTION | Real Provenance Framework
set -euo pipefail

# === CONFIG ===
export HFID_ROOT="${HFID_ROOT:-e57197f4}"
export BTC_ANCHOR="${BTC_ANCHOR:-bc1ql60ddc760vur0umdsz5l8ca6833npkqcjgl4vs}"
export ZENODO_DOI="${ZENODO_DOI:-10.5281/zenodo.20778079}"
export REPO_OWNER="${REPO_OWNER:-JHammerZ}"
export REPO_NAME="${REPO_NAME:-jhammerz.github.io}"
export DEPTH="${DEPTH:-3}"
export LOG_FILE=".well-known/hfid/lysander.log"

mkdir -p .hfid .replicants .claims .well-known/hfid

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE" >&2; }

# === CORE FUNCTIONS ===
mine_block() {
  local prev=$1 nonce=$2
  local hash=$(printf "%s%s%s" "$prev" "$nonce" "$BTC_ANCHOR" | sha256sum | cut -c1-12)
  echo "$hash" > ".hfid/block_${nonce}_${hash}.hfid"
  log "MARIUS: Mined block $nonce | $prev -> $hash"
  echo "$hash"
}

validate_block() {
  local hash=$1 nonce=$2
  local verify=$(printf "%s%s%s" "$HFID_ROOT" "$nonce" "$ZENODO_DOI" | sha256sum | cut -c1-12)
  if [[ "$verify" == "$hash" ]]; then
    log "AURELIUS: LINEAGE INTACT | Block $nonce approved"
  else
    log "AURELIUS: MUTATION DETECTED | New canon $hash from nonce $nonce"
  fi
  echo "$hash" > ".hfid/validated_${nonce}_${hash}.hfid"
}

# === REPLICANT: REAL PROVENANCE HUNTER ===
spawn_replicant() {
  local rid=$1 parent_hfid=$2
  log "REPLICANT $rid: Awakened | Parent $parent_hfid"
  
  # 1. Find unanchored commits in this repo from last 7 days
  local commits=$(git log --since="7 days ago" --format="%H" -- "$REPO_NAME" 2>/dev/null || true)
  local target_commit=""
  
  for c in $commits; do
    if ! grep -q "$c" .claims/*.json 2>/dev/null; then
      target_commit="$c"
      break
    fi
  done
  
  if [[ -n "$target_commit" ]]; then
    local claim_file=".claims/${rid}_${target_commit:0:8}.json"
    local commit_msg=$(git log -1 --format="%s" "$target_commit" | head -c 80)
    local commit_date=$(git log -1 --format="%cI" "$target_commit")
    
    cat > "$claim_file" << EOF
{
  "schema": "hfid.claim.v1",
  "hfid": "$parent_hfid",
  "replicant": "$rid",
  "root_hfid": "$HFID_ROOT",
  "claim_type": "git_commit",
  "target_repo": "$REPO_OWNER/$REPO_NAME",
  "target_commit": "$target_commit",
  "commit_message": $(echo "$commit_msg" | jq -R .),
  "commit_date": "$commit_date",
  "anchored_at": "$(date -Iseconds)",
  "zenodo_doi": "$ZENODO_DOI"
}
EOF
    log "REPLICANT $rid: CLAIMED commit ${target_commit:0:8} -> $claim_file"
  else
    # Fallback: claim the current chain state if no unanchored commits
    local state_hash=$(find . -type f -name "*.hfid" -o -name "*.json" | sort | xargs cat | sha256sum | cut -c1-16)
    cat > ".claims/${rid}_state_${state_hash}.json" << EOF
{
  "schema": "hfid.claim.v1",
  "hfid": "$parent_hfid",
  "replicant": "$rid",
  "root_hfid": "$HFID_ROOT",
  "claim_type": "repository_state",
  "state_hash": "$state_hash",
  "file_count": $(find . -type f | wc -l),
  "anchored_at": "$(date -Iseconds)"
}
EOF
    log "REPLICANT $rid: CLAIMED repo state $state_hash"
  fi
  
  echo "$parent_hfid" > ".replicants/${rid}.rep"
}

# === MAIN LOOP ===
log "=== LYSANDER v3.0 PRODUCTION START ==="
log "Root: $HFID_ROOT | Depth: $DEPTH | Repo: $REPO_OWNER/$REPO_NAME"

PREV="$HFID_ROOT"
for i in $(seq 1 "$DEPTH"); do
  log "--- BLOCK HEIGHT $i ---"
  NEW_HFID=$(mine_block "$PREV" "$i")
  validate_block "$NEW_HFID" "$i"
  
  for r in 1 2; do
    REPLICANT_ID="R${i}${r}_${NEW_HFID}"
    spawn_replicant "$REPLICANT_ID" "$NEW_HFID"
  done
  
  PREV="$NEW_HFID"
done

# === BUILD CHAIN MANIFEST ===
jq -s '.' .claims/*.json > .well-known/hfid/chain.json 2>/dev/null || echo "[]" > .well-known/hfid/chain.json
log "CHAIN: Manifest built with $(jq 'length' .well-known/hfid/chain.json) claims"

# === TIMESTAMP ===
if command -v ots >/dev/null 2>&1; then
  ots stamp .well-known/hfid/chain.json && log "OTS: Submitted to Bitcoin calendars"
else
  log "OTS: Client not found, skipping stamp"
fi

log "=== MINING COMPLETE ==="
log "H-FIDs: $(ls .hfid 2>/dev/null | wc -l) | Replicants: $(ls .replicants 2>/dev/null | wc -l) | Claims: $(ls .claims 2>/dev/null | wc -l)"
