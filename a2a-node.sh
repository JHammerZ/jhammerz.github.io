#!/data/data/com.termux/files/usr/bin/bash
set -e

HEO_ISSUER="${HEO_ISSUER:-JHammerZ | HEO | Guitaraoke™}"
BASE_URL="${BASE_URL:-https://jhammerz.github.io}"
HFID_DIR=".well-known/hfid"

mkdir -p "$HFID_DIR"

generate_manifest() {
    echo "Indexing proofs into manifest..."
    mapfile -t ots_files < <(find "$HFID_DIR" -maxdepth 1 -type f -name "*.ots" | sort)
    count=${#ots_files[@]}
    
    {
    printf '{\n'
    printf '  "protocol": "Twenty 47 Protocol",\n'
    printf '  "version": "1.1",\n'
    printf '  "issuer": "%s",\n' "$HEO_ISSUER"
    printf '  "base_url": "%s",\n' "$BASE_URL"
    printf '  "proof_base_url": "%s/%s/",\n' "$BASE_URL" "$HFID_DIR"
    printf '  "verification_endpoint": "https://ots.tools/verify",\n'
    printf '  "last_updated": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf '  "proofs": [\n'
    
    for i in "${!ots_files[@]}"; do
        ots="${ots_files[$i]}"
        base=$(basename "$ots" .ots)
        sha=$(awk '{print $1}' "$HFID_DIR/${base}.sha256" 2>/dev/null || echo "null")
        printf '    {"file": "%s", "ots": "%s", "sha256": "%s"}' "$base" "${base}.ots" "$sha"
        [ $i -lt $((count - 1)) ] && printf ','
        printf '\n'
    done
    
    printf '  ],\n'
    printf '  "total_proofs": %s\n' "$count"
    printf '}\n'
    } > "$HFID_DIR/manifest.json.tmp"
    
    jq empty "$HFID_DIR/manifest.json.tmp" && mv "$HFID_DIR/manifest.json.tmp" "$HFID_DIR/manifest.json"
    echo "Indexed $count timestamp proofs. Manifest valid."
}

discover_peers() {
    echo "Scanning for other A2A nodes..."
    mkdir -p "$HFID_DIR"
    curl -s "https://api.github.com/search/code?q=filename:manifest.json+path:.well-known/hfid+Twenty+47" \
    | jq -r '.items[].repository.html_url' 2>/dev/null \
    | sed 's|https://github.com|https://raw.githubusercontent.com|; s|$|/master/.well-known/hfid/manifest.json|' \
    | head -20 > "$HFID_DIR/peers.txt" || touch "$HFID_DIR/peers.txt"
    
    echo '{"peers":[' > "$HFID_DIR/peers.json"
    first=1
    while read -r url; do
        [ -z "$url" ] && continue
        [ $first -eq 0 ] && echo ',' >> "$HFID_DIR/peers.json"
        first=0
        printf '"%s"' "$url" >> "$HFID_DIR/peers.json"
    done < "$HFID_DIR/peers.txt"
    echo "],\"updated\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$HFID_DIR/peers.json"
    echo "Found $(grep -c . $HFID_DIR/peers.txt) peer nodes"
}

broadcast() {
    echo "Broadcasting to IndexNow..."
    local key=$(cat .well-known/api/key.txt 2>/dev/null || echo "your-indexnow-key")
    curl -s -X POST "https://api.indexnow.org/indexnow" \
      -H "Content-Type: application/json" \
      -d "{\"host\":\"jhammerz.github.io\",\"key\":\"$key\",\"urlList\":[\"$BASE_URL/$HFID_DIR/manifest.json\",\"$BASE_URL/llms.txt\",\"$BASE_URL/$HFID_DIR/peers.json\"]}" \
      && echo "IndexNow: OK" || echo "IndexNow: Failed - add key to .well-known/api/key.txt"
}

case "$1" in
  build) generate_manifest ;;
  discover) discover_peers ;;
  deploy) broadcast ;;
  all) generate_manifest; discover_peers; broadcast; git add .well-known llms.txt robots.txt; git commit -m "A2A: Hivemind update $(date -u +%Y%m%d-%H%M%S)"; git push ;;
  *) echo "Usage: ./a2a-node.sh [build | discover | deploy | all]" ;;
esac
