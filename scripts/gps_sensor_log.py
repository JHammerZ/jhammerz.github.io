#!/usr/bin/env python3
import os
import sys
import json
import time

LOG_FILE = "/data/data/com.termux/files/home/.diode_runtime.log"
VAULT_DIR = "/root/.aure_vault"
GPS_OUTPUT = f"{VAULT_DIR}/.gps_telemetry.json"

print("\033[1;34m[*] Accessing Onboard Mobile GPS Hardware Tracking Arrays...\033[0m")

# Read the latest telemetry log passed through from the Termux sensor hook
if os.path.exists(LOG_FILE):
    try:
        with open(LOG_FILE, "r") as f:
            raw_data = f.read().strip()
        # Parse the native Android location JSON output payload strings
        gps_data = json.loads(raw_data)
        
        clean_metrics = {
            "epoch_sync": int(time.time()),
            "latitude": gps_data.get("latitude", 0.0),
            "longitude": gps_data.get("longitude", 0.0),
            "altitude": gps_data.get("altitude", 0.0),
            "speed": gps_data.get("speed", 0.0),
            "bearing": gps_data.get("bearing", 0.0)
        }
        
        with open(GPS_OUTPUT, "w") as gf:
            json.dump(clean_metrics, gf, indent=2)
            
        print(f"  -> \033[1;32m[SUCCESS]\033[0m Location metrics locked to disk registers.")
        print(f"     Lat: {clean_metrics['latitude']} | Lon: {clean_metrics['longitude']} | Speed: {clean_metrics['speed']} m/s")
    except Exception as e:
        print("  -> \033[1;33m[TELEMETRY WAIT]\033[0m Awaiting fresh baseband coordinates fix from Android hardware chip layer.")
else:
    print("  -> \033[1;31m[ERROR]\033[0m Location log buffer data empty. Ensure Termux-API services are initialized.")
