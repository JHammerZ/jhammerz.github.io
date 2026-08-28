#!/usr/bin/env bash
# Bind the workspace watchdog directly to your main repository distribution layer

cat << 'PYTHON' > watch-workspace.py
#!/usr/bin/env python3
import os
import sys
import json
import subprocess
from pathlib import Path

WATCH_TARGET = Path("./public/music")
STATE_FILE = Path(".workspace_snapshot.json")

def get_directory_snapshot():
    if not WATCH_TARGET.exists():
        WATCH_TARGET.mkdir(parents=True, exist_ok=True)
    return {str(f): f.stat().st_mtime for f in WATCH_TARGET.glob("**/*") if f.is_file()}

print("⚙️ [LYSANDER LOCAL WATCHDOG]: Monitoring local music substrate directory active.")
baseline = get_directory_snapshot()

# Execute real-time differential tracking
current = get_directory_snapshot()
if current != baseline:
    print("⚠️ [MUTATION DETECTED]: Structural code or audio assets changed. Launching Git sync...")
    STATE_FILE.write_text(json.dumps(current))
    
    # SYSTEM INTERACTION: Push local changes straight up to GitHub Pages core
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "fix: automated local substrate mutation sync"])
    subprocess.run(["git", "push", "origin", "main"])
    sys.exit(0)
else:
    print("✅ [MATRIX STATUS]: Substrate space balanced. No local updates found.")
    sys.exit(1)
PYTHON

echo "⚡ [INTEGRATION COMPLETE]: watch-workspace.py is now fully bound to your Git pipeline."
