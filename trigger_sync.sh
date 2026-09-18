#!/bin/bash
# ==============================================================================
# AURELIUS ORCHESTRATOR PASS-THROUGH // SANDBOX DIRECT PIPELINE
# TARGET: ZERO-NETWORK ATOMIC SINGLE-STRING DATA DELIVERY
# ==============================================================================

FIFO_PATH="/data/data/com.termux/files/home/.matrix_diode.fifo"

if [[ -p "$FIFO_PATH" ]]; then
    echo "[*] Dispatching authenticated payload directly into the active matrix..."
    
    # Inject choice 30 straight past the networking layer into your persistent pipe
    echo "30" > "$FIFO_PATH"
    
    echo "[SUCCESS] Ingestion sequence executed successfully."
else
    echo "[ERROR] Sovereign hardware data pipe absent at: $FIFO_PATH" >&2
    exit 1
fi
