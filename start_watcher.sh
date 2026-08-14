#!/data/data/com.termux/files/usr/bin/bash

# Define system workspace target folders
WORKSPACE="$HOME/sovereign_node"
INGEST_DIR="$WORKSPACE/content_ingest"

cd "$WORKSPACE"

echo "=== SOVEREIGN ENGINE WATCHER ACTIVE ==="
echo "Monitoring dropzone: $INGEST_DIR"
echo "Press [Ctrl + C] to terminate loop gracefully."
echo "========================================"

while true; do
    # Check if there are any JSON metadata structures sitting inside the directory
    if ls "$INGEST_DIR"/*.json >/dev/null 2>&1; then
        echo "[EVENT] New content profile detected at $(date '+%H:%M:%S'). Executing processing cycle..."
        python catalog_engine.py
        echo "[STATUS] Cycle complete. Returning to active monitoring state."
    fi
    # Idle for 3 seconds before polling the directory structure again to save CPU cycles
    sleep 3
done
