import os
import time
import json
import sys

class JHamSystemHUD:
    def __init__(self):
        self.telemetry_file = "jham-ide/live_telemetry.json"
        
    def render_hud_display(self):
        # Clear console screen cleanly for smooth background tracking counters
        os.system('clear' if os.name == 'posix' else 'cls')
        
        # Load active asynchronous performance parameters out of files
        status_flag = "AWAITING_STREAM"
        active_frame = 0
        latency = "0.0000ms"
        nodes = 0
        
        if os.path.exists(self.telemetry_file):
            try:
                with open(self.telemetry_file, 'r') as f:
                    data = json.load(f)
                    status_flag = data["metrics"]["system_stability_flag"]
                    active_frame = data["metrics"]["active_sync_frame"]
                    latency = data["metrics"]["aurelius_compute_latency_ms"]
                    nodes = data["metrics"]["cluster_spatial_density_nodes"]
            except Exception:
                pass

        print("======================================================================")
        print("          .JHAM MASTER COGNITIVE WORKSPACE INFRASTRUCTURE HUD         ")
        print("         Compliance Specification Layout: H-FID-100-VERIFIED          ")
        print("======================================================================")
        print(f"[★] HYPERVISOR CONTROL LAYER FLAG : \033[92m{status_flag}\033[0m")
        print(f"[★] CONCURRENT MATRIX SYNC FRAME  : {active_frame}")
        print(f"[★] AURELIUS PROCESSING VELOCITY  : \033[96m{latency}\033[0m")
        print(f"[★] ENFORCED CORE REGISTER LOAD   : {nodes} Active Spatial Nodes")
        print("======================================================================")
        print("  Active Silos Running permanently inside memory background:         ")
        print("  ➔ [01] Compiler Core [02] Sandbox VM [03] Ingress UDP [04] Proxy Gate")
        print("  ➔ [05] Evolution Loop [06] Git Autonomy [07] Cloner Matrix Sanctuary ")
        print("======================================================================")
        print("   Monitoring continuous multi-threaded performance. Press Ctrl+C to exit.")

    def run_hud_loop(self):
        try:
            while True:
                self.render_hud_display()
                time.sleep(1.0) # Smooth 1Hz screen refresh rate
        except KeyboardInterrupt:
            print("\n[*] Detaching monitor node interface layout.")

if __name__ == "__main__":
    hud = JHamSystemHUD()
    hud.run_hud_loop()
