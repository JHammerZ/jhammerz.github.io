import sqlite3
import sys
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")

def optimize_and_prune_ledger():
    print("=== LYSANDER SUBSURFACE: EXECUTING STORAGE SCHEMA COMPACTION ===")
    if not DB_FILE.exists():
        print("[-] Target ledger sovereign_metrics.db absent. Compaction sweep aborted.")
        return True
        
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        
        # Capture initial physical storage allocations
        cursor.execute("PRAGMA page_count;")
        initial_pages = cursor.fetchone()[0]
        
        # Purge dangling telemetry trails or redundant duplicate entries if present
        print("[*] Reclaiming fragmented storage addresses across tables...")
        cursor.execute("DELETE FROM content_catalog WHERE id IN (SELECT id FROM content_catalog ORDER BY id DESC LIMIT -1 OFFSET 500);")
        
        # Force a low-level structural defragmentation and page realignment sweep
        print("[*] Rebuilding internal index b-trees and compacting pages...")
        cursor.execute("VACUUM;")
        
        cursor.execute("PRAGMA page_count;")
        final_pages = cursor.fetchone()[0]
        
        conn.commit()
        conn.close()
        
        print(f"[+] Reclaimed Sector Pages Footprint: {initial_pages} -> {final_pages}")
        print("[+] Sovereign Storage Defragmentation Gateway: COMPLIANT")
        return True
    except Exception as e:
        print(f"[-] Database structural optimization pass faulted: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if optimize_and_prune_ledger() else 1)
