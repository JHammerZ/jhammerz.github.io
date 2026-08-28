#!/usr/bin/env python3
"""
===================================================================
     LYSANDER NETWORK PROTOCOL // RESILIENT MULTI-TRY PING TRACKER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // AUTOMATED NETWORK HEALING
===================================================================
"""

import sys
import time
import subprocess

TARGET_DOMAINS = [
    "jhammerz.github.io",
    "github.com"
]

def verify_edge_connectivity():
    print("📡 Executing resilient multi-try pre-flight edge checks...")
    headers = "User-Agent: Lysander-PreFlight-Agent-v1.2"
    
    for domain in TARGET_DOMAINS:
        url = f"https://{domain}"
        success = False
        
        # 3-Stage retry loop configuration matrix
        for attempt in range(1, 4):
            try:
                res = subprocess.run(
                    ["curl", "-s", "-o", "/dev/null", "-I", "-w", "%{http_code}", "-A", headers, "--connect-timeout", "4", url],
                    capture_output=True, text=True
                )
                status_code = res.stdout.strip()
                
                # Active operational codes or standard developer rate blocks (all mean node is online)
                if status_code in ["200", "301", "302", "404", "403", "429"]:
                    print(f"✅ Route verified online: {domain} (HTTP {status_code}) [Attempt {attempt}]")
                    success = True
                    break
                else:
                    print(f"⚠️ [TIMEOUT BLINK]: {domain} returned status {status_code}. Retrying in 3s...")
                    time.sleep(3)
            except Exception as e:
                print(f"⚠️ Connection thread exception on {domain}: {e}")
                time.sleep(3)
                
        # Graceful Fallback Gate: If your primary site is active, do not let github metrics block your queue
        if not success:
            if domain == "github.com":
                print("⚠️ [GRACEFUL BYPASS]: github.com throttled the head check. Substrate node remains valid. Moving forward.")
            else:
                print(f"❌ Critical Error: Central CDN edge {domain} is unreachable. Halting loop sync.")
                sys.exit(1)
                
    print("🟢 Core distribution lanes clear. Substrate space balanced.")
    sys.exit(0)

if __name__ == "__main__":
    verify_edge_connectivity()
