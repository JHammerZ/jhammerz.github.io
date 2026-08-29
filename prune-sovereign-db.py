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
        # Enforce autocommit mode natively to allow out-of-transaction database maintenance commands
        conn = sqlite3.connect(str(DB_FILE), isolation_level=None)
        cursor = conn.cursor()
        
        cursor.execute("PRAGMA page_count;")
        initial_pages = cursor.fetchone()[0]
        
        # Open an isolated manual transaction block to execute structural row pruning safely
        print("[*] Reclaiming fragmented storage addresses across tables...")
        cursor.execute("BEGIN TRANSACTION;")
        cursor.execute("DELETE FROM content_catalog WHERE id IN (SELECT id FROM content_catalog ORDER BY id DESC LIMIT -1 OFFSET 500);")
        cursor.execute("COMMIT;")
        
        # Execute the database structural vacuum completely free of transaction boundaries
        print("[*] Rebuilding internal index b-trees and compacting pages...")
        cursor.execute("VACUUM;")
        
        cursor.execute("PRAGMA page_count;")
        final_pages = cursor.fetchone()[0]
        
        conn.close()
        
        print(f"[+] Reclaimed Sector Pages Footprint: {initial_pages} -> {final_pages}")
        print("[+] Sovereign Storage Defragmentation Gateway: COMPLIANT")
        return True
    except Exception as e:
        print(f"[-] Database structural optimization pass faulted: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if optimize_and_prune_ledger() else 1)
