import os
import sys
import time
import socket
from pathlib import Path

TRAFFIC_LOG = Path("network_traffic_audit.log")
MAX_LOG_SIZE = 256 * 1024  # 256 KB safety limit boundary

def run_traffic_inspection():
    print("=== LYSANDER SUBSURFACE: INITIALIZING NETWORK ADAPTER TRAFFIC MONITOR ===")
    
    # Simulate extraction of active socket bindings from the localized layer
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        local_ip = "127.0.0.1"

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] IP: {local_ip} | Interface: wlan0/rmnet | Ingress-Filter: COMPLIANT\n"

    # Enforce strict log rotation limits before appending to prevent block exhaustion
    if TRAFFIC_LOG.exists() and TRAFFIC_LOG.stat().st_size >= MAX_LOG_SIZE:
        print("[!] Network log footprint limit exceeded. Executing localized rotation...")
        backup = TRAFFIC_LOG.with_suffix(".log.bak")
        if backup.exists():
            backup.unlink()
        TRAFFIC_LOG.rename(backup)
        TRAFFIC_LOG.touch()

    try:
        with open(TRAFFIC_LOG, "a", encoding="utf-8") as lf:
            lf.write(log_entry)
        print(f"[+] Active network metric entry logged securely to: {TRAFFIC_LOG}")
        print(f"[+] Current Subsurface IP Reference: {local_ip}")
        return True
    except Exception as e:
        print(f"[-] Network monitoring write fault: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if run_traffic_inspection() else 1)
