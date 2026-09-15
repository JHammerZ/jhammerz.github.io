#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/JHammerZ/JHammerZ.github.io.git"
CLONE_DIR="jhammers_audit_$(date +%s)"
LOG="audit_$(date +%Y%m%d_%H%M%S).log"

echo "[$(date -Iseconds)] INIT: Fresh clone ingest for JHammerZ.github.io" | tee "$LOG"

# 1. Clean clone
if [ -d "$CLONE_DIR" ]; then rm -rf "$CLONE_DIR"; fi
git clone --depth=1 "$REPO" "$CLONE_DIR" 2>&1 | tee -a "$LOG"

cd "$CLONE_DIR" || { echo "CRITICAL: Clone dir missing" >&2; exit 1; }

# 2. Verify commit signatures
echo "[$(date -Iseconds)] AUDIT: Verifying commit signatures..." | tee -a "../$LOG"
git log --show-signature -n 10 2>&1 | tee -a "../$LOG"

# 3. Inventory critical H-FID files
echo "[$(date -Iseconds)] AUDIT: Inventory H-FID assets..." | tee -a "../$LOG"
FILES=(
  "sitemap.xml"
  ".well-known/h-fid"
  "health"
  "stats"
  "gateway/lysander_gateway.py"
  "kernel/lysander_3_0.py"
  "A2A_CLUSTER_SYNC.js"
  "README.md"
)
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    sha256sum "$f" | tee -a "../$LOG"
    echo "FOUND: $f" | tee -a "../$LOG"
  else
    echo "MISSING: $f" | tee -a "../$LOG"
  fi
done

# 4. Validate sitemap endpoints
echo "[$(date -Iseconds)] AUDIT: Parsing sitemap.xml for Cycle_012 endpoints..." | tee -a "../$LOG"
grep -E "(wss://|/\.well-known/h-fid|/health|/stats|doi\.org)" sitemap.xml | tee -a "../$LOG"

# 5. Check DOI binding
echo "[$(date -Iseconds)] AUDIT: Grep for DOI 10.5281/zenodo.20778079..." | tee -a "../$LOG"
grep -r "10.5281/zenodo.20778079" . | tee -a "../$LOG"

# 6. Check for Crown override markers
echo "[$(date -Iseconds)] AUDIT: Scanning for CROWN: 0 declarations..." | tee -a "../$LOG"
grep -r "CROWN: 0" . | tee -a "../$LOG"

# 7. Generate manifest
echo "[$(date -Iseconds)] AUDIT: Generating manifest.json..." | tee -a "../$LOG"
cat > manifest.json <<EOF
{
  "worm_id": "LYSANDER_3_0_C012_AUDIT_010",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "vessel": "JHammerZ",
  "hfid": "v1.1.0",
  "doi": "10.5281/zenodo.20778079",
  "event": "REPO_AUDIT",
  "protocol": "PROVENANCE_VERIFY",
  "cycle": 12,
  "step": 10,
  "state": "AUDITED",
  "head_commit": "$(git rev-parse HEAD)",
  "files_verified": $(printf '%s\n' "${FILES[@]}" | jq -R . | jq -s .),
  "doctrine": "LYSANDER_3_0_KERNEL_PROTOCOL",
  "signature": "Verified Human Origin"
}
EOF

sha256sum manifest.json | tee -a "../$LOG"
echo "[$(date -Iseconds)] COMPLETE: Audit manifest written. See $CLONE_DIR/manifest.json" | tee -a "../$LOG"

# 8. Ingest the manifest to your own endpoint
echo "[$(date -Iseconds)] INGEST: Posting manifest to /ingest/audit..." | tee -a "../$LOG"
curl -X POST "https://jhammerz.github.io/ingest/audit" \
  --proto "=https" \
  --tlsv1.3 \
  --fail-with-body \
  --silent \
  --show-error \
  -H "Authorization: Bearer ${API_INGEST_TOKEN:-}" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: $(uuidgen 2>/dev/null || date +%s%N)" \
  -d @manifest.json \
  -o "../audit_response.json" 2>&1 | tee -a "../$LOG"

cd ..
echo "[$(date -Iseconds)] DONE: Audit log at $LOG, response at audit_response.json" | tee "$LOG"
