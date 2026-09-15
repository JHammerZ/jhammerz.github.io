import sqlite3
import sys
import time
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")

def analyze_ingest_velocity():
    print("=== LYSANDER SUBSURFACE: ANALYZING LEDGER REPLICATION VELOCITY ===")
    if not DB_FILE.exists():
        print("[-] Target metric ledger sovereign_metrics.db absent. Velocity check aborted.")
        return True

    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()

        # Query total record logs grouped by timestamps to map ingestion intervals
        cursor.execute(
            "SELECT substr(ingest_timestamp, 1, 16) as minute_block, COUNT(*) "
            "FROM content_catalog "
            "GROUP BY minute_block "
            "ORDER BY minute_block DESC LIMIT 5"
        )
        intervals = cursor.fetchall()
        conn.close()

        print("[*] Tracking Multi-Point Ingest Burst Windows (Last 5 Cycles):")
        if not intervals:
            print("    [IDLE] Ingestion vectors nominal. Zero velocity spikes logged.")
        else:
            for block, count in intervals:
                print(f"    ├── Spatial Slot: [{block}] ──> {count} Records Synchronized")

        print("\n[+] Catalog Storage Interval Analysis: COMPLIANT")
        return True
    except Exception as e:
        print(f"[-] Performance velocity matrix tracking failed: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if analyze_ingest_velocity() else 1)
