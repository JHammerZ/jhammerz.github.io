import sys
import json
import hashlib
from pathlib import Path

BACKUP_DIR = Path("secure_subsurface_vault/backups")

def verify_backup_block_signatures():
    print("=== LYSANDER SUBSURFACE: VALIDATING VAULT SNAPSHOT INTEGRITY ===")
    if not BACKUP_DIR.exists():
        print("[+] Vault backup corridors clear. No compressed archive blocks pending.")
        return True
        
    snapshots = list(BACKUP_DIR.glob("*.tar.gz"))
    print(f"[+] Total Historical Snapshot Blocks Discovered: {len(snapshots)}")
    
    if not snapshots:
        print("[+] Storage partitions pristine. No offline archives found.")
        return True

    print("\n[*] Auditing Latest Cryptographic Block Seals:")
    latest_snapshot = max(snapshots, key=lambda p: p.stat().st_mtime)
    receipt_file = latest_snapshot.with_suffix(".sha256")
    
    if not receipt_file.exists():
        print(f"    [!] Security Anomaly: Verification receipt missing for {latest_snapshot.name}")
        return False
        
    try:
        # Re-compute the raw hash signature over the archive block binary tracks natively
        hasher = hashlib.sha256()
        with open(latest_snapshot, "rb") as f:
            hasher.update(f.read())
        computed_hash = hasher.hexdigest()
        recorded_hash = receipt_file.read_text().strip()
        
        print(f"    ├── Snapshot Source  : {latest_snapshot.name}")
        print(f"    ├── Recorded Signature: {recorded_hash[:16]}...")
        print(f"    └── Computed Signature: {computed_hash[:16]}...")
        
        if computed_hash == recorded_hash:
            print("\n[+] Verification Success: Cryptographic snapshot matches archival seal parameters.")
            print("[+] Vault Snapshot Block Validation Sweep: COMPLIANT")
            return True
        else:
            print("\n[-] CRITICAL CORRUPTION: Archive hash collision mismatch detected.")
            return False
    except Exception as e:
        print(f"[-] Forensic validation sweep exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if verify_backup_block_signatures() else 1)
