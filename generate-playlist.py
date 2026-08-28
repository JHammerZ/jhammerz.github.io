#!/usr/bin/env python3
"""
================================================================================
          LYSANDER NETWORK INGRESS // AUTOMATED PLAYLIST MANIFEST GENERATOR
          DESIGN DEPTH: LEVEL 4 PRODUCTION // ZERO-DELETION INTELLIGENCE
================================================================================
Purpose:
  Scans the local storage media corridors, compiles valid audio tracks, 
  and generates a clean, structured JSON manifest for edge-caching distribution.
================================================================================
"""

import os
import json
from pathlib import Path

MEDIA_DIR = Path("./public/music")
OUTPUT_MANIFEST = Path("./public/assets/playlist.json")

print("=== Mythos Media Engine: Generating Structural Playlist Manifest ===")

if not MEDIA_DIR.exists():
    print(f"-> Provisioning missing media tracks container path: {MEDIA_DIR}")
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)

tracks = []
supported_extensions = ['.mp3', '.webm', '.aac', '.flac']

# Enumerate and parse all active raw audio tracks natively
for idx, file in enumerate(sorted(MEDIA_DIR.glob("*"))):
    if file.suffix.lower() not in supported_extensions:
        continue
        
    file_size_mb = os.path.getsize(file) / (1024 * 1024)
    track_id = f"JHAMMERZ-{str(idx+1).zfill(3)}"
    
    track_node = {
        "id": track_id,
        "title": file.stem.replace("_", " ").title(),
        "filename": file.name,
        "path": f"music/{file.name}",
        "file_size_bytes": os.path.getsize(file),
        "file_size_formatted": f"{file_size_mb:.2f} MB",
        "codec_signature": file.suffix.upper().replace(".", "")
    }
    tracks.append(track_node)
    print(f"✓ Indexed track node [{track_id}]: {file.name} ({track_node['file_size_formatted']})")

# Construct the top-level immutable manifest container mapping
manifest_payload = {
    "manifest_version": "Lysander Media Manifest v1.0",
    "total_tracks_buffered": len(tracks),
    "playlist_registry": tracks
}

# Write and format to standardized compact hierarchy structures
with open(OUTPUT_MANIFEST, 'w', encoding='utf-8') as f:
    json.dump(manifest_payload, f, indent=2)

print("----------------------------------------------------------------------")
print(f"✓ COMPLETE: Playlist manifest successfully compiled to: {OUTPUT_MANIFEST}")
print("======================================================================")
