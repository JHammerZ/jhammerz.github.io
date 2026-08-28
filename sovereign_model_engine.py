import json
import os
import sys
from pathlib import Path

REPORT_PATH = Path("mythos_forensic_report.json")
OUTPUT_METRICS = Path("public/assets/model_state.json")

def compile_core_data_repository():
    print("=== SOVEREIGN INTELLIGENCE GATE: COMPILING CORE DATA REPOSITORY ===")

    # Initialize unified state payload metadata
    model_payload = {
        "engine_version": "3.0.0",
        "substrate_tier": "SOVEREIGN_SUBSTRATE",
        "last_compiled_timestamp": None,
        "integrity_check": "SECURE"
    }

    if REPORT_PATH.exists():
        try:
            with open(REPORT_PATH, 'r') as f:
                report_data = json.load(f)
            # Pull down the latest operational timestamp metrics safely
            model_payload["last_compiled_timestamp"] = report_data.get("timestamp")
            print("[+] Successfully synced timestamp data from forensic ledger archives.")
        except Exception as e:
            print(f"[!] Warning: Failed to unpack active forensic ledger fields: {e}")

    # Serialize compilation matrix state into target assets directory
    try:
        os.makedirs(str(OUTPUT_METRICS.parent), exist_ok=True)
        with open(OUTPUT_METRICS, 'w', encoding='utf-8') as mf:
            json.dump(model_payload, mf, indent=4)
        print(f"[+] Operational model state ledger compiled successfully to: {OUTPUT_METRICS}")
        return True
    except Exception as e:
        print(f"[-] Data matrix aggregation runtime fault: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if compile_core_data_repository() else 1)
