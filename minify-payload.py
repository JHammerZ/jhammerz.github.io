#!/usr/bin/env python3
"""
===================================================================
     LYSANDER MINIFIER // HIGH-SPEED PAYLOAD LAYER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // AUTOMATED OPTIMIZATION
===================================================================
"""

import json
from pathlib import Path

TARGET_FILE = Path("public/assets/playlist.json")

def compress_payload():
    if not TARGET_FILE.exists():
        return
        
    print(f"⚡ [LYSANDER MINIFIER]: Compressing JSON metadata substrate payload...")
    try:
        # Load raw data structures
        raw_data = json.loads(TARGET_FILE.read_text())
        
        # Write back a fully condensed, zero-whitespace single-line layout string
        compressed_text = json.dumps(raw_data, separators=(',', ':'))
        TARGET_FILE.write_text(compressed_text)
        print("✅ Metadata payload compacted successfully.")
    except Exception as e:
        print(f"❌ Minifier sequence skipped: {e}")

if __name__ == "__main__":
    compress_payload()
