#!/bin/bash
# =====================================================================
#         SOVEREIGN SUBSTRATE // BACKGROUND RUNTIME DAEMON LOOP
# =====================================================================
echo "[+] Initializing Lysander Autonomy Daemon..."
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
    
    # Fire the newly integrated encrypted telemetry relay to your Telegram interface
    python3 telegram-telemetry-relay.py
    
    # Sleep interval loop (1800 seconds = 30 minutes)
    sleep 1800
done
