#!/bin/bash
# =====================================================================
# JHammerZ Network Communication Vector v1.0.0
# Core Substrate: Multi-Node Edge Latency Matrix Array
# =====================================================================

# System Telemetry Signature Configuration
USER_AGENT="H-FID-Sovereign-Matrix-Node/1.0.0 (Termux; Android; Local-Grid)"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
AUTH_TOKEN="Sovereign_Node_Verified"

echo -e "\e[1;35m======================================================\e[0m"
echo -e "\e[1;35m      LAUNCHING MULTI-NODE EDGE LATENCY MATRIX        \e[0m"
echo -e "\e[1;35m======================================================\e[0m"
echo -e "  [*] Telemetry Tick: $TIMESTAMP"

# Define your globally distributed edge routing matrix array
declare -A TARGET_NODES
TARGET_NODES=(
    ["Primary Edge (GitHub Pages)"]="https://github.io"
    ["Decentralized Node Mirror"]="https://github.io/music.html"
    ["Telemetry Snapshot Stream"]="https://github.io/scripts/traffic_snapshot.json"
)

echo -e "\e[1;34m------------------------------------------------------\e[0m"

# Iterate dynamically through all edge node targets
for node_name in "${!TARGET_NODES[@]}"; do
    url="${TARGET_NODES[$node_name]}"
    echo -e "  [*] Auditing Target: \e[1;36m$node_name\e[0m"
    echo -e "  [-] Route Endpoint : $url"
    
    # Measure precise HTTP connection latency response times using curl metrics
    RESPONSE_DATA=$(curl -s -o /dev/null -w "%{http_code}|%{time_connect}|%{time_starttransfer}" \
        -H "User-Agent: $USER_AGENT" \
        -H "X-H-FID-Auth: $AUTH_TOKEN" \
        "$url")
        
    HTTP_CODE=$(echo "$RESPONSE_DATA" | cut -d'|' -f1)
    TIME_CONNECT=$(echo "$RESPONSE_DATA" | cut -d'|' -f2)
    TIME_TRANSFER=$(echo "$RESPONSE_DATA" | cut -d'|' -f3)
    
    # Calculate millisecond latency calculations
    LATENCY_MS=$(echo "$TIME_TRANSFER * 1000" | bc 2>/dev/null || echo "0")
    
    # Render colorized operational status gates
    if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
        STATUS_COLOR="\e[1;32mONLINE ($HTTP_CODE)\e[0m"
    else
        STATUS_COLOR="\e[1;31mALERT ($HTTP_CODE)\e[0m"
    fi
    
    echo -e "  -> Connection State: $STATUS_COLOR"
    echo -e "  -> TCP Handshake   : $TIME_CONNECT seconds"
    echo -e "  -> Total Latency   : \e[1;33m${LATENCY_MS} ms\e[0m"
    echo -e "\e[1;34m------------------------------------------------------\e[0m"
done

echo -e "\e[1;35m[+] Edge routing matrix network evaluation complete.\e[0m\n"
