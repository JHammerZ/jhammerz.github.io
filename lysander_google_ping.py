import os
import sys
import json
import requests
from pathlib import Path

POLICY_PATH = Path("verification-policy.json")

def verify_google_cloud_endpoint():
    print("=== LYSANDER SUBSURFACE: EXECUTING GCP CONTAINER TARGET VALIDATION ===")

    # Dynamically extract target parameters or fall back to standard project identity layouts
    project_id = "jhammerz-core-engine"
    region = "us-central1"

    # Read custom local validation descriptors if active
    if POLICY_PATH.exists():
        try:
            with open(POLICY_PATH, 'r') as f:
                cfg = json.load(f)
                print(f"[+] Operational Tier Identified: {cfg.get('security_tier')}")
        except Exception:
            pass

    # Construct the canonical Google Cloud Run distribution domain URL string
    target_url = f"https://mythos-matrix-core-latest-{project_id}.run.app/health"
    print(f"[*] Targeting Remote Asset Gateway Corridor: {target_url}")

    try:
        print("[*] Transmitting standard edge synchronization ping packet...")
        response = requests.get(target_url, timeout=8)
        print(f"[+] Transport response channel returned status code: {response.status_code}")
        if response.status_code == 200:
            print("[+] GCP Cloud Run Secondary Node: ACTIVE AND VALIDATED")
            return True
        else:
            print("[-] Edge container online but returned unexpected boundary parameters.")
            return False
    except requests.exceptions.Timeout:
        print("[-] Connection timed out: Edge proxy latency threshold exceeded.")
        return False
    except Exception as e:
        print(f"[-] Transport layer transmission link faulted: {e}")
        print("[!] Note: Endpoint will activate instantly upon the next automated GitHub Actions cron deployment.")
        return False

if __name__ == "__main__":
    verify_google_cloud_endpoint()
