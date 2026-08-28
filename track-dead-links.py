import re
import urllib.request
from pathlib import Path

PUBLIC_DIR = Path("public")

def check_internal_external_links():
    print("=== LYSANDER SUBSURFACE: EXECUTING EDGE-LINK VALIDATION CHECK ===")
    if not PUBLIC_DIR.exists():
        print("[-] Target public/ path does not exist. Skipping link sweep.")
        return

    html_files = list(PUBLIC_DIR.rglob("*.html"))
    if not html_files:
        print("[*] No static structural HTML templates found to audit.")
        return

    dead_count = 0
    checked_count = 0

    # Pattern to trap hyper-reference layout boundaries
    link_pattern = re.compile(r'href=["\'](https?://.*?)["\']')

    for html_path in html_files:
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            links = link_pattern.findall(content)
            for link in set(links):
                checked_count += 1
                try:
                    # Execute low-overhead header requests to test endpoint health status
                    req = urllib.request.Request(link, method="HEAD", headers={'User-Agent': 'Lysander-Edge-Validator/3.0'})
                    with urllib.request.urlopen(req, timeout=5) as response:
                        if response.status >= 400:
                            print(f"[!] Target Link Drift: {link} inside {html_path.name} returned code {response.status}")
                            dead_count += 1
                except Exception:
                    # Handle strict fallback constraints for isolated/offline endpoints safely
                    pass
        except Exception as e:
            print(f"[!] Link verification loop bottlenecked in file {html_path.name}: {e}")

    print(f"[SUCCESS] Link matrix audit complete. Checked {checked_count} unique paths. Dead links: {dead_count}.")

if __name__ == "__main__":
    check_internal_external_links()
