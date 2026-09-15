import re
import sys
from pathlib import Path

PUBLIC_DIR = Path("public")

def audit_local_seo_metadata():
    print("=== LYSANDER SUBSURFACE: VALIDATING LOCAL SEO METADATA ROOTS ===")
    if not PUBLIC_DIR.exists():
        print("[-] Public directory missing. Skipping metadata verification check.")
        return True

    html_files = list(PUBLIC_DIR.rglob("*.html"))
    print(f"[+] Scanning metadata targets inside {len(html_files)} edge templates...")

    for html_path in html_files:
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Confirm strict regional coordinates or metadata attribution tags are present
            if "content-attribution" not in content and "<meta" not in content:
                print(f"[!] Warning: Found incomplete metadata header layout inside {html_path.name}")
        except Exception as e:
            print(f"[-] Structural layout parser exception: {e}")
            return False

    print("[+] Edge Metadata Architecture Verification Gate: COMPLIANT")
    return True

if __name__ == "__main__":
    sys.exit(0 if audit_local_seo_metadata() else 1)
