#!/bin/sh
# Runs on each sat hourly via cron
NODE_ID="LEO-$(hostname)"
WEB_ROOT="/app/www"  # CHANGE THIS to actual path on your sats
INGEST="https://ingest.jhammerz.github.io"

find $WEB_ROOT -type f \( -name "*.js" -o -name "*.wasm" -o -name "*.mp4" \) | while read f; do
  HASH=$(sha256sum "$f" | cut -d' ' -f1)
  REL=${f#$WEB_ROOT/}
  echo "{\"claim_type\":\"cdn_edge_attest\",\"timestamp\":\"$(date -Iseconds)\",\"details\":{\"file\":\"$REL\",\"sha256\":\"$HASH\",\"node_id\":\"$NODE_ID\"}}"
done | curl -X POST -H "X-Node-ID: $NODE_ID" --data-binary @- $INGEST
