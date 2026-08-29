import sqlite3
import sys
from pathlib import Path

DB_FILE = Path("sovereign_metrics.db")
MAX_RECORDS_THRESHOLD = 500  # Enforce cap on log table rows to protect hardware slots

def optimize_and_prune_ledger():
    print("=== LYSANDER SUBSURFACE: PERSISTENT DATABASE STORAGE VACUUM ===")
    if not DB_FILE.exists():
        print("[+] Storage ledger sovereign_metrics.db does not exist yet. Skipping sweep.")
        return True

    try:
        conn = sqlite3.connect(str(DB_FILE))
        cursor = conn.cursor()

        # Pull total row count calculation
        cursor.execute("SELECT COUNT(*) FROM content_catalog")
        current_rows = cursor.fetchone()[0]
        print(f"[+] Current Total Cataloged Records: {current_rows}")

        if current_rows > MAX_RECORDS_THRESHOLD:
            excess = current_rows - MAX_RECORDS_THRESHOLD
            print(f"[!] Storage threshold breached by {excess} entries. Purging oldest entries...")

            # Delete excess rows tracking oldest primary keys
            cursor.execute(
                "DELETE FROM content_catalog WHERE id IN (SELECT id FROM content_catalog ORDER BY id ASC LIMIT ?)",
                (excess,)
            )
            print(f"[+] Successfully purged {excess} legacy tracking database lines.")
        else:
            print(f"[+] Storage footprints compliant ({current_rows}/{MAX_RECORDS_THRESHOLD}). No trimming required.")

        # Run deep hardware vacuum to recapture space and optimize internal indexing
        print("[*] Rebuilding persistent data pages via isolated VACUUM call...")
        cursor.execute("VACUUM")

        conn.commit()
        conn.close()
        print("[+] Database Storage Optimization Sweep: COMPLIANT")
        return True
    except Exception as e:
        print(f"[-] Database archival optimization faulted due to runtime exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if optimize_and_prune_ledger() else 1)
