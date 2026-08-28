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
    
    # 1. Cryptographic and blockchain validation layer sweeps
    python3 anchor-reality-block.py
    python3 ultimate-mythos-matrix-engine.py
    
    # 2. Local asset monitoring and file ingestion sweep
    python3 watch-workspace.py --check-only
    
    # 3. Database indexing curation and storage vacuum pruning
    python3 optimize-sovereign-db.py
    
    # 4. Storage lifecycle maintenance and log rotation
    python3 rotate-telemetry-logs.py
    
    # 5. Production view minification and link drift sweeps
    python3 minify-html-views.py
    python3 track-dead-links.py
    
    # 6. Secondary data structures compilation and IPFS matrix checks
    python3 sovereign_model_engine.py
    python3 ipfs_ledger_sync.py
    
    # 7. Core framework test-matrix sweeps to enforce system balance
    python3 verify-binary-headers.py
    python3 clean-code-refactor.py
    python3 track-preflight-ping.py
    python3 watch-ipc-signals.py
    ./update-terminal-aliases.sh
    
    # Sleep interval loop (1800 seconds = 30 minutes)
    sleep 1800
done
