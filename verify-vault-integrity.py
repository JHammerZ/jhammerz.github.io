import sys
import json
import hashlib
from pathlib import Path

BACKUP_DIR = Path("secure_subsurface_vault/backups")
TELEMETRY_LOG = Path("secure_subsurface_vault/backup_telemetry.json")

def verify_backup_block_signatures():
    print("=== LYSANDER SUBSURFACE: VALIDATING VAULT SNAPSHOT INTEGRITY ===")
    
    # Enforce safe local partition discovery traps
    if not BACKUP_DIR.exists():
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        print("[+] Vault backup corridors initialized. No archival snapshot blocks pending.")
        return True
        
    snapshots = list(BACKUP_DIR.glob("*.tar.gz"))
    if not snapshots:
        print("[+] Storage partitions pristine. No offline backup archives found.")
        return True

    print(f"[*] Discovered {len(snapshots)} historical snapshot blocks. Running forensic verification...")
    
    # Audit latest chronological archival snapshot block allocation
    latest_snapshot = max(snapshots, key=lambda p: p.stat().st_mtime)
    receipt_file = latest_snapshot.with_suffix(".sha256")
    
    if not receipt_file.exists():
        print(f"    [!] Security Anomaly: Checksum receipt missing for {latest_snapshot.name}")
        return False
        
    try:
        # Re-compute binary stream hash signatures natively over the file block tracks
        hasher = hashlib.sha256()
        with open(latest_snapshot, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
                
        computed_hash = hasher.hexdigest()
        recorded_hash = receipt_file.read_text().strip()
        
        print(f"    ├── Snapshot Block : {latest_snapshot.name}")
        print(f"    ├── Recorded Seal  : {recorded_hash[:16]}...")
        print(f"    └── Computed Seal  : {computed_hash[:16]}...")
        
        is_compliant = computed_hash == recorded_hash
        
        telemetry_state = {
            "last_audit_epoch": int(sys.time() if hasattr(sys, 'time') else 1787964000),
            "target_archive": latest_snapshot.name,
            "integrity_status": "COMPLIANT" if is_compliant else "CORRUPTED"
        }
        TELEMETRY_LOG.write_text(json.dumps(telemetry_state, indent=4))
        
        if is_compliant:
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
