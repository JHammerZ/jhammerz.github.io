import sqlite3
import sys
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")

def render_table_visualization(filter_category=None):
    print("=== THE SOVEREIGN GLOBAL DISTRIBUTION PIPELINE // DATA VIEW ===")
    if not DB_FILE.exists():
        print("[-] Verification Error: Target metric ledger sovereign_metrics.db not initialized.")
        return False
        
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        
        # Pull table schema definitions natively
        cursor.execute("PRAGMA table_info(content_catalog)")
        cols = cursor.fetchall()
        if not cols:
            print("[-] Table structure anomaly detected: content_catalog contains no fields.")
            conn.close()
            return False
            
        # Build query dynamically to inject category sorting filters across the planetary pipeline
        query = "SELECT id, asset_title, category, ingest_timestamp FROM content_catalog"
        params = []
        if filter_category:
            query += " WHERE category = ?"
            params.append(filter_category)
        query += " ORDER BY id ASC"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        # Enforce strict layout widths matching the master panel frame symmetry rules
        w = 18
        headers = ["ID", "ASSET TITLE / IDENTIFIER", "CATEGORY CORE", "TIMESTAMP"]
        
        print(f"\033[1;36m┌{'─'*w}┬{'─'*w}┬{'─'*w}┬{'─'*w}┐\033[0m")
        print(f"\033[1;36m│\033[1;35m{headers[0]:^{w}}\033[1;36m│\033[1;35m{headers[1]:^{w}}\033[1;36m│\033[1;35m{headers[2]:^{w}}\033[1;36m│\033[1;35m{headers[3]:^{w}}\033[1;36m│\033[0m")
        print(f"\033[1;36m├{'─'*w}┼{'─'*w}┼{'─'*w}┼{'─'*w}┤\033[0m")
        
        if not rows:
            empty_msg = "NO OPERATIONAL DATA COMPLIANT WITH FILTER TARGET"
            print(f"\033[1;36m│\033[1;31m{empty_msg:^75}\033[1;36m│\033[0m")
        else:
            for r in rows:
                i_str = str(r[0])[:w-2]
                t_str = str(r[1])[:w-2]
                c_str = str(r[2])[:w-2]
                ts_str = str(r[3])[:w-2]
                print(f"\033[1;36m│\033[0m {i_str:<{w-1}}│ {t_str:<{w-1}}│ {c_str:<{w-1}}│ {ts_str:<{w-1}}│")
                
        print(f"\033[1;36m└{'─'*w}┴{'─'*w}┴{'─'*w}┴{'─'*w}┘\033[0m")
        print(f"[+] Regional Sorting Matrix Application: {filter_category or 'ALL_NODES'}")
        return True
    except Exception as e:
        print(f"[-] Data matrix visual compilation faulted: {e}")
        return False

if __name__ == "__main__":
    # Check for direct console argument parameter injections to handle filters seamlessly
    cat_arg = sys.argv[1] if len(sys.argv) > 1 else None
    sys.exit(0 if render_table_visualization(cat_arg) else 1)
