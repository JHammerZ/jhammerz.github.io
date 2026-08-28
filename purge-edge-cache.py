#!/usr/bin/env python3
"""
===================================================================
     LYSANDER NETWORK PROTOCOL // CLOUDFLARE CACHE PURGE AGENT
     DESIGN DEPTH: LEVEL 5 PRODUCTION // ZERO CDN PURGE DELAY
===================================================================
Purpose:
Triggers secure global CDN cache purges over Cloudflare's API
corridors instantly following filesystem update sweeps.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def execution_cache_flush():
    print("📡 [LYSANDER NET PROTOCOL]: Checking edge CDN flushing parameters...")
    
    # Ingest credentials from secure environment storage vectors
    zone_id = os.getenv("CLOUDFLARE_ZONE_ID")
    auth_token = os.getenv("CLOUDFLARE_AUTH_TOKEN")
    
    if not zone_id or not auth_token:
        print("📋 Cloudflare credentials unmapped. Edge cache will update via standard TTL expirations.")
        return True
        
    url = f"https://cloudflare.com{zone_id}/purge_cache"
    payload = {"purge_everything": True}
    
    try:
        print("📤 Dispatching global cache purge signal to edge cluster layers...")
        res = subprocess.run([
            "curl", "-s", "-X", "POST", url,
            "-H", f"Authorization: Bearer {auth_token}",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(payload)
        ], capture_output=True, text=True)
        
        if res.returncode == 0 and '"success":true' in res.stdout.lower():
            print("🟢 [CDN CACHE FLUSHED]: Global edge distribution caches cleared instantly.")
            return True
        else:
            print(f"⚠️ Edge cluster rejected signal: {res.stdout.strip()}")
            return False
    except Exception as e:
        print(f"❌ Failed to reach edge routing network pathways: {e}")
        return False

if __name__ == "__main__":
    execution_cache_flush()
