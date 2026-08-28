import json
import sys
from pathlib import Path

PLAYLIST_PATH = Path("public/assets/playlist.json")

def verify_playlist_schema():
    print("=== LYSANDER SUBSURFACE: VALIDATING PLAYLIST MATRIX SCHEMAS ===")
    if not PLAYLIST_PATH.exists():
        print("[-] Target ledger node public/assets/playlist.json is missing.")
        return False

    try:
        with open(PLAYLIST_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if "playlist_registry" not in data:
            print("[-] Schema Violation: Missing root 'playlist_registry' tracking array.")
            return False

        registry = data.get("playlist_registry", [])
        print(f"[+] Structural Validation Status: Schema Compliant ({len(registry)} Nodes Found)")
        return True
    except Exception as e:
        print(f"[-] Schema syntax parser exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if verify_playlist_schema() else 1)
