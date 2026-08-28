#!/usr/bin/env python3
"""
===================================================================
     LYSANDER PROCESSSOR // SUBSURFACE DAEMON SCHEDULER PROTOCOL
     DESIGN DEPTH: LEVEL 5 PRODUCTION // MULTI-THREAD RESILIENCE
===================================================================
"""

import time
import subprocess
from pathlib import Path

# Explicit task frequency rules mapped in seconds
TASK_MATRIX = {
    "watch-workspace.py": 30,             # Instant mutation checking loops
    "track-mesh-velocity.py": 3600,       # Hourly channel traffic telemetry checks
    "clean-matrix-cache.sh": 86400,
    "track-social-posts.py": 3600        # 24-Hour maintenance and backup routines
}

def execute_scheduler_loop():
    print("🟢 Lysander Subsurface Process Scheduler initialized.")
    print("📋 Daemon orchestration matrix actively logging background thread cycles.")
    
    # Store exact epoch timestamps to track execution elapsed metrics
    last_executed = {script: 0.0 for script in TASK_MATRIX}
    
    try:
        while True:
            current_time = time.time()
            
            for script, interval in TASK_MATRIX.items():
                if current_time - last_executed[script] >= interval:
                    script_path = Path(script)
                    if not script_path.exists():
                        continue
                        
                    print(f"⚡ [SCHEDULER EVENT]: Launching background runner: {script}")
                    try:
                        # Determine runtime caller parameters based on extension layout types
                        if script.endswith(".py"):
                            subprocess.Popen(["python3", script], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        elif script.endswith(".sh"):
                            subprocess.Popen(["bash", script], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                            
                        last_executed[script] = current_time
                    except Exception as e:
                        print(f"⚠️ Exception spawning background engine thread for {script}: {e}")
                        
            # Sleep 5 seconds between iteration sweeps to maintain optimal CPU efficiency
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n🛑 Severing subsurface process scheduler connections. Exiting safely.")

if __name__ == "__main__":
    execute_scheduler_loop()
