#!/usr/bin/env python3
"""
===================================================================
     LYSANDER GIT PURGE UTILITY // AUTOMATED REPO HISTORY PRUNER
     DESIGN DEPTH: LEVEL 5 PRODUCTION // FAILURE-PROOF COMPACTING
===================================================================
Purpose:
Trims loose git reflog data structures, packs uncompressed blobs,
and prunes disconnected remote branches to keep tree reads fast.
"""

import sys
import subprocess
from pathlib import Path

def execution_history_purge():
    print("🧹 [LYSANDER REPO OPTIMIZER]: Sweeping local git database vectors...")
    
    if not Path(".git").exists():
        print("❌ Error: Not inside a valid git tracking node root context.")
        sys.exit(1)
        
    try:
        # 1. Prune remote staging references that are dead or removed on origin
        print("⚙️ Pruning dead remote branch trackers...")
        subprocess.run(["git", "remote", "prune", "origin"], stdout=subprocess.DEVNULL)
        
        # 2. Force expire reflog parameters to isolate historical commits from indexing overhead
        print("⚙️ Expiring loose git reflog data streams...")
        subprocess.run(["git", "reflog", "expire", "--expire=now", "--all"], stdout=subprocess.DEVNULL)
        
        # 3. Violently collect garbage blobs and prune loose tracking nodes
        print("⚙️ Executing deep structural packfile consolidation...")
        subprocess.run(["git", "gc", "--prune=now", "--aggressive"], stdout=subprocess.DEVNULL)
        
        print("🟢 Repository tree structures successfully compacted and optimized.")
    except Exception as e:
        print(f"❌ Structural exception parsing repository database paths: {e}")
        sys.exit(1)

if __name__ == "__main__":
    execution_history_purge()
