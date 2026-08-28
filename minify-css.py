#!/usr/bin/env python3
"""
===================================================================
     LYSANDER MINIFIER // HIGH-SPEED STYLESHEET LAYER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // PERFORMANCE INSULATION
===================================================================
"""

import re
import sys
from pathlib import Path

# Target style sheet vectors if compiled into dedicated folders
CSS_TARGET = Path("assets/style.css")

def condense_stylesheet():
    if not CSS_TARGET.exists():
        # Fallback inline generation check if assets/style.css is not hardcoded
        return

    print(f"⚡ [LYSANDER MINIFIER]: Compressing CSS metadata substrate payload...")
    try:
        raw_css = CSS_TARGET.read_text()
        
        # 1. Strip multi-line comments from the stylesheet text space
        cleaned_css = re.sub(r'/\*.*?\*/', '', raw_css, flags=re.DOTALL)
        
        # 2. Compress white spaces, line breaks, and trailing layout margins
        cleaned_css = re.sub(r'\s+', ' ', cleaned_css)
        cleaned_css = re.sub(r'\s*([\{\}:;])\s*', r'\1', cleaned_css)
        
        # Write back a fully condensed, single-line stylesheet output
        CSS_TARGET.write_text(cleaned_css.strip())
        print("✅ CSS stylesheet payload compacted successfully.")
    except Exception as e:
        print(f"❌ Minifier sequence skipped: {e}")

if __name__ == "__main__":
    condense_stylesheet()
