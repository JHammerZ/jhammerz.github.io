import os
import sys
import subprocess
import time

def run_distribution_mode():
    print("================================================================================")
    print("  LYSANDER 3.0: EXECUTING FULL SOVEREIGN DISTRIBUTION SYSTEM MODE")
    print("================================================================================")
    
    # 1. Trigger the master core bridge script to attest local engine readiness
    print("[*] Stage 1: Running local system bridge alignment passes...")
    if os.path.exists("sovereign_core_bridge.py"):
        subprocess.run([sys.executable, "sovereign_core_bridge.py"])
    
    # 2. Sequentially kick off all 99 automated workflow tracks via GitHub CLI commands
    print("\n[*] Stage 2: Spooling high-velocity out-of-band triggers to remote nodes...")
    w_dir = ".github/workflows"
    if os.path.exists(w_dir):
        workflows = [f for f in os.listdir(w_dir) if f.endswith(('.yml', '.yaml'))]
        print(f"[+] Found {len(workflows)} active workflows inside configuration paths.")
        
        for w in sorted(workflows):
            print(f"   🚀 [DISPATCH] Initializing pipeline engine channel: {w}")
            # Fire the precise target trigger natively via GitHub CLI with main branch references
            subprocess.run(["gh", "workflow", "run", w, "--ref", "main"], capture_output=True)
            time.sleep(1.5)  # 1.5-second accelerated sequential stepover throttle gap
            
    # 3. Compile the visual layout tables and render the master dashboard metrics live
    print("\n[*] Stage 3: Compiling live telemetry transport tables...")
    if os.path.exists("display-mas-dashboard.py"):
        subprocess.run([sys.executable, "display-mas-dashboard.py"])
        
    print("\n================================================================================")
    print("  === MODE RUN ACTIVE: ALL AUTOMATED ASSET MATRICES COMMENCING PRODUCTION ===")
    print("================================================================================")

if __name__ == "__main__":
    run_distribution_mode()
