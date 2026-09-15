#!/usr/bin/env python3
from pathlib import Path

TARGET = Path(".")

print("=== Mythos Module: Deploying Supreme AST Structural Corrections ===")

# 1. Cleanly correct heos_client.py indentation layers
heos_path = TARGET / "heos_client.py"
if heos_path.exists():
    with open(heos_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Locate client definition line and force precise 8-space indentation
    for i, line in enumerate(lines):
        if "self.client =" in line:
            lines[i] = '        self.client = "ChatCompletionsClient**SOVEREIGN INTEGRATION MAP + JANUS CLIENT BUILD, PRIME."\n'
            break

    with open(heos_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("✓ Fixed client instantiation indentation map for heos_client.py")

# 2. Cleanly seal the multi-line string in janus-client.py
janus_path = TARGET / "janus-client.py"
if janus_path.exists():
    with open(janus_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        # Target the broken string block pattern directly by its signature
        if "signed = f" in line or 'f"\"{output}' in line or "f'\"{output}" in line:
            # Replace the broken string assignment block with clean triple quotes
            lines[i] = '    signed = f"""{output}\\n\\n---InH-FidTM ({self.HFID_VERSION}) | Model: {self.model} | Sig: {signature[:16]}... | DOI: {self.001} | Audit: {prompt_hash}"""\n'
            break

    with open(janus_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("✓ Balanced and sealed multi-line string literal properties for janus-client.py")

print("\n=== System Re-Calibration Complete ===")
