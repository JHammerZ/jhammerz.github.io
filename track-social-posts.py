#!/usr/bin/env python3
"""
Purpose:
Monitors public handle feeds for new content drops to immediately
inject freshness signals and trigger global CDN replication.
"""

import os
import sys
import re
import json
import subprocess
from pathlib import Path

MANIFEST_PATH = Path("socials-manifest.json")
FEED_STATE = Path(".social_feed_snapshot.json")

def load_verified_mesh():
    if not MANIFEST_PATH.exists():
        print("❌ Error: socials-manifest.json target profile missing.")
        sys.exit(1)
    try:
        data = json.loads(MANIFEST_PATH.read_text())
        return data.get("platforms", {})
    except Exception as e:
        print(f"❌ Failed to parse identity profile: {e}")
        sys.exit(1)

def monitor_public_feeds(platforms):
    print("📡 [LYSANDER TELEMETRY]: Checking public feeds for immediate upload detection...")
    
    # Load previous feed signatures to detect mutations
    previous_snapshot = {}
    if FEED_STATE.exists():
        try:
            previous_snapshot = json.loads(FEED_STATE.read_text())
        except:
            pass

    current_snapshot = {}
    new_activity_detected = False
    headers = "User-Agent: Mozilla/5.0 (Android; Mobile; rv:128.0) Gecko/128.0 Firefox/128.0"
    
    # Focus tracking on your main high-velocity video discovery corridors
    active_monitors = ["tiktok", "youtube", "instagram", "facebook"]
    
    for platform in active_monitors:
        if platform in platforms:
            url = platforms[platform]
            try:
                # Execute instant headless query pass
                res = subprocess.run(
                    ["curl", "-s", "-A", headers, "-L", url],
                    capture_output=True, text=True, timeout=15
                )
                
                if res.returncode == 0:
                    # Isolate unique content markers or upload identifiers in the raw feed payload
                    video_ids = re.findall(r'video/(\d+)', res.stdout) or re.findall(r'watch\?v=([\w-]+)', res.stdout)
                    latest_id = video_ids[0] if video_ids else "no_recent_posts"
                    
                    current_snapshot[platform] = latest_id
                    
                    # If the latest identifier does not match your history, a new post is live
                    if previous_snapshot.get(platform) and previous_snapshot.get(platform) != latest_id and latest_id != "no_recent_posts":
                        print(f"⚠️ [IMMEDIATE ACTIVITY]: Fresh upload detected live on {platform.upper()}! (ID: {latest_id})")
                        new_activity_detected = True
                else:
                    current_snapshot[platform] = previous_snapshot.get(platform, "unknown")
            except Exception as e:
                print(f"⚠️ Telemetry sweep bypassed for {platform}: {e}")
                current_snapshot[platform] = previous_snapshot.get(platform, "unknown")

    # Persist the fresh timeline snapshot on your device
    FEED_STATE.write_text(json.dumps(current_snapshot, indent=2))
    return new_activity_detected

if __name__ == "__main__":
    mesh = load_verified_mesh()
    if monitor_public_feeds(mesh):
        print("⚡ Fresh post detected. Initializing immediate global CDN updates...")
        sys.exit(0)
    else:
        print("✅ Public feeds balanced. No new external posts found.")
        sys.exit(1)
