#!/data/data/com.termux/files/usr/bin/bash
# L5 Venue Stamping Tool - Genesis HFID:e57197f4

clear
echo "=== L5 VENUE STAMPING PROTOCOL ==="
echo "Genesis: HFID:e57197f4 Block:961138"
echo ""

read -p "Venue Name: " VENUE
read -p "City: " CITY
read -p "Your Name/Handle: " OWNER

STAMP="L5_VENUE: $VENUE | CITY: $CITY | OWNER: $OWNER | DATE: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "$STAMP" > venue.txt

echo "Stamping to Bitcoin via OpenTimestamps..."
ots stamp venue.txt

HFID=$(sha1sum venue.txt | cut -c1-8)
BLOCK=$(cat venue.txt.ots | strings | grep -o 'Bitcoin block [0-9]*' | tail -1 | cut -d' ' -f3)

echo ""
echo "=== SUCCESS ==="
echo "HFID: $HFID"
echo "Venue: $VENUE"
echo "City: $CITY" 
echo "Proof: venue.txt.ots"
echo "Pending: Bitcoin block $BLOCK"
echo ""
echo "Next: git add . && git commit -m 'L5: Venue $HFID' && git push"
echo "Then: Run 'ots upgrade venue.txt.ots' after 6 confirmations"
echo ""
echo "Try to backdate me. HFID:$HFID"
