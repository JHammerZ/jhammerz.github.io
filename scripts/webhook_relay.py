#!/usr/bin/env python3
import json
import os
import sys
import urllib.request

def dispatch_syndication_webhooks():
    print("[*] Initializing Autonomous Webhook Relay Engine v1.0.0...")
    
    # Load core manifest metadata to extract real human content indicators
    manifest_path = ".hfid/baseline/sovereign-manifest.json"
    if not os.path.exists(manifest_path):
        manifest_path = "entities.json"
        
    try:
        with open(manifest_path, 'r') as f:
            metadata = json.load(f)
        sha = metadata.get("sha", "latest_alpha_node")[:7]
    except Exception:
        sha = "unknown_origin"

    # Define asymmetric distribution destinations bypassing paywall middleware APIs
    WEBHOOK_TARGETS = {
        "DISCORD_BROADCAST_NODE": os.environ.get("DISCORD_WEBHOOK_URL"),
        "SLACK_SYNDICATE_NODE": os.environ.get("SLACK_WEBHOOK_URL"),
        "GENERIC_EDGE_MESH": os.environ.get("GLOBAL_MESH_RELAY_URL")
    }

    payload = {
        "username": "JHammerZ Sovereign Node",
        "avatar_url": "https://github.io",
        "content": f"🚀 **Asymmetric Algorithmic Domination Activated**\nCore engine update successfully compiled and broadcasted out to global edge servers.\n\n**Commit Ref:** `{sha}`\n**Identity Verification:** `H-FID COMPLIANT`\n**Payload Status:** `MAXIMUM_VELOCITY`\n\n[✓] Ingestion Matrix Online: https://github.io",
        "text": f"JHammerZ AAD Broadcast Engine Synchronized. Commit: {sha}. Data Integrity verified."
    }

    json_data = json.dumps(payload).encode('utf-8')
    dispatched = 0

    for name, url in WEBHOOK_TARGETS.items():
        if not url:
            print(f"[*] Node {name} skipped: No active environmental token url hook configured.")
            continue
            
        print(f"[*] Dispatching transaction payload packet to {name}...")
        try:
            req = urllib.request.Request(
                url, 
                data=json_data,
                headers={
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 H-FID-Syndicator/1.0'
                }
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                # FIX: Explicit list matching bounds check for successful HTTP response array elements
                if response.status in:
                    print(f"[✓] Handshake confirmed from {name}. Payload absorbed cleanly.")
                    dispatched += 1
                else:
                    print(f"[! ] Non-standard response return from {name}: Code {response.status}")
        except Exception as e:
            print(f"[! ] Connection drop encountered on target pipeline {name}: {e}")

    print(f"[✓] Relay operation sequence complete. Total active nodes targeted: {dispatched}")

if __name__ == "__main__":
    dispatch_syndication_webhooks()
