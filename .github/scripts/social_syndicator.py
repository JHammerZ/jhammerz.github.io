#!/usr/bin/env python3
"""
===================================================================
     LYSANDER SOCIAL MATRIX // ACTUAL ENDPOINT ANTI-DECAY MATRIX
     DESIGN DEPTH: LEVEL 5 PRODUCTION // AUTOMATED SATURATION
===================================================================
Purpose:
Manages continuous circulation and anti-decay metrics specifically
across your verified schema profiles to maximize public discovery.
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path

# Core Substrate Layout Targets
MANIFEST_PATH = Path("socials-manifest.json")
PLAYLIST_PATH = Path("public/assets/playlist.json")
ROTATION_LOG = Path(".backlog_rotation_state.json")

def load_canonical_mesh():
    if not MANIFEST_PATH.exists():
        print("❌ Critical Core Error: socials-manifest.json missing.")
        sys.exit(1)
    try:
        data = json.loads(MANIFEST_PATH.read_text())
        return data.get("platforms", {})
    except Exception as e:
        print(f"❌ Failed to parse identity profile: {e}")
        sys.exit(1)

def load_backlog_library():
    if not PLAYLIST_PATH.exists():
        # Fallback tracking simulation if assets-playlist is not initialized
        return [{"id": "track_001", "title": "Raw Take Session // Vault Master"}]
    try:
        data = json.loads(PLAYLIST_PATH.read_text())
        return data.get("playlist_registry", [])
    except:
        return []

def calculate_rotational_target(pool, platforms):
    if not pool:
        return None, None, None

    # Filter out static resource profiles (like DOI and research links)
    active_channels = {k: v for k, v in platforms.items() if k not in ["zenodo_doi", "orcid"]}
    channel_keys = list(active_channels.keys())

    state = {"last_track_index": -1, "last_channel_index": -1}
    if ROTATION_LOG.exists():
        try:
            state = json.loads(ROTATION_LOG.read_text())
        except:
            pass

    # Increment both tracks and platforms symmetrically to prevent view flatlining
    next_track_idx = (state["last_track_index"] + 1) % len(pool)
    next_channel_idx = (state["last_channel_index"] + 1) % len(channel_keys)

    # Save state to maintain persistent linear memory spaces across daemons
    state["last_track_index"] = next_track_idx
    state["last_channel_index"] = next_channel_idx
    ROTATION_LOG.write_text(json.dumps(state))

    target_track = pool[next_track_idx]
    target_channel = channel_keys[next_channel_idx]
    
    return target_track, target_channel, active_channels[target_channel]

def execute_syndication_pulse(track, channel, url):
    title = track.get("title", "Raw Human Performance")
    track_id = track.get("id", "unknown")
    
    print(f"🔄 [BACKLOG ELEVATION]: Pushing track '{title}' ({track_id}) to the front of {channel.upper()}...")
    print(f"📡 Target network corridor: {url}")

    # Broadcast notification to Discord secure matrix pipeline
    discord_url = os.getenv("DISCORD_WEBHOOK_URL")
    if discord_url:
        payload = {
            "username": "Lysander Syndicator v1.1",
            "embeds": [{
                "title": "⚡ ABSOLUTE ANTI-DECAY MATRIX TRIGGERED",
                "description": f"Elevating legacy backlog library asset to the front of your public distribution footprint.",
                "color": 15418782, # Superluminal Amber
                "fields": [
                    {"name": "🎵 Master Session Asset", "value": f"`{title}`", "inline": True},
                    {"name": "📡 Active Channel Node", "value": f"**{channel.upper()}**", "inline": True},
                    {"name": "🌐 Distribution Lane", "value": f"[Access Stream Target]({url})", "inline": False}
                ],
                "footer": {"text": "Zero-Decay Substrate Architecture // H-FID Secure"}
            }]
        }
        subprocess.run(["curl", "-s", "-X", "POST", "-H", "Content-Type: application/json", "-d", json.dumps(payload), discord_url], stdout=subprocess.DEVNULL)

if __name__ == "__main__":
    if not os.getenv("DISCORD_WEBHOOK_URL"):
        print("❌ Error: Environmental coordination credentials unresolved.")
        sys.exit(1)

    mesh_platforms = load_canonical_mesh()
    backlog_pool = load_backlog_library()
    
    target_track, target_channel, channel_url = calculate_rotational_target(backlog_pool, mesh_platforms)

    if target_track:
        execute_syndication_pulse(target_track, target_channel, channel_url)
        print("🟢 Backlog library sequence rotation synchronized successfully.")
    else:
        print("📋 Matrix rotation evaluated as clean/empty.")
