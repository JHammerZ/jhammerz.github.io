import json
import sys
from pathlib import Path

PLAYLIST_PATH = Path("public/assets/playlist.json")

def curate_and_sort_playlist():
    print("=== LYSANDER SUBSURFACE: OPTIMIZING PLAYLIST MANIFEST ARCHITECTURE ===")
    if not PLAYLIST_PATH.exists():
        print("[-] Target ledger node public/assets/playlist.json does not exist yet.")
        return True

    try:
        with open(PLAYLIST_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)

        registry = data.get("playlist_registry", [])
        initial_count = len(registry)

        # Deduplicate tracks by unique URL values while keeping the order intact
        seen_urls = set()
        clean_registry = []

        for item in registry:
            url = item.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                clean_registry.append(item)

        final_count = len(clean_registry)
        data["playlist_registry"] = clean_registry

        # Rewrite the manifest with compact, uniform schema alignment
        with open(PLAYLIST_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)

        print(f"[+] Scan Complete: Found {initial_count} items in manifest registry.")
        print(f"[+] Pruning Complete: Cleaned {initial_count - final_count} redundant entries.")
        print(f"[+] Manifest Optimization Status: COMPLIANT ({final_count} Active Nodes)")
        return True
    except Exception as e:
        print(f"[-] Structural manifest curation exception: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if curate_and_sort_playlist() else 1)
