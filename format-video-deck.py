#!/usr/bin/env python3
"""
Purpose:
Parses your backlog library, applies a deterministic rotation array to
prevent view decay, and rewrites music.html with your re-balanced grid.
"""

import json
import time
from pathlib import Path

MUSIC_HTML = Path("music.html")
PLAYLIST_JSON = Path("public/assets/playlist.json")
ROTATION_STATE = Path(".rotation_index.json")

def load_backlog():
    if not PLAYLIST_JSON.exists():
        print("⚠️ Substrate playlist file missing. Initializing standard buffer schema.")
        return []
    try:
        data = json.loads(PLAYLIST_JSON.read_text())
        return data.get("playlist_registry", [])
    except Exception as e:
        print(f"❌ Failed to parse media substrate: {e}")
        return []

def get_current_shift(total_tracks):
    if total_tracks == 0:
        return 0
    # Use day-based integer steps to shift the front index cleanly every 24 hours
    current_day = int(time.time() / 86400)
    return current_day % total_tracks

def generate_video_deck_html():
    print("🔄 Initializing Anti-Decay Backlog Rotation sequence...")
    tracks = load_backlog()
    total_tracks = len(tracks)

    if total_tracks == 0:
        print("📋 Backlog library empty. Balancing phase skipped.")
        return False

    # Apply the deterministic rotation sweep matrix to push old files up
    shift_factor = get_current_shift(total_tracks)
    rotated_tracks = tracks[shift_factor:] + tracks[:shift_factor]
    print(f"⚡ Matrix rotation balanced. Index offset shift: {shift_factor}")

    # Build the responsive card grid with the newly elevated backlog assets
    deck_elements = []
    for track in rotated_tracks:
        track_id = track.get("id", "unknown")
        title = track.get("title", "Untitled Raw Session")
        url = track.get("url", "#")

        element = f"""    <div class="video-deck-card" data-track-id="{track_id}">
      <h3>{title}</h3>
      <a href="{url}" target="_blank" class="deck-stream-link">⚡ Stream Raw Take</a>
    </div>"""
        deck_elements.append(element)

    deck_content = "\n".join(deck_elements)

    if not MUSIC_HTML.exists():
        MUSIC_HTML.write_text("<!DOCTYPE html><html><head><title>Music Hub</title></head><body>\n<!-- VIDEO_DECK_START -->\n<!-- VIDEO_DECK_END -->\n</body></html>")

    html_source = MUSIC_HTML.read_text()
    start_token = "<!-- VIDEO_DECK_START -->"
    end_token = "<!-- VIDEO_DECK_END -->"

    if start_token in html_source and end_token in html_source:
        before = html_source.split(start_token)[0]
        after = html_source.split(end_token)[1]

        updated_html = f"{before}{start_token}\n{deck_content}\n{end_token}{after}"
        MUSIC_HTML.write_text(updated_html)
        print("✅ Anti-decay tracking complete. music.html layout updated globally.")
        return True
    else:
        print("❌ Error: Structural token layouts missing in target presentation view file.")
        return False

if __name__ == "__main__":
    generate_video_deck_html()
