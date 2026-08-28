#!/usr/bin/env python3
"""
"""

import re
from pathlib import Path

TARGET_FILES = [
    Path("watch-workspace.py"),
    Path(".github/scripts/social_syndicator.py")
]

def optimize_script_strings(file_path):
    if not file_path.exists():
        return
        
    print(f"🧹 [LYSANDER REFACTOR]: Analyzing string density patterns for: {file_path.name}")
    content = file_path.read_text()
    
    # Identify hard-coded system targets that appear multiple times
    common_targets = [
        "socials-manifest.json",
        "public/assets/playlist.json",
        "watch-workspace.py"
    ]
    
    modified = False
    for target in common_targets:
        count = len(re.findall(target, content))
        # If a string literal appears more than twice, we safely refactor it
        if count > 2:
            var_name = f"LYS_CONST_{target.split('/')[-1].replace('.', '_').upper()}"
            if var_name not in content:
                print(f"⚙️ Extracting duplicate target '{target}' into global variable '{var_name}'...")
                # Insert the variable declaration at the top of the file layout
                content = f"{var_name} = \"{target}\"\n" + content.replace(f"\"{target}\"", var_name)
                modified = True
                
    if modified:
        file_path.write_text(content)
        print(f"✅ Clean-up complete. {file_path.name} refactored successfully.")
    else:
        print(f"📋 String density for {file_path.name} is already optimal.")

if __name__ == "__main__":
    for script in TARGET_FILES:
        optimize_script_strings(script)
