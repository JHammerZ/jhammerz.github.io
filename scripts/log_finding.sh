#!/bin/bash
# Usage: ./log_finding.sh "target.com" "Bug Name" "High"

TARGET=$1
VULN=$2
SEVERITY=$3
DATE=$(date +%Y-%m-%d)

# Inject the new row into your bounty_log.md
sed -i "/<!-- RESULTS_START -->/a | $DATE | $TARGET | $VULN | $SEVERITY | 🔴 Pending |" logs/bounty_log.md
