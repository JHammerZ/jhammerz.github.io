import json
import sys
from pathlib import Path

LOG_PATH = Path("network_traffic_audit.log")

def scan_local_threat_indicators():
    print("=== LYSANDER SUBSURFACE: SCANNING THREAT INTEL INDICATORS ===")
    
    suspicious_count = 0
    if LOG_PATH.exists():
        try:
            with open(LOG_PATH, 'r', encoding='utf-8') as f:
                logs = f.readlines()
            for line in logs:
                if any(term in line.lower() for term in ["deny", "block", "drop", "403"]):
                    suspicious_count += 1
        except Exception as e:
            print(f"[!] Log inspection exception: {e}")
            return False

    intel_report = {
        "intel_node": "H-FID_LOCAL_LOGGER",
        "ingress_anomalies_detected": suspicious_count,
        "perimeter_status": "SECURE" if suspicious_count == 0 else "DEFLECTING_TRAFFIC"
    }

    print(f"[+] Local Network Logs Analyzed: {LOG_PATH.name}")
    print(f"[+] Logged Security Deflection Counters: {suspicious_count}")
    print(f"[+] Structural Integrity Status: {intel_report['perimeter_status']}")
    return True

if __name__ == "__main__":
    sys.exit(0 if scan_local_threat_indicators() else 1)
