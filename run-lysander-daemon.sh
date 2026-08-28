#!/bin/bash
# =====================================================================
#         SOVEREIGN SUBSTRATE // BACKGROUND RUNTIME DAEMON LOOP
# =====================================================================
echo "[+] Initializing Lysander Autonomy Daemon (Localized Mode)..."
PID_FILE="$HOME/jhammerz.github.io/.lysander-daemon.pid"

if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "[-] Daemon is already executing under PID: $OLD_PID"
        exit 1
    fi
fi

echo $$ > "$PID_FILE"

while true; do
    echo "=== DAEMON REFRESH CYCLE STARTED: $(date) ==="
    
    # Fire the anchor verification ledger
    python3 anchor-reality-block.py
    
    # Auto-compile fresh forensic telemetry blocks
    python3 ultimate-mythos-matrix-engine.py
    
    # Run the database storage optimization and vacuum compaction sequence automatically
    python3 optimize-sovereign-db.py
    
    # Run the log rotation routine automatically to prevent file bloat
    python3 rotate-telemetry-logs.py
    
    # Run aggressive HTML compaction to optimize static payloads before deployment
    python3 minify-html-views.py
    
    # Run dead link auditing to verify edge connectivity baseline integrity
    python3 track-dead-links.py

    # Execute the local data repository compilation engine
    python3 sovereign_model_engine.py

    # Run the decentralized IPFS storage layer compilation engine
    python3 ipfs_ledger_sync.py
    
    # Sleep interval loop (1800 seconds = 30 minutes)
    sleep 1800
done
