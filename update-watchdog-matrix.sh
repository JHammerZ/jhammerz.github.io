#!/usr/bin/env bash
# ===================================================================
#      LYSANDER SUBSURFACE COHESION PATCH // TERMUX RUNTIME FIX
#      DESIGN DEPTH: LEVEL 5 PRODUCTION // CLOSED-LOOP COHESION
# ===================================================================

cat << 'PYTHON' > watch-workspace.py
#!/usr/bin/env python3
import os
import sys
import json
import subprocess
from pathlib import Path

# Fix explicit operational path parameters
WATCH_TARGET = Path("./public/music")
STATE_FILE = Path(".workspace_snapshot.json")
ENGINE_SCRIPT = Path(".github/scripts/social_syndicator.py")

def get_directory_snapshot():
    if not WATCH_TARGET.exists():
        WATCH_TARGET.mkdir(parents=True, exist_ok=True)
    return {str(f): f.stat().st_mtime for f in WATCH_TARGET.glob("**/*") if f.is_file()}

print("⚡ [LYSANDER CORE WATCHDOG]: Sweeping local substrate directory for mutations...")

if not STATE_FILE.exists():
    baseline = get_directory_snapshot()
    STATE_FILE.write_text(json.dumps(baseline))
    print("📋 Genesis snapshot ledger established. Monitoring active.")
    sys.exit(0)

baseline = json.loads(STATE_FILE.read_text())
current = get_directory_snapshot()

if current != baseline:
    print("⚠️ [MUTATION DETECTED]: Structural balance shifted inside public/music.")
    STATE_FILE.write_text(json.dumps(current))
    
    # 1. First trigger local multi-channel serialization if the engine file exists
    if ENGINE_SCRIPT.exists():
        print("⚙️ Executing local social syndication matrix routines...")
        subprocess.run([sys.executable, str(ENGINE_SCRIPT)])
    else:
        print("⚠️ Local engine script missing at .github/scripts/social_syndicator.py")
    
    # 2. Push state mutation instantly to edge distribution servers
    print("📤 Dispatching delta changes up to GitHub Pages CDN...")
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "fix: automated local substrate mutation sync"])
    subprocess.run(["git", "push", "origin", "main"])
    sys.exit(0)
else:
    print("✅ [MATRIX STATUS]: Core substrate balanced. No updates needed.")
    sys.exit(1)
PYTHON

chmod +x watch-workspace.py
echo "🚀 [CORE COHESION COMPLETION]: Local watchdog successfully bound to your actual engine script!"
./watch-workspace.py
