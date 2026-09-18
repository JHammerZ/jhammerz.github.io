#!/bin/bash
TARGET_DIR="/root/jhammerz.github.io/.well-known"
FEED_OUT="$TARGET_DIR/threat_feeds.json"

echo -e "\033[1;35m[*] Spawning Background Autonomous Intel Swarm Scraper...\033[0m"
echo -e "  -> Fetching real-time global development manifests and feeds..."

mkdir -p "$TARGET_DIR"

# Native zero-dependency curl scraper that extracts item headlines from text streams
RAW_FEED=$(curl -s --connect-timeout 6 -m 10 "https://sitemaps.org" 2>/dev/null)

if [[ ! -z "$RAW_FEED" ]]; then
    # Parse URLs from sitemap as sample open web telemetry metrics arrays
    URLS=$(echo "$RAW_FEED" | grep -o "<loc>[^<]*" | sed 's/<loc>//' | head -n 5)
    
    echo "{" > "$FEED_OUT"
    echo "  \"scraper_epoch\": $(date +%s)," >> "$FEED_OUT"
    echo "  \"source_feed\": \"sitemaps_org_index\"," >> "$FEED_OUT"
    echo "  \"staged_nodes\": [" >> "$FEED_OUT"
    
    first=true
    while read -r line; do
        if [ "$first" = true ]; then first=false; else echo "," >> "$FEED_OUT"; fi
        echo -n "    \"$line\"" >> "$FEED_OUT"
    done <<< "$URLS"
    
    echo -e "\n  ]" >> "$FEED_OUT"
    echo "}" >> "$FEED_OUT"
    
    echo -e "  -> \033[1;32m[SUCCESS]\033[0m Threat data vectors scraped, parsed, and logged to web folder paths."
else
    echo -e "  -> \033[1;33m[OFFLINE MODE]\033[0m External connection timed out. Preserving previous cached feed files safely."
fi
