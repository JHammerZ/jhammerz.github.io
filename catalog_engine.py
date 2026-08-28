import os
import sys
import json
import sqlite3
import subprocess
from datetime import datetime

DB_FILE = "sovereign_metrics.db"
INGEST_DIR = "content_ingest"
PUBLIC_PLAYLIST = "public/assets/playlist.json"

def init_catalog_table():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS content_catalog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_title TEXT,
            media_url TEXT,
            category TEXT,
            ingest_timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

def catalog_asset(title, url, category):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO content_catalog (asset_title, media_url, category, ingest_timestamp)
        VALUES (?, ?, ?, ?)
    ''', (title, url, category, now))
    conn.commit()
    conn.close()

def parse_ingest_directory():
    print("[*] Scanning 'content_ingest' for structural metadata profiles...")
    if not os.path.exists(INGEST_DIR):
        os.makedirs(INGEST_DIR)
        return False

    json_files = [f for f in os.listdir(INGEST_DIR) if f.endswith('.json')]
    if not json_files:
        print("[*] No local metadata packages found to parse.")
        return False

    processed_count = 0
    for file_name in json_files:
        file_path = os.path.join(INGEST_DIR, file_name)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                payload = json.load(f)

            if "webpage_url" in payload:
                title = payload.get("title", "Untitled Platform Asset")
                url = payload.get("webpage_url", "N/A")
                category = payload.get("extractor_key", "VideoPlatform")
                catalog_asset(title, url, category)
                processed_count += 1
            elif "library_items" in payload:
                for item in payload.get("library_items", []):
                    catalog_asset(item.get("title"), item.get("url"), item.get("category"))
                    processed_count += 1
            
            os.remove(file_path)
        except Exception as e:
            print(f"[!] Failed to parse target structure {file_name}: {e}")

    print(f"[SUCCESS] Deep parsing completed. {processed_count} elements mapped to database storage.")
    return processed_count > 0

def sync_matrix_upstream():
    print("[*] Syncing local catalog state mutations upstream to global matrix...")
    try:
        # Export latest entries to the tracked public playlist to feed your web frontends
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.conn.cursor() if hasattr(conn, 'conn') else conn.cursor()
        cursor.execute("SELECT id, asset_title, media_url FROM content_catalog ORDER BY id DESC LIMIT 50")
        rows = cursor.fetchall()
        conn.close()

        registry = [{"id": str(r[0]), "title": r[1], "url": r[2]} for r in rows]
        
        with open(PUBLIC_PLAYLIST, 'w', encoding='utf-8') as pf:
            json.dump({"playlist_registry": registry}, pf, indent=4)

        # Trigger your global git synchronization chain natively
        subprocess.run(["git", "add", PUBLIC_PLAYLIST, DB_FILE], check=True)
        subprocess.run(["git", "commit", "-m", "sync: compile edge catalog updates into repository matrix"], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("[+] Global matrix synchronization completed successfully.")
    except Exception as e:
        print(f"[!] Git asset tracking pipeline failed: {e}")

def print_text_dashboard():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, asset_title, category, media_url FROM content_catalog ORDER BY id DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()

    print("\n=== SYSTEM CONTENT CATALOG INDEX ===")
    if not rows:
        print("[EMPTY] No records cataloged yet.")
    else:
        for row in rows:
            print(f"ID: {row[0]} | Title: {row[1]} | Category: {row[2]}")
            print(f"└── Asset Reference: {row[3]}\n")

if __name__ == "__main__":
    init_catalog_table()
    changes_made = parse_ingest_directory()
    if changes_made:
        sync_matrix_upstream()
    print_text_dashboard()
