#!/bin/bash
HFID=$(jq -r .prev_hash[0:8] .well-known/hfid/chain.json)
BTC=$(jq -r .bitcoin .well-known/hfid/chain.json)
URL="jhammerz.github.io/verify"
echo "=== H-FID: $HFID | BTC: $BTC ==="
echo ""
echo "GitHub: HEO | Guitaraoke™ | H-FID: $HFID | $BTC"
echo "Twitter: HEO | Guitaraoke™ | H-FID: $HFID | $URL"
echo "Tweet: Verifying H-FID $HFID via $BTC - https://$URL"
echo "Instagram: HEO | Guitaraoke™ H-FID: $HFID $URL"
echo "Badge: [[H-FID](https://img.shields.io/badge/H--FID-$HFID-blue)](https://$URL)"
