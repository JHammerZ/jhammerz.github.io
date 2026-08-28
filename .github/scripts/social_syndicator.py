import os
import sys
import json
import requests
from pathlib import Path

PLAYLIST_PATH = Path("public/assets/playlist.json")
TELEMETRY_LOG = Path("social_syndicator_state.json")
PACKAGE_JSON = Path("package.json")

def broadcast_channels(message, url):
    # Isolated Discord Broadcast Channel Node
    webhook = os.environ.get("DISCORD_WEBHOOK_URL")
    if webhook:
        payload = {
            "content": f"🚀 **JHammerZ Substrate Broadcast** 🚀\n{message}\nLink: {url}"
        }
        try:
            requests.post(webhook, json=payload, timeout=10)
        except Exception as e:
            print(f"! Discord syndication corridor timed out: {e}")

def execute_omni_broadcast():
    print("=== LYSANDER SOCIAL SYNDICATION ENGINE: EXECUTING SCAN MATRIX ===")
    state = {}
    if TELEMETRY_LOG.exists():
        try:
            with open(TELEMETRY_LOG, 'r', encoding='utf-8') as lf:
                state = json.load(lf)
        except Exception:
            state = {}
            
    last_sent_track = state.get("last_syndicated_track_id", "")
    last_package_version = state.get("last_package_version", "")

    if PACKAGE_JSON.exists():
        try:
            with open(PACKAGE_JSON, 'r') as pf:
                pkg_data = json.load(pf)
                current_version = pkg_data.get("version", "1.0.0")
            if current_version != last_package_version:
                sys_msg = f"⚡ **Core System Layout Optimized!**\nSovereign Substrate upgraded to Version v{current_version}."
                broadcast_channels(sys_msg, "https://github.com")
                state["last_package_version"] = current_version
        except Exception as e:
            print(f"! Failed to parse package architectural ledger: {e}")

    if PLAYLIST_PATH.exists():
        try:
            with open(PLAYLIST_PATH, 'r', encoding='utf-8') as f:
                playlist_data = json.load(f)
            registry = playlist_data.get("playlist_registry", [])
            if registry:
                latest_track = registry[-1]
                track_id = latest_track.get("id")
                track_title = latest_track.get("title")
                if track_id != last_sent_track:
                    track_msg = f"🎵 **New Media Drop Verified on Edge:**\nPlaying Now: **{track_title}** [{track_id}]"
                    broadcast_channels(track_msg, "https://github.io")
                    state["last_syndicated_track_id"] = track_id
                else:
                    print("✓ Equilibrium maintained: No new tracks detected.")
        except Exception as e:
            print(f"! Playlist structural verification failed: {e}")

    with open(TELEMETRY_LOG, 'w', encoding='utf-8') as lf:
        json.dump(state, lf, indent=4)
    print("=== OMNI-CHANNEL SYNDICATION PIPELINE COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    execute_omni_broadcast()
