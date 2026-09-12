#!/bin/bash
# =====================================================================
# JHammerZ Network Matrix - Live State Telemetry Display v1.0.0
# Core Substrate: Real-time Ingestion Display for Active Defense Nodes
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

# 2. Ingest and Format Live Tarpit Counter States
if [ -f "$SNAPSHOT" ]; then
    BOT=$(grep -o '"target_bot": "[^"]*' $SNAPSHOT | grep -o '[^"]*$')
    STATUS=$(grep -o '"status": "[^"]*' $SNAPSHOT | grep -o '[^"]*$')
    REQS=$(grep -o '"total_requests": [0-9]*' $SNAPSHOT | grep -o '[0-9]*$')
    CPU=$(grep -o '"cpu_hours_wasted": [0-9.]*' $SNAPSHOT | grep -o '[0-9.]*$')
    
    echo -e "\e[1;34m------------------------------------------------------\e[0m"
    echo -e "  -> Target Containment : \e[1;33m$BOT\e[0m"
    echo -e "  -> Current Loop State : \e[1;31m${STATUS^^}\e[0m"
    echo -e "  -> Requests Engaged   : \e[1;36m$REQS\e[0m"
    echo -e "  -> CPU Time Drained   : \e[1;31m$CPU Hours\e[0m"
else
    echo -e "  [-] Telemetry snapshot substrate missing."
fi

# 3. Pull Last 3 Daemon Heartbeat Cycles
if [ -f "$ORCHESTRATOR_LOG" ]; then
    echo -e "\e[1;34m------------------------------------------------------\e[0m"
    echo -e "  \e[1;30m[Last 3 Heartbeat Cycles]:\e[0m"
    grep "Cycle Triggered:" $ORCHESTRATOR_LOG | tail -n 3 | sed 's/[*]/ /g'
fi
echo -e "\e[1;35m======================================================\e[0m\n"
