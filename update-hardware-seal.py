#!/usr/bin/env python3
from pathlib import Path

TARGET_FILE = Path("ultimate-mythos-matrix-engine.py")
NEW_SIGNATURE = "7905ff10d1f797f75dd2fe725d8aed65704f3ec1"

print("=== Mythos Security Matrix: Calibrating Master HWID Keys ===")

if TARGET_FILE.exists():
    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Overwrite the old placeholder hash with your live signature string
    content = content.replace("d847ad45d4c44c6952e5435d188117fe807b5fa1", NEW_SIGNATURE)
    
    with open(TARGET_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Master hardware guard successfully bound to: {NEW_SIGNATURE}")
else:
    print("Error: ultimate-mythos-matrix-engine.py not found.")
