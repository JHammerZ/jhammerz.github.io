#!/bin/bash
# Replace ALL simpleicons.org with jsDelivr - same icons, real edge CDN, no 404s
sed -i 's|https://cdn.simpleicons.org/[^"]*/white|https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/ICON|g' index.html

# Do it properly per icon - jsDelivr uses exact slug names
sed -i 's|cdn.simpleicons.org/amazon/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazon|g' index.html
sed -i 's|cdn.simpleicons.org/amazonmusic/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazonmusic|g' index.html
sed -i 's|cdn.simpleicons.org/linkedin/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/linkedin|g' index.html
sed -i 's|cdn.simpleicons.org/spotify/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/spotify|g' index.html
sed -i 's|cdn.simpleicons.org/applemusic/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/applemusic|g' index.html
sed -i 's|cdn.simpleicons.org/bandlab/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/bandlab|g' index.html
sed -i 's|cdn.simpleicons.org/youtube/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/youtube|g' index.html
sed -i 's|cdn.simpleicons.org/instagram/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/instagram|g' index.html
sed -i 's|cdn.simpleicons.org/tiktok/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/tiktok|g' index.html
sed -i 's|cdn.simpleicons.org/facebook/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/facebook|g' index.html
sed -i 's|cdn.simpleicons.org/github/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/github|g' index.html
sed -i 's|cdn.simpleicons.org/orcid/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/orcid|g' index.html
sed -i 's|cdn.simpleicons.org/zenodo/white|cdn.jsdelivr.net/npm/simple-icons@v13/icons/zenodo|g' index.html

# Fix the SyntaxError at 521 - your catch block got mangled
# Restore proper try/catch around fallbackWorkerHealth
sed -i '521s/.*/} catch (e){ await fallbackWorkerHealth(); }/' index.html

grep -o "cdn.jsdelivr.net[^\"]*" index.html | sort | uniq
