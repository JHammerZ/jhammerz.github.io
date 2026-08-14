import os
import sys
import json
import sqlite3
import datetime

DB_FILE = "sovereign_metrics.db"
INGEST_DIR = "content_ingest"

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
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "INSERT INTO content_catalog (asset_title, media_url, category, ingest_timestamp) VALUES (?, ?, ?, ?)",
        (title, url, category, now)
    )
    conn.commit()
    conn.close()

def parse_ingest_directory():
    print("Scanning 'content_ingest' for structural metadata profiles...")
    if not os.path.exists(INGEST_DIR):
        return

    json_files = [f for f in os.listdir(INGEST_DIR) if f.endswith('.json')]
    if not json_files:
        print("No local metadata packages found to parse.")
        return

    processed_count = 0
    for file_name in json_files:
        file_path = os.path.join(INGEST_DIR, file_name)
        try:
            with open(file_path, 'r') as f:
                payload = json.load(f)
            
            # Check if this is a standard yt-dlp metadata file
            if "webpage_url" in payload:
                title = payload.get("title", "Untitled Platform Asset")
                url = payload.get("webpage_url", "N/A")
                category = payload.get("extractor_key", "VideoPlatform")
                catalog_asset(title, url, category)
                processed_count += 1
            # Fallback to the original mock format
            elif "library_items" in payload:
                items = payload.get("library_items", [])
                for item in items:
                    catalog_asset(item.get("title"), item.get("url"), item.get("category"))
                    processed_count += 1
                
            os.remove(file_path)
        except Exception as e:
            print(f"[EXC] Failed to parse target structure {file_name}: {e}")

    print(f"[SUCCESS] Deep parsing completed. {processed_count} elements mapped to database storage.")

def print_text_dashboard():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, asset_title, category, media_url FROM content_catalog ORDER BY id DESC LIMIT 5;")
    rows = cursor.fetchall()
    conn.close()

    print("\n=== SYSTEM CONTENT CATALOG INDEX ===")
    if not rows:
        print("[EMPTY] No records cataloged yet.")
    else:
        for row in rows:
            print(f"ID: {row[0]} | Title: {row[1]} | Category: {row[2]}")
            print(f"  └─ Asset Reference: {row[3]}")
    print("====================================\n")

if __name__ == '__main__':
    init_catalog_table()
    parse_ingest_directory()
    print_text_dashboard()
