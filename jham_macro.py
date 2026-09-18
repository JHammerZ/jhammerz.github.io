#!/usr/bin/env python3
import os
import sys
import json

def fetch_live_telemetry():
    src_file = "jham-ide/live_telemetry.json"
    if not os.path.exists(src_file):
        print("[-] Telemetry file path unallocated or offline.")
        return
    try:
        with open(src_file, "r") as f:
            data = json.load(f)
        print("==========================================================")
        print("     .JHAM CORE TELEMETRY HOT-KEY LOOKUP REPRIMER         ")
        print("==========================================================")
        print(f"[*] Core Identity   : {data.get('h_fid_identity', 'UNKNOWN')}")
        print(f"[*] Execution Frame : {data['metrics'].get('active_sync_frame', 0)}")
        print(f"[*] Matrix Latency  : {data['metrics'].get('aurelius_compute_latency_ms', '0.0ms')}")
        print(f"[*] Shield Status   : {data['metrics'].get('system_stability_flag', 'OFFLINE')}")
        print("==========================================================")
    except Exception as e:
        print(f"[-] Error reading memory registers: {e}")

if __name__ == "__main__":
    fetch_live_telemetry()
