#!/usr/bin/env python3
"""
===================================================================
     LYSANDER PROVENANCE LAYER // BINARY HEADER AUDIT UTILITY
     DESIGN DEPTH: LEVEL 5 PRODUCTION // MEDIA INSULATION GATES
===================================================================
"""

import sys
from pathlib import Path

AUDIO_TARGETS = Path("public/music")

def inspect_media_containers():
    if not AUDIO_TARGETS.exists():
        print("📋 Audio target workspace empty. Skipping deep container scans.")
        return True

    print("⚡ [LYSANDER AUDIT CORE]: Analyzing raw binary media file containers...")
    invalid_assets = 0

    # Common absolute audio magic byte sequence headers
    magic_bytes = {
        b"ID3": "MP3 container with ID3v2 tag metadata",
        b"\xff\xfb": "Standard MP3 raw stream frame header",
        b"RIFF": "WAV audio container file format type",
        b"fLaC": "FLAC lossless audio serialization encoding"
    }

    for track_path in AUDIO_TARGETS.glob("**/*"):
        if track_path.is_file() and track_path.suffix.lower() in [".mp3", ".wav", ".flac"]:
            try:
                with open(track_path, "rb") as audio_file:
                    header = audio_file.read(4)
                    
                # Match byte frames against verified signatures
                is_valid = any(header.startswith(sig) for sig in magic_bytes)
                
                if is_valid:
                    print(f"✅ Container verified healthy: {track_path.name}")
                else:
                    print(f"❌ CRITICAL CONTAINER ANOMALY: {track_path.name} failed structural header inspection.")
                    invalid_assets += 1
            except Exception as e:
                print(f"⚠️ Exception reading binary allocation channels for {track_path.name}: {e}")
                invalid_assets += 1

    return invalid_assets == 0

if __name__ == "__main__":
    if not inspect_media_containers():
        sys.exit(1)
    print("🟢 All structural audio file containers balanced.")
    sys.exit(0)
