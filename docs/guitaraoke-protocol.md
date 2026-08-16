
# Send it via API instead of git push
gh api repos/JHammerZ/jhammerz.github.io/dispatches \ -f event_type=hxa_sovereign_write \ -F 
  client_payload[content]="$(cat docs/guitaraoke-protocol.md)" \
  -F client_payload[path]="docs/guitaraoke-protocol.md"
