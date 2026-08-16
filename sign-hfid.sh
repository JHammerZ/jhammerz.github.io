#!/bin/bash
KEY="hfid-key"
PUB=$(cat hfid-public.key)
jq --arg pub "$PUB" '.publicKey = $pub' hfid-registry.json > tmp.json

for hfid in JHammerZ-001 JHammerZ-002 JHammerZ-003 JHammerZ-004 JHammerZ-005 JHammerZ-006 JHammerZ-007; do
  CANON=$(jq -r ".claims[] | select(.hfid==\"$hfid\") |.canonical" tmp.json)
  TS=$(jq -r ".claims[] | select(.hfid==\"$hfid\") |.timestamp" tmp.json)
  PAYLOAD="${hfid}${CANON}${TS}"
  SIG=$(printf "%s" "$PAYLOAD" | ssh-keygen -Y sign -f "$KEY" -n hfid | tail -n +2 | head -n -1 | tr -d '\n')
  jq "(.claims[] | select(.hfid==\"$hfid\")).sig = \"$SIG\"" tmp.json > tmp2.json && mv tmp2.json tmp.json
done
mv tmp.json hfid-registry.json
