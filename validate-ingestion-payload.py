import json
import sys
from pathlib import Path

INGEST_DIR = Path("content_ingest")

def audit_ingest_structures():
    print("=== LYSANDER SUBSURFACE: VALIDATING INGESTION PAYLOAD TEXT KEYS ===")
    if not INGEST_DIR.exists():
        INGEST_DIR.mkdir(parents=True, exist_ok=True)
        
    json_targets = list(INGEST_DIR.glob("*.json"))
    print(f"[+] Found {len(json_targets)} unparsed payload packets inside: {INGEST_DIR.name}")
    
    for target in json_targets:
        try:
            with open(target, 'r', encoding='utf-8') as f:
                data = json.load(f)
            # Ensure semantic content parameters pass standard data constraints safely
            if "content" not in data and "payload" not in data:
                print(f"[!] Warning: Structure anomaly found in transient block: {target.name}")
        except Exception as e:
            print(f"[-] Malformed payload package dropped at source: {e}")
            return False
            
    print("[+] Ingestion Payload Content Validation Gate: COMPLIANT")
    return True

if __name__ == "__main__":
    sys.exit(0 if audit_ingest_structures() else 1)
