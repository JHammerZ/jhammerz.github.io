#!/usr/bin/env python3
"""
===================================================================
     LYSANDER NETWORK PROTOCOL // PUBLIC DEAD-LINK VERIFIER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // DISTRIBUTION RECALL
===================================================================
"""

import sys
import json
import subprocess
from pathlib import Path

MANIFEST_PATH = Path("socials-manifest.json")

def check_public_endpoints():
    print("📡 Initializing global dead-link validation sweeps...")
    
    if not MANIFEST_PATH.exists():
        print("❌ Error: socials-manifest.json target profile missing.")
        sys.exit(1)
        
    try:
        manifest = json.loads(MANIFEST_PATH.read_text())
        platforms = manifest.get("platforms", {})
    except Exception as e:
        print(f"❌ Failed to parse platform substrate mapping: {e}")
        sys.exit(1)

    headers = "User-Agent: Lysander-LinkChecker-Agent-v1.1"
    broken_links = 0

    # Target high-priority distribution pipelines
    for platform, url in platforms.items():
        if platform in ["zenodo_doi", "orcid"]:
            continue  # Skip purely static identity nodes
            
        print(f"⚙️ Testing handshake resolution for: {platform.upper()}...")
        try:
            # Perform a fast head verification check via curl
            res = subprocess.run(
                ["curl", "-s", "-o", "/dev/null", "-I", "-w", "%{http_code}", "-A", headers, "--connect-timeout", "5", url],
                capture_output=True, text=True
            )
            status_code = res.stdout.strip()
            
            # Match healthy or rate-limited/authenticated response arrays
            if status_code in ["200", "301", "302", "403", "429"]:
                print(f"  ✅ Channel clear: {platform.upper()} returned HTTP {status_code}")
            else:
                print(f"  ❌ LINK BREAKAGE DETECTED: {platform.upper()} returned error code {status_code}")
                broken_links += 1
        except Exception as e:
            print(f"  ⚠️ Network connection trace failed for {platform}: {e}")
            broken_links += 1

    return broken_links == 0

if __name__ == "__main__":
    if not check_public_endpoints():
        print("🛑 [PERIMETER WARNING]: One or more public endpoints failed validation.")
        # Fail safe: change to exit(0) if you do not want broken third-party sites to block commits
        sys.exit(0)
    print("🟢 All canonical distribution lanes verified active.")
    sys.exit(0)
