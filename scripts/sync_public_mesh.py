#!/usr/bin/env python3
import json
import pathlib
import shutil

def synchronize_public_nodes():
    print("[*] Initiating Public Mesh Fabric Synced Verification Loop...")
    source = pathlib.Path(".hfid/indexing/traffic-summary.json")
    if not source.exists():
        print("[!] Missing source traffic-summary array. Constructing baseline tracker...")
        return
        
    targets = [
        pathlib.Path(".well-known/hfid/entities.json"),
        pathlib.Path("public/.well-known/hfid/entities.json"),
        pathlib.Path("public/entities.json")
    ]
    
    for t in targets:
        t.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, t)
        print(f"[✓] Synced tracking array mirrored safely to: {t}")

if __name__ == "__main__":
    synchronize_public_nodes()
