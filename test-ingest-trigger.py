import json
from pathlib import Path

INGEST_DIR = Path("content_ingest")

def inject_mock_metadata():
    print("=== LYSANDER SUBSURFACE: GENERATING MOCK CONTENT DROP INGESTION ===")
    if not INGEST_DIR.exists():
        INGEST_DIR.mkdir(parents=True, exist_ok=True)
        
    mock_payload = {
        "title": "Lysander Substrate Protocol v3.0",
        "webpage_url": "https://github.com",
        "extractor_key": "SovereignEngine"
    }
    
    target_file = INGEST_DIR / "mock_release_metadata.json"
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(mock_payload, f, indent=4)
        
    print(f"[+] Dropped mock asset package metadata cleanly into: {target_file}")
    print("[+] Ready for processing via catalog_engine.py or watch-workspace.py")

if __name__ == "__main__":
    inject_mock_metadata()
