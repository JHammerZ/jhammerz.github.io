#!/bin/bash
# =====================================================================
# JHammerZ Network Matrix - Live State Telemetry Display v1.1.0
# Core Substrate: Real-time Ingestion Display for Dynamic Multi-Agents
# =====================================================================

clear
echo -e "\e[1;35m======================================================\e[0m"
echo -e "\e[1;35m       JHAMMERZ NETWORK CORE INTERACTIVE STATUS       \e[0m"
echo -e "\e[1;35m======================================================\e[0m"

SNAPSHOT="scripts/traffic_snapshot.json"
ORCHESTRATOR_LOG="scripts/orchestrator.log"

# 1. Audit Active Daemon State
if pgrep -f "matrix_orchestrator.sh" > /dev/null; then
    PID=$(pgrep -f "matrix_orchestrator.sh" | head -n 1)
    echo -e "  -> \e[1;32m[DAEMON STATUS]: ACTIVE & LOCKED (PID: $PID)\e[0m"
else
    echo -e "  -> \e[1;31m[DAEMON STATUS]: OFFLINE / UNLINKED\e[0m"
fi

# 2. Dynamic Multi-Agent Loop Ingestion
if [ -f "$SNAPSHOT" ] && command -v python3 > /dev/null; then
    echo -e "\e[1;34m------------------------------------------------------\e[0m"
    echo -e " \e[1;30m[Active Agent Containment Telemetry]:\e[0m"
    
    # Use python to cleanly iterate and colorize the JSON dictionary parameters for bash
    python3 -c '
import json
with open("scripts/traffic_snapshot.json") as f:
    data = json.load(f)
for agent, info in data.get("trapped_agents", {}).items():
    status = info.get("status", "Unknown").upper()
    reqs = info.get("total_requests", 0)
    cpu = info.get("cpu_hours_wasted", 0.0)
    
    # Color coding flags
    color = "31" if status == "TRAPPED" else "33"
    print(f"  \033[1;34m•\033[0m \033[1;36m{agent:<10}\033[0m | State: \033[1;{color}m{status:<9}\033[0m | Vol: \033[1;32m{reqs:,}\033[0m | CPU: \033[1;31m{cpu}h\033[0m")
'
else
    echo -e "  [-] Telemetry snapshot substrate missing or unreadable."
fi

# 3. Pull Last 3 Daemon Heartbeat Cycles
if [ -f "$ORCHESTRATOR_LOG" ]; then
    echo -e "\e[1;34m------------------------------------------------------\e[0m"
    echo -e "  \e[1;30m[Last 3 Heartbeat Cycles]:\e[0m"
    grep "Cycle Triggered:" $ORCHESTRATOR_LOG | tail -n 3 | sed 's/[*]/ /g'
fi
echo -e "\e[1;35m======================================================\e[0m\n"
