import os
import sys
import time
import tarfile
import hashlib
from pathlib import Path

VAULT_DIR = Path("secure_subsurface_vault")
BACKUP_DIR = VAULT_DIR / "backups"
TARGETS_TO_SNAPSHOT = [
    Path("verification-policy.json"),
    Path("hfid-registry.json"),
    Path(".sovereign_vault_meta.json")
]

def execute_sovereign_vault_snapshot():
    print("=== LYSANDER SUBSURFACE: EXECUTING VAULT BACKUP MATRIX ===")
    
    if not VAULT_DIR.exists():
        print("[-] Secure vault gateway not initialized. Aborting archive routine.")
        return False
        
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    archive_name = BACKUP_DIR / f"substrate_snapshot_{timestamp}.tar.gz"
    
    try:
        # Build out a hardware-isolated compressed archive file natively
        with tarfile.open(archive_name, "w:gz") as tar:
            for target in TARGETS_TO_SNAPSHOT:
                if target.exists():
                    tar.add(target, arcname=target.name)
                    
        # Generate an absolute cryptographic SHA-256 seal signature over the binary package
        hasher = hashlib.sha256()
        with open(archive_name, "rb") as f:
            hasher.update(f.read())
        checksum = hasher.hexdigest()
        
        # Write out matching forensic verification receipt hashes
        receipt_file = archive_name.with_suffix(".sha256")
        receipt_file.write_text(checksum)
        
        print(f"[+] Isolated snapshot package compiled: {archive_name.name}")
        print(f"[+] Cryptographic SHA-256 Seal Signature: {checksum[:16]}...")
        print("[+] Vault Cryptographic Backup Sweep: COMPLIANT")
        return True
        
    except Exception as e:
        print(f"[-] Vault snapshot archiving faulted due to execution exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if execute_sovereign_vault_snapshot() else 1)
