import re
import os
from pathlib import Path

PUBLIC_DIR = Path("public")

def process_minify_matrix():
    print("=== LYSANDER SUBSURFACE: RUNNING HTML COMPACTION PIPELINE ===")
    if not PUBLIC_DIR.exists():
        print("[-] Target public/ production path is missing. Skipping processing.")
        return

    html_files = list(PUBLIC_DIR.rglob("*.html"))
    if not html_files:
        print("[*] No static structural HTML views found to compress.")
        return

    for html_path in html_files:
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            initial_chars = len(content)
            
            # Execute aggressive space compaction and comment strip parsing loops
            content = re.sub(r'<!--#(.*?)-->', '', content)  # Shield Server Side Includes (SSI)
            content = re.sub(r'<!--(?!\s*#)(?:(?!-->).)*-->', '', content, flags=re.DOTALL) # Strip HTML comments
            content = re.sub(r'\s+', ' ', content)  # Collapse whitespace clusters
            content = content.replace('> <', '><') # Compact tag boundaries
            
            final_chars = len(content)
            saved = initial_chars - final_chars
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(content.strip())
                
            print(f"[+] Minified: {html_path.relative_to(PUBLIC_DIR)} | Reclaimed {saved} characters.")
        except Exception as e:
            print(f"[!] Compilation bottleneck inside template {html_path.name}: {e}")

if __name__ == "__main__":
    process_minify_matrix()
