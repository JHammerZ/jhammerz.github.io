#!/usr/bin/env python3
"""
===================================================================
     LYSANDER NETWORK PROTOCOL // PRE-FLIGHT EDGE PING TRACKER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // PROACTIVE FAIL-SAFE
===================================================================
"""

import sys
import subprocess

TARGET_DOMAINS = [
    "jhammerz.github.io",
    "://github.com"
]

def verify_edge_connectivity():
    print("📡 Executing pre-flight edge route ping checks...")
    headers = "User-Agent: Lysander-PreFlight-Agent-v1.1"
    
    for domain in TARGET_DOMAINS:
        url = f"https://{domain}"
        try:
            # Quick curl head pull to verify endpoint accessibility
            res = subprocess.run(
                ["curl", "-s", "-o", "/dev/null", "-I", "-w", "%{http_code}", "-A", headers, "--connect-timeout", "5", url],
                capture_output=True, text=True
            )
            status_code = res.stdout.strip()
            
            # Codes matching 200, 301, 302, or 404 (indicating the server is alive and responding)
            if status_code in ["200", "301", "302", "404", "403"]:
                print(f"✅ Route connection verified online: {domain} (HTTP {status_code})")
            else:
                print(f"❌ Critical Error: Node {domain} returned unexpected state (HTTP {status_code}).")
                sys.exit(1)
                
        except Exception as e:
            print(f"❌ Failed to reach network edge path {domain}: {e}")
            sys.exit(1)
            
    print("🟢 All distribution lanes clear. System safe to proceed.")
    sys.exit(0)

if __name__ == "__main__":
    verify_edge_connectivity()
