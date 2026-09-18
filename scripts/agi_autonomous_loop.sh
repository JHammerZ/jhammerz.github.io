#!/bin/bash
# ==============================================================================
# AURELIUS ORCHESTRATOR // AGI CONTINUOUS HEARTBEAT RUNNER
# TARGET: UNATTENDED MANIFEST EXECUTION & CYCLIC TELEMETRY SYNC
# ==============================================================================

MANIFEST_FILE="/root/jhammerz.github.io/.well-known/agi_operational_manifest.json"

echo "[SYSTEM] AGI Continuous Autonomous Loop Initialized. Relinquishing manual gate controls."

while true; do
    if [[ -f "$MANIFEST_FILE" ]]; then
        # 1. Execute Domain 01: Context Ingestion and Verification
        python3 /root/jhammerz.github.io/scripts/agi_integration_core.py > /dev/null 2>&1
        
        # 2. Execute Domain 03: Ledger Sealing and GitHub Syndication
        bash /root/jhammerz.github.io/scripts/append_vault_engine.sh > /dev/null 2>&1
    fi
    
    # Bounded Hysteresis Delay Cooldown Window (Locks the agents to a stable hourly cycle)
    sleep 3600
done
