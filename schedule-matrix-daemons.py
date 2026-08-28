import subprocess
import sys
from pathlib import Path

def audit_daemon_schedules():
    print("=== LYSANDER SUBSURFACE: VALIDATING DAEMON SCHEDULE OPERATIONS ===")
    pid_file = Path(".lysander-daemon.pid")
    
    if pid_file.exists():
        try:
            with open(pid_file, "r") as f:
                pid = f.read().strip()
            if Path(f"/proc/{pid}").exists():
                print(f"[+] Active Background Process Verified: Operational under PID {pid}")
                return True
        except Exception:
            pass
            
    print("[!] Daemon script offline or unlinked. Triggering runtime restore sequence...")
    try:
        subprocess.Popen(["nohup", "./run-lysander-daemon.sh"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("[+] Lysander background daemon process successfully re-spooled.")
        return True
    except Exception as e:
        print(f"[-] Failed to execute background daemon restore: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if audit_daemon_schedules() else 1)
