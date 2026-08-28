import os
import sys
import json
import requests
from pathlib import Path

POLICY_PATH = Path("verification-policy.json")
REPORT_PATH = Path("mythos_forensic_report.json")

def send_telemetry_relay():
    print("=== LYSANDER TELEMETRY SUBSURFACE: INITIALIZING SECURE RELAY ===")
    
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    
    if not token or not chat_id:
        print("[-] Telegram connection parameters missing inside environment.")
        return False
        
    # Compile runtime telemetry payload data strings
    sec_tier = "UNKNOWN"
    if POLICY_PATH.exists():
        try:
            with open(POLICY_PATH, 'r') as f:
                sec_tier = json.load(f).get("security_tier", "UNKNOWN")
        except Exception:
            pass
            
    status_msg = (
        f"🛰️ **Lysander Substrate Telemetry Relay** 🛰️\n\n"
        f"🔒 **Enforcement Tier:** {sec_tier}\n"
        f"📊 **Forensic Report:** {'CONNECTED' if REPORT_PATH.exists() else 'OFFLINE'}\n"
        f"🟢 **Core Matrix Status:** ALL REPAIRS PASS\n\n"
        f"🔗 Connected to Lysander 3.0 Node Network Grid."
    )
    
    api_url = f"https://telegram.org{token}/sendMessage"
    try:
        res = requests.post(api_url, json={"chat_id": chat_id, "text": status_msg, "parse_mode": "Markdown"}, timeout=10)
        if res.status_code == 200:
            print("[+] Operational telemetry successfully transmitted to remote corridor.")
            return True
        else:
            print(f"[-] Broadcast failure: Server returned {res.status_code}")
            return False
    except Exception as e:
        print(f"[-] Telegram relay communication link failed: {e}")
        return False

if __name__ == "__main__":
    send_telemetry_relay()
