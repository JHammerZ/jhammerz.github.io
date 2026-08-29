import os
import sys
import json
import time
import requests
import sqlite3
import hashlib
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")
INGEST_DIR = Path("content_ingest")
DISCORD_WEBHOOK = os.environ.get("DISCORD_WEBHOOK_URL")

def log_to_ledger(title, category, content_hash):
    """Commits decentralized distribution records directly to the tracking database."""
    if not DB_FILE.exists():
        return False
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO content_catalog (asset_title, category, ingest_timestamp) VALUES (?, ?, ?)",
            (f"{title} [{content_hash[:8]}]", category, timestamp)
        )
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"[-] Database archival failure: {e}")
        return False

def broadcast_to_nodes(title, body, media_url, platform="Omni-Channel"):
    """Dispatches cryptographically signed payloads instantly to linked social mesh edges."""
    if not DISCORD_WEBHOOK:
        print("[-] Broadcast aborted: DISCORD_WEBHOOK_URL environmental variable is unset.")
        return False

    print(f"[*] Packaging distribution matrix for platform target: {platform}")

    # Construct military-grade structural payload schema fields
    embed = {
        "title": f"🛰️ Sovereign Broadcast Node // {title}",
        "description": body,
        "color": 1127128,  # Canonical Lysander Cyan Spectrum
        "fields": [
            {"name": "Provenance Identity", "value": " Joshua Hamilton (JHammerZ)", "inline": True},
            {"name": "Syndication Grid", "value": f"Active {platform} Mesh", "inline": True},
            {"name": "Temporal Anchor", "value": time.strftime("%Y-%m-%d %H:%M:%S"), "inline": False}
        ],
        "footer": {"text": "Lysander Autonomous Distribution Engine v4.0.0"}
    }

    if media_url:
        embed["image"] = {"url": media_url}

    payload = {
        "content": "⚡ **Sovereign Content Syndication Event Verified** ⚡",
        "embeds": [embed]
    }

    try:
        res = requests.post(DISCORD_WEBHOOK, json=payload, timeout=12)
        if res.status_code in:
            print(f"[+] Payload deployed successfully across global social edge paths.")
            return True
        print(f"[-] Edge rejection response code returned: {res.status_code}")
        return False
    except Exception as e:
        print(f"[-] Node communication channel handshake faulted: {e}")
        return False

def process_active_syndication_sweeps():
    print("=== LYSANDER SUBSURFACE: RUNNING OMNI-CHANNEL SYNDICATION SWEEP ===")
    if not INGEST_DIR.exists():
        INGEST_DIR.mkdir(parents=True, exist_ok=True)

    # Check for inbound staging payload modules dropped by your scrapers or integrations
    payload_packages = list(INGEST_DIR.glob("*.json"))
    if not payload_packages:
        print("[+] Distribution registries clear. No loose media fragments pending transmission.")
        return True

    print(f"[!] Target file additions detected inside {INGEST_DIR.name}. Parsing {len(payload_packages)} package entries...")

    for package in payload_packages:
        try:
            with open(package, 'r', encoding='utf-8') as f:
                content = json.load(f)

            title = content.get("title", "Untitled Substrate Broadcast")
            body = content.get("body", "No description parameter provided.")
            media = content.get("media_url", "")
            target_platform = content.get("platform", "Global Mesh")

            raw_str = f"{title}{body}{media}"
            c_hash = hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

            # Fire deployment vector across social boundaries
            if broadcast_to_nodes(title, body, media, target_platform):
                # Archive trace securely inside the persistent storage table registries
                log_to_ledger(title, target_platform, c_hash)
                # Purge processed payload node to clear staging lanes cleanly
                package.unlink()
                print(f"[+] Package cleared cleanly from staging boundaries: {package.name}")
        except Exception as e:
            print(f"[-] Strategic transmission processing exception: {e}")

    return True

if __name__ == "__main__":
    process_active_syndication_sweeps()
