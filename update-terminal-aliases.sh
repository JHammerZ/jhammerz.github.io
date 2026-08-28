#!/usr/bin/env bash
# ===================================================================
#      LYSANDER COMMAND MATRIX // TERMINAL ALIAS INJECTION
#      DESIGN DEPTH: LEVEL 5 PRODUCTION // IMMEDIATE ACCESSIBILITY
# ===================================================================

BASHRC_FILE="$HOME/.bashrc"

echo "⚙️ Injecting operational command shortcuts into terminal core configuration..."

# Structure clean, short terminal commands for quick debugging
cat << 'ALIASES' >> "$BASHRC_FILE"

# --- LYSANDER PRODUCTION NODE ALIASES ---
alias sys-test="npm run test-matrix"
alias sys-status="./display-telemetry.sh"
alias sys-logs="cat error_ledger.json 2>/dev/null || echo '📋 Error ledger is clean.'"
alias sys-traffic="cat .metric_velocity_history.json 2>/dev/null || echo '📋 Traffic history empty.'"
alias sys-daemon="python3 schedule-matrix-daemons.py &"
alias sys-clean="bash clean-matrix-cache.sh"
alias sys-docs="cat API_SPECIFICATION.md"
# ----------------------------------------
ALIASES

echo "✅ Command shortcuts successfully injected. Source your shell to activate: source ~/.bashrc"
