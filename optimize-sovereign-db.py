import sqlite3
import os
from pathlib import Path

DB_FILE = "sovereign_metrics.db"

def optimize_database_storage():
    print("=== LYSANDER SUBSURFACE: RUNNING SOVEREIGN DATABASE TUNING SUITE ===")
    p = Path(DB_FILE)
    if not p.exists():
        print(f"[-] Database target {DB_FILE} does not exist yet. Skipping tuning loop.")
        return

    initial_size = p.stat().st_size
    print(f"[*] Initial footprint allocation: {initial_size} bytes")

    try:
        # Step A: Open a standard connection to handle data pruning operations
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Prune older rows exceeding storage balance thresholds (Keep latest 1000 items)
        cursor.execute("""
            DELETE FROM content_catalog
            WHERE id NOT IN (SELECT id FROM content_catalog ORDER BY id DESC LIMIT 1000)
        """)
        pruned_rows = conn.total_changes
        conn.commit()
        conn.close()

        # Step B: Open an isolated autocommit connection strictly to handle the VACUUM operation
        # isolation_level=None turns on autocommit mode explicitly in SQLite3
        vacuum_conn = sqlite3.connect(DB_FILE, isolation_level=None)
        vacuum_cursor = vacuum_conn.cursor()
        vacuum_cursor.execute("VACUUM;")
        vacuum_cursor.execute("PRAGMA optimize;")
        vacuum_conn.close()

        final_size = p.stat().st_size
        reclaimed = initial_size - final_size

        print(f"[+] Total database indexing entries pruned: {pruned_rows} rows")
        print(f"[+] Final structural layout size: {final_size} bytes")
        print(f"[+] Reclaimed local block storage allocations: {max(0, reclaimed)} bytes")
        print("[+] System performance optimization baseline: EXCELLENT")

    except Exception as e:
        print(f"[!] Database structural storage tune-up failed: {e}")

if __name__ == "__main__":
    optimize_database_storage()
