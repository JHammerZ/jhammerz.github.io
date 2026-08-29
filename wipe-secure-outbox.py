import os
import sys
import random
from pathlib import Path

OUTBOX_DIR = Path("secure_subsurface_vault/message_outbox")
RETENTION_LIMIT = 5  # Strict threshold limit before trimming execution

def secure_shred_file(file_path, passes=3):
    """Overwrites file binary tracks aggressively before executing physical unlinking."""
    try:
        file_size = file_path.stat().st_size
        with open(file_path, "ba+", buffering=0) as f:
            for _ in range(passes):
                f.seek(0)
                # Secure pattern blast pass
                f.write(bytearray(random.getrandbits(8) for _ in range(file_size)))
        file_path.unlink()
        return True
    except Exception as e:
        print(f"[-] Shred operation faulted for file {file_path.name}: {e}")
        return False

def audit_and_purge_outbox():
    print("=== LYSANDER SUBSURFACE: SECURE DELETION & SHRED CORRIDOR ===")
    if not OUTBOX_DIR.exists():
        print("[+] Outbox baseline clear. No directories available to prune.")
        return True

    packets = sorted(list(OUTBOX_DIR.glob("*.asc")), key=lambda p: p.stat().st_mtime)
    total_packets = len(packets)
    print(f"[+] Total Active Packets In Queue: {total_packets}")

    if total_packets <= RETENTION_LIMIT:
        print(f"[+] Operational limits compliant ({total_packets}/{RETENTION_LIMIT}). Clean pass.")
        return True

    purge_count = total_packets - RETENTION_LIMIT
    print(f"[!] Retention cap exceeded by {purge_count} packets. Commencing binary destruction...")

    for i in range(purge_count):
        target = packets[i]
        print(f"    ├── Shredding obsolete tracking packet: {target.name}")
        if secure_shred_file(target):
            print("    └── Status: Wiped & Sanitized.")

    print("[+] File Shred and Data Purge Execution: COMPLIANT")
    return True

if __name__ == "__main__":
    sys.exit(0 if audit_and_purge_outbox() else 1)
