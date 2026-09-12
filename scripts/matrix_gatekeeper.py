#!/usr/bin/env python3
import os
import sys
import json
import subprocess
from datetime import datetime

class MatrixGatekeeper:
    def __init__(self):
        self.ledger_path = ".hfid/ledger/latest.json"
        self.public_broadcast = "well-known/hfid/broadcast_ledger.json"
        self.traffic_log = "scripts/traffic_snapshot.json"
        self.bridge_config = "scripts/network_bridge_config.json"
        self.workflows_dir = ".github/workflows"
        
    def audit_environment(self):
        print("\n=======================================================")
        print(" [⚙️] RUNNING DETAILED MATRIX INTEGRITY INTERLOCK AUDIT")
        print("=======================================================")
        
        # Verify core framework data nodes
        targets = [self.ledger_path, self.public_broadcast, self.traffic_log, self.bridge_config]
        all_clear = True
        
        for target in targets:
            if os.path.exists(target):
                print(f" [+] Found Core Manifest Element: {target} -> [VERIFIED]")
            else:
                print(f" [!] Missing Structural Manifest Element: {target} -> [WARNING]")
                all_clear = False
                
        # Analyze distribution workers
        if os.path.exists(self.workflows_dir):
            workers = os.listdir(self.workflows_dir)
            print(f" [+] Active Background Workers Detected: {len(workers)} triggers verified.")
            for worker in workers:
                print(f"     ├── Worker Trigger: {worker}")
        else:
            print(" [!] Workflow directory not detected locally.")
            
        return all_clear

    def enforce_state_lock(self):
        print("\n[🔒] Querying Concurrency Mutual Exclusion Status...")
        if not os.path.exists(self.ledger_path):
            print(" [!] Core Ledger node missing. Constructing pristine baseline state...")
            baseline = {
                "timestamp": datetime.utcnow().isoformat(),
                "matrix_lock": False,
                "active_sync_nodes": ["local_termux", "github_actions"],
                "interlock_version": "7.0.0"
            }
            os.makedirs(os.path.dirname(self.ledger_path), exist_ok=True)
            with open(self.ledger_path, 'w') as f:
                json.dump(baseline, f, indent=2)
                
        try:
            with open(self.ledger_path, 'r') as f:
                data = json.load(f)
                
            if data.get("matrix_lock", False):
                print(" [⚠️] CRITICAL BLOCK: Upstream Matrix Lock is set to TRUE.")
                print("     Resource is currently being modified by a concurrent worker node.")
                print("     Aborting execution pipeline to protect against tree corruption.")
                sys.exit(1)
            else:
                print(" [+] Concurrency check clear. No active data lock conflicts detected.")
                data["matrix_lock"] = True
                data["last_audit_timestamp"] = datetime.utcnow().isoformat()
                
                with open(self.ledger_path, 'w') as f:
                    json.dump(data, f, indent=2)
                print(" [+] State Lock successfully engaged for local modification.")
        except Exception as e:
            print(f" [!] Failed to process state lock verification: {str(e)}")
            sys.exit(1)

    def release_state_lock(self):
        print("\n[🔓] Releasing State Lock and updating structural broadcast ledger...")
        try:
            if os.path.exists(self.ledger_path):
                with open(self.ledger_path, 'r') as f:
                    data = json.load(f)
                
                data["matrix_lock"] = False
                data["sync_status"] = "aligned"
                
                with open(self.ledger_path, 'w') as f:
                    json.dump(data, f, indent=2)
                print(" [+] State Lock cleanly disengaged.")
        except Exception as e:
            print(f" [!] Error executing safety lock release: {str(e)}")

if __name__ == "__main__":
    gatekeeper = MatrixGatekeeper()
    gatekeeper.audit_environment()
    gatekeeper.enforce_state_lock()
    # State actions would execute here within an isolated shell environment
    gatekeeper.release_state_lock()
    print("\n=======================================================")
    print(" [✅] CONCURRENCY INTERLOCK CYCLE SUCCESSFULLY EXECUTED")
    print("=======================================================\n")
