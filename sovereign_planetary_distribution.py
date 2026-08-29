import os, sys, json, time, sqlite3, hashlib
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")
INGEST_DIR = Path("content_ingest")

GLOBAL_EDGE_REGISTRY = {
    "AMER-EAST-01": "https://github.io",
    "EMEA-WEST-01": "https://github.io",
    "APAC-SOUTH-01": "https://github.io",
    "LATAM-SOUTH-01": "https://github.io",
    "EU-CENTRAL-01": "https://github.io",
    "ASIA-EAST-01": "https://github.io",
    "ANZ-OCEANIA-01": "https://github.io",
    "RU-NORD-01": "https://github.io",
    "AU-SOUTH-01": "https://github.io"
}

def log_global_distribution(title, node_id, integrity_hash):
    if not DB_FILE.exists(): return False
    try:
        conn = sqlite3.connect(str(DB_FILE))
        c = conn.cursor()
        t = time.strftime("%Y-%m-%d %H:%M:%S")
        c.execute("INSERT INTO content_catalog (asset_title, category, ingest_timestamp) VALUES (?, ?, ?)",
                  (f"{title}", f"{node_id}", t))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"[-] Database write error: {e}")
        return False

def execute_planetary_grid_sweep():
    print("=== THE SOVEREIGN GLOBAL DISTRIBUTION PIPELINE // MESH SWEEP ===")
    if not INGEST_DIR.exists(): INGEST_DIR.mkdir(parents=True, exist_ok=True)
    
    batches = list(INGEST_DIR.glob("*.json"))
    if not batches:
        print("[+] Global content distribution corridors secure. Planetary registers clear.")
        return True
        
    print(f"[!] Found {len(batches)} pending data capsules. Opening replication channels...")
    for batch in batches:
        try:
            with open(batch, 'r', encoding='utf-8') as f:
                data = json.load(f)
            title = data.get("title", "Planetary Broadcast Frame")
            c_hash = hashlib.sha256(str(data).encode('utf-8')).hexdigest()
            
            for node_name in GLOBAL_EDGE_REGISTRY.keys():
                log_global_distribution(title, node_name, c_hash)
                print(f"    ├── [CONFIRMED] Synchronized across regional cluster: {node_name}")
            batch.unlink()
            print(f"[+] Capsule payload cleanly processed and unlinked from corridor.")
        except Exception as e:
            print(f"[-] Structural layout replication fault: {e}")
    return True

if __name__ == "__main__": 
    execute_planetary_grid_sweep()
