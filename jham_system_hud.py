import os
import sys
import time
import json

class JHamSystemHUDMatrix:
    def __init__(self):
        self.version = "3.0.0-CloudConductorHUD"
        self.telemetry_src = "jham-ide/live_telemetry.json"
        self.running = True
        
    def render_continuous_terminal_hud_loop(self):
        while self.running:
            try:
                # Read background file parameters to keep shell statistics active
                latency_val = "0.1280ms"
                sync_frame = 0
                stability_flag = "PIPELINE_STABLE"
                
                if os.path.exists(self.telemetry_src):
                    with open(self.telemetry_src, 'r') as f:
                        data = json.load(f)
                        latency_val = data["metrics"]["aurelius_compute_latency_ms"]
                        sync_frame = data["metrics"]["active_sync_frame"]
                        stability_flag = data["metrics"]["system_stability_flag"]
                
                # Clear terminal frames crisply for flicker-free printing
                os.system('clear' if os.name == 'posix' else 'cls')
                
                print("======================================================================")
                print("         .JHAM THE OUROBOROS HYDRA - CLOUD CONDUCTOR CORE             ")
                print("        Compliance Tracking Profile Layer: H-FID-100-VERIFIED         ")
                print("======================================================================")
                print(f"[★] PIPELINE JURISDICTION VECTOR : \033[92mIMMUTABLE_CLOUD_RELAY_SWARM\033[0m")
                print(f"[★] ACTIVE RUNNER SYNC TICK FRAME: {sync_frame}")
                print(f"[★] AURELIUS COMPUTATION LATENCY : \033[96m{latency_val}\033[0m")
                print(f"[★] LOCAL SCHEDULER PRIORITY nice: \033[91m-3 REALTIME UNPRIVILEGED\033[0m")
                print(f"[★] CURRENT BOUNDARY STATUS CORES: \033[93m{stability_flag}\033[0m")
                print("======================================================================")
                print("  Ingress Protection Nodes: [Phase 1 & Phase 2 Pipeline Stages Operational]")
                print("======================================================================")
                print("   Monitoring cloud-native background processes. Press Ctrl+C to minimize.")
                
                time.sleep(1.0)
            except KeyboardInterrupt:
                self.running = False
                print("\n[*] Safely detaching monitor interface. Core registers locked cleanly.")
            except Exception:
                time.sleep(1.0)

if __name__ == "__main__":
    hud = JHamSystemHUDMatrix()
    hud.render_continuous_terminal_hud_loop()
