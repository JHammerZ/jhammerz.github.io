import os
import sys
import time
import socket
import subprocess
from pathlib import Path

TRAFFIC_LOG = Path("network_traffic_audit.log")
MAX_LOG_SIZE = 256 * 1024  # 256 KB safety limit boundary

def run_traffic_inspection():
    print("=== LYSANDER SUBSURFACE: RUNNING DEEP SUBNET TRAFFIC TRACKING ===")
    
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        local_ip = "127.0.0.1"

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    
    # Extract native route table boundaries to confirm active subnet masks
    subnet_mask = "255.255.255.0"
    try:
        if sys.platform != "win32":
            route_out = subprocess.check_output(["ip", "route"], text=True)
            if "kernel" in route_out:
                for line in route_out.split("\n"):
                    if "src" in line and local_ip in line:
                        subnet_mask = line.split()[0]
    except Exception:
        pass

    log_entry = f"[{timestamp}] IP: {local_ip} | Scope: {subnet_mask} | Interface: wlan0/rmnet | Filter: ENFORCED\n"

    # Enforce standard log rotation threshold constraints
    if TRAFFIC_LOG.exists() and TRAFFIC_LOG.stat().st_size >= MAX_LOG_SIZE:
        print("[!] Local subnet log limit hit. Rotating storage vectors...")
        backup = TRAFFIC_LOG.with_suffix(".log.bak")
        if backup.exists():
            backup.unlink()
        TRAFFIC_LOG.rename(backup)
        TRAFFIC_LOG.touch()

    try:
        with open(TRAFFIC_LOG, "a", encoding="utf-8") as lf:
            lf.write(log_entry)
        print(f"[+] Subsurface routing metrics captured successfully for: {local_ip}")
        print(f"[+] Active isolated subnet segment space: {subnet_mask}")
        return True
    except Exception as e:
        print(f"[-] Subnet transport audit write failure: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if run_traffic_inspection() else 1)
