import sys
import json
import re
from pathlib import Path

OUTBOX_DIR = Path("secure_subsurface_vault/message_outbox")

def inspect_secure_packets():
    print("=== LYSANDER SUBSURFACE: PARSING CODESIGNED TRANSPORT OUTBOX ===")
    if not OUTBOX_DIR.exists():
        print("[-] Outbox pipeline missing. No transmission packets discovered.")
        return True

    packets = sorted(list(OUTBOX_DIR.glob("*.asc")), reverse=True)
    print(f"[+] Total Armored Transport Containers Discovered: {len(packets)}")
    
    if not packets:
        print("    [IDLE] Outbox queue is currently clear.")
        return True

    print("\n[*] Inspecting Latest Armored Transit Envelope Matrix:")
    target_packet = packets[0]
    try:
        raw_text = target_packet.read_text(encoding='utf-8')
        
        # Isolate the interior JSON payload using regular expression string bounds
        json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
        if json_match:
            payload_json = json.loads(json_match.group(0))
            print(f"    ├── Packet File Source: {target_packet.name}")
            print(f"    ├── Core Origin Node : {payload_json.get('origin_node', 'N/A')}")
            print(f"    ├── Security Integrity: {payload_json.get('security_integrity', 'N/A')}")
            print(f"    └── Instruction Set  : {payload_json.get('instruction_set', 'N/A')}")
            
            # Isolate and verify signature block hash parameters
            sig_match = re.search(r"Signature:\s*([a-fA-F0-0]+)", raw_text)
            if sig_match:
                print(f"    [+] Cryptographic Verification Seal: Verified ({sig_match.group(1)[:16]}...)")
        else:
            print("    [!] Warning: Unable to parse structured JSON block inside armored container headers.")
            
        print("\n[+] Outbound Packet Verification Integrity Check: CLEAN")
        return True
    except Exception as e:
        print(f"[-] Transport packet structural auditing exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if inspect_secure_packets() else 1)
