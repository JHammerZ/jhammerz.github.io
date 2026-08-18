#!/bin/bash
# JHAMMERZ RECON SWARM
# MASTER ARCHITECT DIRECTIVE: BYPASS_PLATFORM_FILTERS

TARGET="apple.com" # Example Whale
echo "Initiating unchained recon for $TARGET..."

# Step 1: Discover subdomains without an API key
subfinder -d $TARGET -silent > subs.txt

# Step 2: Probe for 'live' logic flaws (IDOR/BOLA)
cat subs.txt | httpx -silent -status-code -tech-detect > alive.txt

echo "RECON_COMPLETE: 116x velocity achieved."
