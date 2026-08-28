#!/usr/bin/env python3
"""
"""

import os
import sys
import json
import gzip
import re
import time
import subprocess
from pathlib import Path

SHIELD_SCRIPT = Path("secure-ingress-inspection.py")
NFDI_SCRIPT = Path("verify-nfdi-behavior.py")
SCRATCH_STAGE = Path(".net_ingress_stage.tmp")
PLAYLIST_FILE = Path("public/assets/playlist.json")

# Hardcoded High-Velocity Sovereign Profile Mesh (Absolute Footprint)
CANONICAL_TARGETS = {
    "spotify": "https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79",
    "apple_music": "https://music.apple.com/us/artist/jhammerz/1845705346",
    "amazon_music": "https://music.amazon.com/artists/B0D5GLL7NV/jhammerz",
    "bandlab": "https://www.bandlab.com/band/band8670133842983447",
    "youtube": "https://www.youtube.com/@JHammerZ",
    "instagram": "https://www.instagram.com/jhammerzz",
    "tiktok": "https://www.tiktok.com/@jhammerzz",
    "facebook": "https://www.facebook.com/JHammerZz",
    "linkedin": "https://www.linkedin.com/in/JHammerZ",
    "github": "https://github.com/JHammerZ/jhammerz.github.io",
    "carrd": "https://jhammerz.carrd.co/",
    "zenodo": "https://doi.org/10.5281/zenodo.20778079",
    "orcid": "https://orcid.org/0009-0004-5273-7028"
}

def harvest_and_rotate_mesh():
    headers = [
        "-A", "Mozilla/5.0 (Android; Mobile; rv:128.0) Gecko/128.0 Firefox/128.0",
        "-H", "Accept-Encoding: gzip, deflate"
    ]
    print(f"📡 [LYSANDER NET PROTOCOL]: Swapping connection paths across {len(CANONICAL_TARGETS)} nodes...")
    extracted_library = []

    for platform, url in CANONICAL_TARGETS.items():
        if platform in ["zenodo", "orcid", "linkedin", "github", "carrd"]: continue
        try:
            cmd = ["curl", "-s", "-L", "--connect-timeout", "6"] + headers + [url]
            res = subprocess.run(cmd, capture_output=True, timeout=15)
            
            if res.returncode == 0 and res.stdout:
                raw_bytes = res.stdout
                if raw_bytes.startswith(b'\x1f\x8b'):
                    decoded_text = gzip.decompress(raw_bytes).decode("utf-8", errors="ignore")
                else:
                    decoded_text = raw_bytes.decode("utf-8", errors="ignore")
                
                SCRATCH_STAGE.write_text(decoded_text)
                
                if NFDI_SCRIPT.exists() and subprocess.run([sys.executable, str(NFDI_SCRIPT)], stdout=subprocess.DEVNULL).returncode != 0: continue
                if SHIELD_SCRIPT.exists() and subprocess.run([sys.executable, str(SHIELD_SCRIPT)], stdout=subprocess.DEVNULL).returncode != 0: continue

                found_tokens = re.findall(r'video/(\d+)', decoded_text) or re.findall(r'watch\?v=([\w-]+)', decoded_text)
                for token in found_tokens[:3]:
                    extracted_library.append({
                        "id": f"{platform}_{token}",
                        "title": f"Sovereign Release Asset // {platform.upper()} Tracker",
                        "url": url if "watch" not in token else f"https://youtube.com{token}",
                        "notarized_timestamp": "2026-08-28T22:38:00Z"
                    })
                if SCRATCH_STAGE.exists(): SCRATCH_STAGE.unlink()
        except Exception as e:
            if SCRATCH_STAGE.exists(): SCRATCH_STAGE.unlink()

    if extracted_library and PLAYLIST_FILE.exists():
        try:
            current_data = json.loads(PLAYLIST_FILE.read_text())
            combined_pool = extracted_library + [item for item in current_data.get("playlist_registry", []) if item not in extracted_library]
            shift_factor = int(time.time() / 86400) % len(combined_pool)
            current_data["playlist_registry"] = combined_pool[shift_factor:] + combined_pool[:shift_factor]
            PLAYLIST_FILE.write_text(json.dumps(current_data, indent=2))
            print("✅ [ANTI-DECAY MATRIX SUCCESS]: Omnichannel library rotated cleanly.")
        except: pass

if __name__ == "__main__":
    harvest_and_rotate_mesh()
