#!/usr/bin/env python3
"""
===================================================================
     LYSANDER MINIFIER // HIGH-SPEED HTML INTERFACE LAYER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // PERFORMANCE INSULATION
===================================================================
Purpose:
Sweeps primary HTML views, strips trailing margins and comments,
and condenses layouts into clean, zero-bloat delivery packages.
"""

import re
import sys
from pathlib import Path

TARGET_VIEWS = [
    Path("index.html"),
    Path("music.html")
]

def condense_html_structures():
    print("⚡ [LYSANDER MINIFIER]: Analyzing layout densities for static HTML pages...")
    
    for view in TARGET_VIEWS:
        if not view.exists():
            continue
            
        print(f"⚙️ Compressing code text blocks inside view: {view.name}")
        try:
            raw_html = view.read_text(errors="ignore")
            
            # 1. Safely protect your explicit structural injection tokens from minifier destruction
            protected_tokens = ["<!-- VIDEO_DECK_START -->", "<!-- VIDEO_DECK_END -->"]
            for token in protected_tokens:
                raw_html = raw_html.replace(token, f"\n{token}\n")
                
            # 2. Strip multi-line documentation markup comments (excluding IE condition blocks)
            cleaned_html = re.sub(r'<!--(?!\[if).*?-->', '', raw_html, flags=re.DOTALL)
            
            # 3. Collapse consecutive whitespace spaces and line breaks into ultra-dense rows
            lines = [line.strip() for line in cleaned_html.splitlines() if line.strip()]
            condensed_html = "\n".join(lines)
            
            view.write_text(condensed_html)
            print(f"✅ Structural footprint condensed successfully for {view.name}")
        except Exception as e:
            print(f"❌ HTML minification thread exception on {view.name}: {e}")
            return False
            
    return True

if __name__ == "__main__":
    if not condense_html_structures():
        sys.exit(1)
    sys.exit(0)
