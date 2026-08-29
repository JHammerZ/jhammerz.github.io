import sqlite3
import sys
import time
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")

def render_table_visualization(filter_category=None):
    # Capture initial performance counter timestamp at nanosecond resolution
    start_bench = time.perf_counter_ns()
    
    print("=== THE SOVEREIGN GLOBAL DISTRIBUTION PIPELINE // DATA VIEW ===")
    if not DB_FILE.exists():
        print("[-] Verification Error: Target metric ledger sovereign_metrics.db not initialized.")
        return False
        
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()
        
        cursor.execute("PRAGMA table_info(content_catalog)")
        if not cursor.fetchall():
            print("[-] Table structure anomaly detected: content_catalog contains no fields.")
            conn.close()
            return False
            
        query = "SELECT id, asset_title, category, ingest_timestamp FROM content_catalog"
        params = []
        if filter_category:
            query += " WHERE category LIKE ? OR asset_title LIKE ?"
            params.append(f"%{filter_category}%")
            params.append(f"%{filter_category}%")
        query += " ORDER BY id ASC"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        # Grid parameters: Symmetrical cell geometry layout matching master panel rules
        c1, c2, c3, c4 = 5, 34, 15, 20
        h1, h2, h3, h4 = "ID", "ASSET TITLE / IDENTIFIER", "CATEGORY CORE", "TIMESTAMP"
        
        print(f"\033[1;36m┌{'─'*c1}┬{'─'*c2}┬{'─'*c3}┬{'─'*c4}┐\033[0m")
        print(f"\033[1;36m│\033[1;35m{h1:<{c1}}\033[1;36m│\033[1;35m{h2:<{c2}}\033[1;36m│\033[1;35m{h3:<{c3}}\033[1;36m│\033[1;35m{h4:<{c4}}\033[1;36m│\033[0m")
        print(f"\033[1;36m├{'─'*c1}┼{'─'*c2}┼{'─'*c3}┼{'─'*c4}┤\033[0m")
        
        if not rows:
            empty_msg = "NO OPERATIONAL DATA COMPLIANT WITH FILTER TARGET"
            print(f"\033[1;36m│\033[1;31m{empty_msg:^77}\033[1;36m│\033[0m")
        else:
            for r in rows:
                i_str = str(r[0])[:c1]
                t_str = str(r[1])[:c2-3] + "..." if len(str(r[1])) > c2 else str(r[1])
                c_str = str(r[2])[:c3]
                ts_str = str(r[3])[:c4]
                print(f"\033[1;36m│\033[0m {i_str:<{c1-1}}\033[1;36m│\033[0m {t_str:<{c2-1}}\033[1;36m│\033[0m {c_str:<{c3-1}}\033[1;36m│\033[0m {ts_str:<{c4-1}}\033[1;36m│\033[0m")
                
        print(f"\033[1;36m└{'─'*c1}┴{'─'*c2}┴{'─'*c3}┴{'─'*c4}┘\033[0m")
        
        # Calculate full processing latency time window down to microseconds
        end_bench = time.perf_counter_ns()
        latency_ms = (end_bench - start_bench) / 1_000_000
        
        print(f"[+] Regional Sorting Matrix Application: {filter_category or 'ALL_NODES'}")
        print(f"[+] Ledger Query Render Efficiency    : \033[1;32m{latency_ms:.4f} ms\033[0m")
        return True
    except Exception as e:
        print(f"[-] Data matrix visual compilation faulted: {e}")
        return False

if __name__ == "__main__":
    cat_arg = sys.argv[1] if len(sys.argv) > 1 else None
    sys.exit(0 if render_table_visualization(cat_arg) else 1)
