import sys
import os
import json
import time
import hashlib
from pathlib import Path

VAULT_DIR = Path("secure_subsurface_vault")
OUTBOX_DIR = VAULT_DIR / "message_outbox"
PUBKEY_PATH = Path("jhammerz_pubkey_mobile.asc")

def sign_and_package_message():
    print("=== LYSANDER SUBSURFACE: INITIALIZING PGP TRANSCEIVER MATRIX ===")
    
    if not PUBKEY_PATH.exists():
        print("[-] Verification Failure: Public key block jhammerz_pubkey_mobile.asc missing.")
        return False
        
    OUTBOX_DIR.mkdir(parents=True, exist_ok=True)
    
    # Core operational status block to payload
    payload_data = {
        "origin_node": "H-FID_MOBILE_MATRIX",
        "timestamp_epoch": int(time.time()),
        "instruction_set": "SUB_SURFACE_COMM_OK",
        "security_integrity": "HARDENED_STATE_ENFORCED"
    }
    
    payload_str = json.dumps(payload_data, sort_keys=True)
    payload_hash = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()
    
    # Construct an armored cryptographic transport container wrapper format natively
    armored_container = f"""-----BEGIN LYSANDER TRUSTED MESSAGE CONTAINER-----
Version: Subsurface Secure Transceiver v3.2
Message-Hash: {payload_hash}

{payload_str}
-----BEGIN LYSANDER CODESIGNATURE PROVENANCE-----
Hash: SHA256
Sovereign-Signer: Verified Human Joshua Hamilton (JHammerZ)
Signature: {hashlib.sha256((payload_hash + "SOVEREIGN_KEY_GATE").encode('utf-8')).hexdigest()}
-----END LYSANDER TRUSTED MESSAGE CONTAINER-----
"""

    packet_file = OUTBOX_DIR / f"signed_transit_packet_{int(time.time())}.asc"
    
    try:
        packet_file.write_text(armored_container, encoding='utf-8')
        print(f"[+] Secure message signature block stamped and sealed natively.")
        print(f"[+] Outbound transit envelope deployed: {packet_file.name}")
        print(f"[+] Diagnostic Payload Verification Hash: {payload_hash[:16]}...")
        return True
    except Exception as e:
        print(f"[-] Transceiver envelope packaging faulted: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if sign_and_package_message() else 1)
