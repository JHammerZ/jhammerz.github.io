import os
import sys
import time
import requests
import subprocess
from pathlib import Path

INGEST_DIR = Path("content_ingest")
WATCH_INTERVAL = 5

def broadcast_alert(message):
    webhook = os.environ.get("DISCORD_WEBHOOK_URL")
    if webhook:
        payload = {"content": f"⚡ **Lysander System Notification** ⚡\n{message}"}
        try:
            requests.post(webhook, json=payload, timeout=10)
        except Exception as e:
            print(f"! Webhook notification failed to deliver: {e}")

def run_single_sweep():
    if not INGEST_DIR.exists():
        INGEST_DIR.mkdir(parents=True, exist_ok=True)
    json_files = list(INGEST_DIR.glob("*.json"))
    if json_files:
        print(f"[!] Target file additions detected inside {INGEST_DIR}. Launching catalog engine...")
        result = subprocess.run(["python3", "catalog_engine.py"], capture_output=True, text=True)
        print(result.stdout)
        subprocess.run(["python3", "ultimate-mythos-matrix-engine.py"])
        broadcast_alert(f"Automated ingestion completed successfully.\nProcessed `{len(json_files)}` raw metadata packages into the global repository state.")
    return True

def start_watch_loop():
    print(f"=== LYSANDER SUBSTRATE WATCHDOG: MONITORING {INGEST_DIR} ===")
    try:
        while True:
            run_single_sweep()
            time.sleep(WATCH_INTERVAL)
    except KeyboardInterrupt:
        print("\n[-] Watchdog loop paused cleanly by user interrupt signal.")
    except Exception as e:
        print(f"[!] Watchdog pipeline execution faulted: {e}")

if __name__ == "__main__":
    # If executed within the automated test-matrix context, exit instantly after a single sweep
    if "--check-only" in sys.argv or any("test" in arg for arg in sys.argv):
        print("[+] Test-Matrix Boundary Detected: Running isolated sweep pass...")
        run_single_sweep()
        sys.exit(0)
    else:
        start_watch_loop()
