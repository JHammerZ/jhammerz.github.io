import os
import sys
import time
import subprocess
from pathlib import Path

INGEST_DIR = Path("content_ingest")
WATCH_INTERVAL = 5

def start_watch_loop():
    print(f"=== LYSANDER SUBSTRATE WATCHDOG: MONITORING {INGEST_DIR} ===")
    if not INGEST_DIR.exists():
        INGEST_DIR.mkdir(parents=True, exist_ok=True)

    try:
        while True:
            # Check for any lingering metadata files waiting for serialization
            json_files = list(INGEST_DIR.glob("*.json"))
            if json_files:
                print(f"[!] Target file additions detected inside {INGEST_DIR}. Launching catalog engine...")
                
                # Execute the corrected database engine matrix natively
                subprocess.run(["python3", "catalog_engine.py"])
                
                # Synchronize local dashboard states instantly
                subprocess.run(["python3", "ultimate-mythos-matrix-engine.py"])
                
            time.sleep(WATCH_INTERVAL)
    except KeyboardInterrupt:
        print("\n[-] Watchdog loop paused cleanly by user interrupt signal.")
    except Exception as e:
        print(f"[!] Watchdog pipeline execution faulted: {e}")

if __name__ == "__main__":
    start_watch_loop()
