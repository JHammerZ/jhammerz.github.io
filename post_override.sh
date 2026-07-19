#!/usr/bin/env bash
set -euo pipefail
echo "[$(date -Iseconds)] Logging Crown override..."

curl -X POST "https://jhammerz.github.io/ingest/override" \
  --proto "=https" \
  --tlsv1.3 \
  --fail-with-body \
  --silent \
  --show-error \
  --retry 3 \
  --retry-delay 2 \
  --max-time 10 \
  -H "Authorization: Bearer ${API_INGEST_TOKEN:-}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "X-Request-ID: $(uuidgen 2>/dev/null || date +%s%N)" \
  -d @crown_override.json \
  -o override_response.json || { echo "CRITICAL: Override log failed." >&2; exit 1; }

echo "Crown override logged. Precedent set. Output saved to override_response.json."
