#!/usr/bin/env python3
"""
"""

import json
import sys
from pathlib import Path

# Track target file locations inside your local workspace directory
METRIC_TARGETS = [
    Path(".metric_velocity_history.json"),
    Path(".compression_efficiency_history.json")
]

def rotate_system_ledgers():
    print("🧹 [LYSANDER STORAGE LAYER]: Initializing automated telemetry rotation sweep...")
    
    for ledger in METRIC_TARGETS:
        if not ledger.exists():
            continue
            
        print(f"⚙️ Auditing file record depth for: {ledger.name}")
        try:
            raw_data = json.loads(ledger.read_text())
            
            if isinstance(raw_data, list):
                record_count = len(raw_data)
                # Hard operational limit configuration gate (Max 50 historical nodes)
                if record_count > 50:
                    print(f"⚠️ Truncating record pool allocation for {ledger.name}: {record_count} -> 50 logs.")
                    truncated_data = raw_data[-50:]
                    ledger.write_text(json.dumps(truncated_data, indent=2))
                else:
                    print(f"✅ Ledger {ledger.name} is within safe density thresholds ({record_count}/50).")
            else:
                print(f"⚠️ Warning: Structural format mutation detected in {ledger.name}. Re-initializing baseline.")
                ledger.write_text(json.dumps([]))
        except Exception as e:
            print(f"❌ Failed to compact log metrics file {ledger.name}: {e}")

if __name__ == "__main__":
    rotate_system_ledgers()
