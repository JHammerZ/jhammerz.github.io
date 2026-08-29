#!/usr/bin/env python3
import json
import urllib.request
import os

PLATFORMS = {
    "Spotify": "https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79",
    "AppleMusic": "https://music.apple.com/us/artist/jhammerz/1845705346",
    "AmazonMusic": "https://music.amazon.com/artists/B0D5GLL7NV/jhammerz",
    "BandLab": "https://www.bandlab.com/band/band8670133842983447",
    "YouTube": "https://www.youtube.com/@JHammerZ",
    "Instagram": "https://www.instagram.com/jhammerzz",
    "TikTok": "https://www.tiktok.com/@jhammerzz",
    "Facebook": "https://www.facebook.com/JHammerZz",
    "LinkedIn": "https://www.linkedin.com/in/JHammerZ",
    "GitHub": "https://github.com/JHammerZ/jhammerz.github.io",
    "Carrd": "https://jhammerz.carrd.co/",
    "Zenodo": "https://doi.org/10.5281/zenodo.20778079",
    "ORCID": "https://orcid.org/0009-0004-5273-7028"
}

def audit_feed_health():
    print("[*] Initializing Cross-Platform Social Feed Verification Loop...")
    results = {}
    for name, url in PLATFORMS.items():
        try:
            # Performs a direct handshake check against your live platform profile
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Lysander-Core-3.1)'})
            with urllib.request.urlopen(req, timeout=5) as response:
                status = "ACTIVE (200)" if response.status == 200 else f"FLAGGED ({response.status})"
                results[name] = {"status": status, "url": url}
        except Exception as e:
            results[name] = {"status": "OFFLINE_LIMIT", "error": str(e)}
    
    # ENFORCED FIX: Generate directories programmatically to avoid FileNotFoundError
    output_dir = "hfid/results"
    os.makedirs(output_dir, exist_ok=True)
    
    # Export state snapshot directly to matrix configuration layers
    output_path = os.path.join(output_dir, "social-matrix-snapshot.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print("[✓] Cross-platform social matrix snapshot synchronized.")

if __name__ == "__main__":
    audit_feed_health()
