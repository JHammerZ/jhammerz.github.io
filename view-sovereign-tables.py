import sqlite3
import sys
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")

def render_table_visualization():
    print("=== LYSANDER SUBSURFACE: PERSISTENT CATALOG MONITORING CHART ===")
    if not DB_FILE.exists():
        print("[-] Verification Error: Target metric ledger sovereign_metrics.db not initialized.")
        return False
        
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        
        # Pull table metadata information
        cursor.execute("PRAGMA table_info(content_catalog)")
        cols = [col[1] for col in cursor.fetchall()]
        
        if not cols:
            print("[-] Table structure anomaly detected: content_catalog contains no fields.")
            conn.close()
            return False
            
        # Fetch the complete active row contents from the table database
        cursor.execute("SELECT id, asset_title, category, ingest_timestamp FROM content_catalog ORDER BY id ASC")
        rows = cursor.fetchall()
        conn.close()
        
        # Enforce strict column formatting bounds for absolute grid scannability
        headers = ["ID", "ASSET TITLE / IDENTIFIER", "CATEGORY CORE", "TIMESTAMP"]
        w = [4, 28, 15, 12]
        
        # Draw upper border matrix line
        print(f"\033[1;36m┌{'─'*w[0]}┬{'─'*w[1]}┬{'─'*w[2]}┬{'─'*w[3]}┐\033[0m")
        print(f"\033[1;36m│\033[1;35m{headers[0]:^{w[0]}}\033[1;36m│\033[1;35m{headers[1]:^{w[1]}}\033[1;36m│\033[1;35m{headers[2]:^{w[2]}}\033[1;36m│\033[1;35m{headers[3]:^{w[3]}}\033[1;36m│\033[0m")
        print(f"\033[1;36m├{'─'*w[0]}┼{'─'*w[1]}┼{'─'*w[2]}┼{'─'*w[3]}┤\033[0m")
        
        if not rows:
            empty_msg = "NO OPERATIONAL DATA RECORDED IN LEDGER"
            print(f"\033[1;36m│\033[1;31m{empty_msg:^63}\033[1;36m│\033[0m")
        else:
            for r in rows:
                t_str = str(r[1])[:w[1]-2] + ".." if len(str(r[1])) > w[1] else str(r[1])
                c_str = str(r[2])[:w[2]-2] + ".." if len(str(r[2])) > w[2] else str(r[2])
                print(f"\033[1;36m│\033[0m {r[0]:<{w[0]-1}}\033[1;36m│\033[0m {t_str:<{w[1]-1}}\033[1;36m│\033[0m {c_str:<{w[2]-1}}\033[1;36m│\033[0m {r[3]:<{w[3]-1}}\033[1;36m│\033[0m")
                
        # Draw lower closure border line
        print(f"\033[1;36m└{'─'*w[0]}┴{'─'*w[1]}┴{'─'*w[2]}┴{'─'*w[3]}┘\033[0m")
        print("[+] Catalog Schema Extraction Inspection: COMPLIANT")
        return True
    except Exception as e:
        print(f"[-] Data matrix visual compilation faulted: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if render_table_visualization() else 1)
