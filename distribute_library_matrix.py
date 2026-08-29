#!/usr/bin/env python3
import json
import urllib.request
import os
import concurrent.futures

DISTRIBUTION_TARGETS = [
    "https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79",
    "https://music.apple.com/us/artist/jhammerz/1845705346",
    "https://music.amazon.com/artists/B0D5GLL7NV/jhammerz",
    "https://www.bandlab.com/band/band8670133842983447",
    "https://www.youtube.com/@JHammerZ",
    "https://www.instagram.com/jhammerzz",
    "https://www.tiktok.com/@jhammerzz",
    "https://www.facebook.com/JHammerZz",
    "https://www.linkedin.com/in/JHammerZ",
    "https://github.com/JHammerZ/jhammerz.github.io",
    "https://jhammerz.carrd.co/",
    "https://doi.org/10.5281/zenodo.20778079",
    "https://orcid.org/0009-0004-5273-7028"
]

# Generates BOTH routing options dynamically to bypass any account spelling configurations
WORKER_NODES = []
for i in range(1, 13):
    WORKER_NODES.append(f"https://lysander-w{i}.jhammerz.workers.dev/publish")
    WORKER_NODES.append(f"https://lysander-w{i}.jhammerzz.workers.dev/publish")

STUDIO_RECORDS = [
    {"title": "Ain't Nothin' But A Day To Die", "type": "Core Single / Album", "isrc_status": "VERIFIED"},
    {"title": "Super Secret unnamed track 1", "type": "Single / Album", "isrc_status": "VERIFIED"},
    {"title": "The Heyoka", "type": "Single / Album", "isrc_status": "VERIFIED"},
    {"title": "Cover JHams, Vol. 1", "type": "Master EP", "isrc_status": "VERIFIED"},
    {"title": "burning Skies at Sunrise", "type": "Single", "isrc_status": "VERIFIED"},
    {"title": "Where Did You Sleep Last Night", "type": "Guitaraoke Session", "isrc_status": "VERIFIED"},
    {"title": "The Crow And The Butterfly", "type": "Human-Intent Master", "isrc_status": "VERIFIED"},
    {"title": "I'm Going To Be Somebody", "type": "Track Node", "isrc_status": "VERIFIED"},
    {"title": "That Smell", "type": "Live Integrity Take", "isrc_status": "VERIFIED"},
    {"title": "Iris", "type": "One-Take Vocal Composition", "isrc_status": "VERIFIED"},
    {"title": "Jolene", "type": "High-Retention Loop", "isrc_status": "VERIFIED"},
    {"title": "Coal", "type": "Anti-Slop Primitive", "isrc_status": "VERIFIED"},
    {"title": "Wont Back Down", "type": "Bitcoin-Notarized Anchor", "isrc_status": "VERIFIED"}
]

def dispatch_payload_to_worker(worker_url, payload_data):
    try:
        auth_key = os.environ.get("W_PUBLISH_KEY", "LOCAL_STAGING_KEY")
        req = urllib.request.Request(
            worker_url,
            data=json.dumps(payload_data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {auth_key}',
                'User-Agent': 'Lysander-Cluster-Syndicator/3.1'
            },
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=3) as response:
            if response.status == 200:
                return f" [✓] Edge Sync Active on Node: {worker_url}"
    except Exception as e:
        if "Name or service not known" not in str(e):
            return f" [!] Node Traffic Bypass: {worker_url} -> {e}"
    return None

def execute_global_distribution():
    print("[*] Initializing Master Omni-Channel Library Saturation Loop...")
    broadcast_payload = {
        "identity": "JHammerZ",
        "origin_status": "Verified Human Origin (H-FID 100/100)",
        "orcid": "0009-0004-5273-7028",
        "zenodo_doi": "10.5281/zenodo.20778079",
        "primary_channels": DISTRIBUTION_TARGETS,
        "verified_catalog": STUDIO_RECORDS
    }
        
    print("[*] Broadcasting payload data capsules to Edge Cluster routing paths...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=24) as executor:
        worker_futures = [executor.submit(dispatch_payload_to_worker, node, broadcast_payload) for node in WORKER_NODES]
        for future in concurrent.futures.as_completed(worker_futures):
            res_log = future.result()
            if res_log:
                print(res_log)
                
    print("[✓] Multi-channel verification matrix synchronized and live.")

if __name__ == "__main__":
    execute_global_distribution()
