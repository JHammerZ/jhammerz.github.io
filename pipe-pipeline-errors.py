#!/usr/bin/env python3
"""
Purpose:
Intercepts subsurface process failures and pipes forensic telemetry
data directly into error_ledger.json within your master repository.
"""

import sys
import json
import time
import subprocess
from pathlib import Path

ERROR_LEDGER = Path("error_ledger.json")

def pipe_exception_to_pipeline(component_name, error_message):
    print(f"📡 [LYSANDER ERROR CORRIDOR]: Intercepted fault in component [{component_name}]. Piping to ledger...")
    
    # 1. Structure the military-grade error signature log
    error_packet = {
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "component": component_name,
        "payload_trace": str(error_message),
        "status": "unresolved"
    }
    
    # 2. Append metrics to the active pipeline tracking ledger
    ledger_data = []
    if ERROR_LEDGER.exists():
        try:
            ledger_data = json.loads(ERROR_LEDGER.read_text())
            if not isinstance(ledger_data, list):
                ledger_data = []
        except:
            pass
            
    ledger_data.append(error_packet)
    # Restrict to the last 20 traces to optimize distribution speeds
    ERROR_LEDGER.write_text(json.dumps(ledger_data[-20:], indent=2))
    print(f"✅ Forensic error log cleanly anchored into your repository pipeline footprint.")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        pipe_exception_to_pipeline(sys.argv[1], sys.argv[2])
    else:
        print("📋 Error corridor idle. No inbound payload traces passed.")
