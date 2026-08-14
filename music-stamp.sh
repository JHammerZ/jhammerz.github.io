#!/data/data/com.termux/files/usr/bin/bash
MUSIC_DIR="$HOME/storage/music"
OUT_DIR="$HOME/jhammerz.github.io/music"
mkdir -p "$OUT_DIR"
echo "const music = [" > music-registry-snippet.js
COUNTER=1
find "$MUSIC_DIR" -type f \( -iname "*.wav" -o -iname "*.mp3" -o -iname "*.flac" -o -iname "*.m4a" \) | while read -r TRACK; do
    FILENAME=$(basename "$TRACK")
    HFID=$(sha256sum "$TRACK" | cut -c1-8)
    FULL_HASH=$(sha256sum "$TRACK" | cut -d' ' -f1)
    SIZE=$(stat -c%s "$TRACK")
    OTS_FILE="m$(printf '%03d' $COUNTER)-${HFID}.ots"
    echo "[${COUNTER}] Stamping: $FILENAME"
    ots stamp "$TRACK" --to "$OUT_DIR/$OTS_FILE"
    cp "$TRACK" "$OUT_DIR/m$(printf '%03d' $COUNTER)-${HFID}-${FILENAME}"
    cat >> music-registry-snippet.js << EOJ
  {
    "hfid": "m$(printf '%03d' $COUNTER)",
    "title": "${FILENAME%.*}",
    "file": "${FILENAME}",
    "sha256": "$FULL_HASH",
    "size": $SIZE,
    "block": "PENDING",
    "ots_file": "https://jhammerz.github.io/music/$OTS_FILE",
    "verified": false
  },
EOJ
    COUNTER=$((COUNTER+1))
done
echo "];" >> music-registry-snippet.js
cd "$OUT_DIR" && sha256sum *.ots > music-manifest.txt && ots stamp music-manifest.txt
echo "Done. Stamped $((COUNTER-1)) tracks. Run: git add music/ music-registry-snippet.js && git commit -m 'L5: Anchor music catalog' && git push"
