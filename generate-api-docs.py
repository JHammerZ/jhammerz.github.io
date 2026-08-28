#!/usr/bin/env python3
"""
===================================================================
     LYSANDER DOCUMENTATION CORE // AUTOMATED API GENERATOR
     DESIGN DEPTH: LEVEL 5 PRODUCTION // AUTO-MAINTAINED SPECS
===================================================================
Purpose:
Sweeps the system workspace, extracts operational headers, and
compiles an uncompromised master markdown API specification.
"""

import re
from pathlib import Path

OUTPUT_FILE = Path("API_SPECIFICATION.md")

def build_specification_matrix():
    print("📋 [LYSANDER SPECIFICATION CORE]: Initializing automated documentation build...")
    
    md_content = [
        "# ⚡ JHammerZ Sovereign System Automation Suite // API & Utility Specification",
        f"*Automatically updated by the local background daemon engine.*\n",
        "## 🛡️ Core Architecture Blueprint Matrix",
        "The following manifest lists every active production-grade utility executing within the Termux local subsurface and remote GitHub CDN layers.\n"
    ]
    
    # Track the active utilities we want to chart
    target_scripts = sorted(list(Path(".").glob("*.py")) + list(Path(".").glob("*.sh")))
    
    for script in target_scripts:
        if script.name in ["generate-api-docs.py", "patch-hardware-theme.py", "patch-og-metadata.py"]:
            continue
            
        print(f"⚙️ Parsing docstrings and header parameters from: {script.name}")
        content = script.read_text(errors='ignore')
        
        # Extract standard multi-line string blocks or comment blocks at the top
        purpose_match = re.search(r'"""(.*?)"""', content, re.DOTALL)
        if not purpose_match:
            purpose_match = re.search(r'# =+[\r\n](#.*[\r\n])+# =+', content)
            
        purpose = purpose_match.group(1).strip() if purpose_match else "No active header documentation found."
        # Clean formatting spaces for clean Markdown rendering
        purpose = "\n".join([line.strip() for line in purpose.split("\n") if "====" not in line])

        md_content.append(f"### 📦 `{script.name}`")
        md_content.append(f"```text\n{purpose}\n```\n")

    OUTPUT_FILE.write_text("\n".join(md_content))
    print(f"✅ Master system specification safely written to {OUTPUT_FILE.name}")

if __name__ == "__main__":
    build_specification_matrix()
