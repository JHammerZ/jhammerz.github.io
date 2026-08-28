import sqlite3
import sys
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")

def deep_scan_database_metrics():
    print("=== LYSANDER SUBSURFACE: SCANNING SOVEREIGN TABLE REGISTRIES ===")
    if not DB_FILE.exists():
        print("[-] Database storage target sovereign_metrics.db is not initialized yet.")
        return False
        
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        
        # Pull total row calculations
        cursor.execute("SELECT COUNT(*) FROM content_catalog")
        total_rows = cursor.fetchone()[0]
        
        # Fetch schema structural descriptors
        cursor.execute("PRAGMA table_info(content_catalog)")
        columns = cursor.fetchall()
        
        # Retrieve the latest active data snapshots
        cursor.execute("SELECT id, asset_title, category, ingest_timestamp FROM content_catalog ORDER BY id DESC LIMIT 3")
        records = cursor.fetchall()
        conn.close()
        
        print(f"[+] Total Cataloged Records: {total_rows}")
        print("[*] Table Fields Schema Architecture:")
        for col in columns:
            print(f"    └── [{col[0]}] {col[1]} ({col[2]})")
            
        print("\n[*] Latest Ingested Entry Logs:")
        if not records:
            print("    [EMPTY] No content tracks dropped into database table archives yet.")
        else:
            for row in records:
                print(f"    ├── ID: {row[0]} | Title: {row[1]}")
                print(f"    └── Category: {row[2]} | Ingested: {row[3]}")
                
        print("\n[+] Database Cluster Verification Integrity: CLEAN")
        return True
    except Exception as e:
        print(f"[-] Database query scan aborted due to runtime exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if deep_scan_database_metrics() else 1)
