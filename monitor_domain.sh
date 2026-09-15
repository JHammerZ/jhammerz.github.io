#!/bin/bash
DOMAIN="jhammerz.eu.org"

echo "🛰️ Starting live background monitor for $DOMAIN (Redirect Optimized)..."
while true; do
  # This looks for any clean IP address resolution, ignoring the NXDOMAIN error lines
  IP_CHECK=$(nslookup "$DOMAIN" 1.1.1.1 | grep -A 1 "Name:" | grep "Address:")
  
  if [ ! -z "$IP_CHECK" ]; then
    echo -e "\n🎉 REAL SUCCESS! $DOMAIN is broadcasting live!"
    echo "Your custom domain redirect is now active and routing traffic."
    break
  else
    echo -n "."
    sleep 30
  fi
done
