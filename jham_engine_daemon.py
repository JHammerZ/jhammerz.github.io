import subprocess
import time
import sys
import os
import signal

class JHamSovereignEngineDaemon:
    def __init__(self):
        self.version = "1.0.0-AutonomousDaemon"
        self.processes = {}
        self.running = True
        
        # Define the structural engine stack components that must run permanently
        self.engine_stack = {
            "01_ORCHESTRATOR": "autonomic_manager.py",
            "02_PREDICTOR": "janus_quantum_predictor.py",
            "03_PROXY_GATE": "janus_proxy_gateway.py",
            "04_DASHBOARD": "jham_dashboard_daemon.py"
        }
        
        print("======================================================================")
        print(f"[+] [.JHam] INITIALIZING PERMANENT AUTONOMOUS BACKGROUND DAEMON")
        print(f"[+] Core Daemon Version : {self.version}")
        print("[+] Policy Enforcement : 100% UNINTERRUPTED H-FID ALIGNED PROCESSES")
        print("======================================================================")

    def boot_permanent_stack(self):
        """Spins up every underlying file component as an isolated background subprocess."""
        for name, script_file in self.engine_stack.items():
            if os.path.exists(script_file):
                print(f"[*] [Daemon Boot]: Launching core matrix subsystem -> {name} ({script_file})")
                try:
                    # Spawn independent, non-blocking background runtime channels
                    proc = subprocess.Popen(
                        [sys.executable, script_file],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        preexec_fn=os.setpgrp # Isolate process group to prevent shell collapse hangups
                    )
                    self.processes[name] = proc
                except Exception as e:
                    print(f"[-] [Daemon Exception]: Failed to engage subsystem {name}: {e}")
            else:
                print(f"[!] [Daemon Warning]: Required structural script file '{script_file}' not found.")

    def monitor_and_heal_loops(self):
        """Continuous watchdog function to automatically revive any crashed process threads."""
        print("[✓] Full engine stack engaged successfully. Running permanently in memory background...")
        print("[*] Watching system health parameters. Press Ctrl+C to stop daemon container.")
        
        while self.running:
            try:
                time.sleep(2)
                for name, proc in list(self.processes.items()):
                    # Check if background thread states have terminated or crashed
                    if proc.poll() is not None:
                        print(f"\n[!] [Watchdog Alert]: Subsystem '{name}' drop detected! Initiating structural revival pass...")
                        script_file = self.engine_stack[name]
                        new_proc = subprocess.Popen(
                            [sys.executable, script_file],
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL,
                            preexec_fn=os.setpgrp
                        )
                        self.processes[name] = new_proc
                        print(f"[✓] [Watchdog Recovery]: Subsystem '{name}' successfully restored to active runtime registers.")
            except KeyboardInterrupt:
                self.terminate_entire_stack()
                break

    def terminate_entire_stack(self):
        """Safely tears down active processing channels on user cancellation."""
        print("\n[*] [Daemon Shutdown]: Gracefully harvesting active background process tracks...")
        self.running = False
        for name, proc in self.processes.items():
            try:
                os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
                print(f"[✓] Detached subsystem channel: {name}")
            except Exception:
                pass
        print("[✓] Autonomous background infrastructure safely unmounted. Execution terminated.")
        sys.exit(0)

if __name__ == "__main__":
    daemon_core = JHamSovereignEngineDaemon()
    daemon_core.boot_permanent_stack()
    daemon_core.monitor_and_heal_loops()
