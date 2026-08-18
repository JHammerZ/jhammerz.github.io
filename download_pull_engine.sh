#!/data/data/com.termux/files/usr/bin/bash

# ==============================================================================
# SOVEREIGN TOTAL HARVEST PULL ENGINE
# Operational Scope: Full Profile Library Extraction (Videos, Shorts, Live Streams)
# Isolation Boundary: Local Termux Aggregator Zone
# ==============================================================================

WORKSPACE="$HOME/sovereign_node"
URL_LIST="$WORKSPACE/target_libraries.txt"
INGEST_DIR="$WORKSPACE/content_ingest"
ARCHIVE_FILE="$WORKSPACE/processed_history.txt"

mkdir -p "$INGEST_DIR"

if [ ! -f "$URL_LIST" ]; then
    echo "[INFO] Target configuration list empty. Initialize with a target profile URL."
    touch "$URL_LIST"
    exit 0
fi

echo "=== SOVEREIGN TOTAL PROFILE PULL ENGINE ENGAGED ==="

while IFS= read -r target_url || [ -n "$target_url" ]; do
    [[ -z "$target_url" || "$target_url" =~ ^# ]] && continue
    
    echo "[HARVEST] Init complete. Scanning entire profile tree: $target_url"
    
    # Execute full extraction loop handling all available profile tabs natively
    yt-dlp --no-warnings \
           --ignore-errors \
           --write-info-json \
           --skip-download \
           --download-archive "$ARCHIVE_FILE" \
           --sleep-requests 1.5 \
           --match-filter "!is_live" \
           -o "$INGEST_DIR/harvest_%(extractor_key)s_%(id)s.%(ext)s" \
           "$target_url"

done < "$URL_LIST"

echo "=== PROFILE TREE HARVESTING SEQUENCE COMPLETE ==="
