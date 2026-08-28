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

# Run pre-flight edge connectivity check before parsing directory state parameters
import subprocess
if subprocess.run([sys.executable, "track-preflight-ping.py"]).returncode != 0:
    sys.exit(1)

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
        # Auto-tune Answer Engine Optimization tags before synchronization
    import subprocess
    subprocess.run([sys.executable, "tune-aeo-metadata.py"])

        # Auto-format and sync video deck elements down to music.html structures
    import subprocess
    subprocess.run([sys.executable, "format-video-deck.py"])

        # Timestamp and seal raw audio asset track metadata parameters
    import subprocess
    subprocess.run([sys.executable, "stamp-release-metadata.py"])

        # Auto-generate machine-readable AI context schemas
    import subprocess
    subprocess.run([sys.executable, "generate-ai-context.py"])

        # Auto-minify tracking payloads to optimize edge delivery speeds
    import subprocess
    subprocess.run([sys.executable, "minify-payload.py"])

        # Automatically evaluate graphic parameters before syncing down to edge nodes
    import subprocess
    subprocess.run([sys.executable, "compress-assets.py"])

        # Dynamic sub-domain proxy calculation maps
    import subprocess
    subprocess.run([sys.executable, "generate-subdomain-proxy.py"])

        # Verify binary container layout health metrics before pushing up to the CDN
    import subprocess
    if subprocess.run([sys.executable, "verify-binary-headers.py"]).returncode != 0:
        print("❌ Automated sync blocked due to corrupted media layout parameters.")
        sys.exit(1)

        # Verify cryptographic signature block structures before committing data maps
    import subprocess
    if subprocess.run([sys.executable, "audit-pgp-claims.py"]).returncode != 0:
        print("❌ Sync blocked: Cryptographic signature validation failure.")
        sys.exit(1)

        # Auto-minify CSS assets to optimize edge front-end rendering speeds
    import subprocess
    subprocess.run([sys.executable, "minify-css.py"])

        # Enforce military-grade data schema validation before updating live server nodes
    import subprocess
    if subprocess.run([sys.executable, "validate-playlist-schema.py"]).returncode != 0:
        import subprocess
        subprocess.run([sys.executable, "pipe-pipeline-errors.py", "validate-playlist-schema", "Schema verification rejected structural ingress payload layout."])
        sys.exit(1)

        # Auto-compile fresh markdown API specification blueprints
    import subprocess
    subprocess.run([sys.executable, "generate-api-docs.py"])

        # Auto-generate advanced SEO, AEO, GEO, and HEO semantic matrix graphs
    import subprocess
    subprocess.run([sys.executable, "generate-seo-matrix.py"])

        # Extract hardware-accelerated media parameters before deploying layout updates
    import subprocess
    subprocess.run([sys.executable, "scrape-audio-metadata.py"])

        # Run RedSec and OpSec ingress script scans before allowing any system operations
    import subprocess
    if subprocess.run([sys.executable, "secure-ingress-inspection.py"]).returncode != 0:
        print("🛑 [SECURITY BLOCK]: Compromised code structures intercepted. Operation aborted.")
        sys.exit(1)

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
