import os
from pathlib import Path

LOG_FILE = Path("daemon_runtime.log")
MAX_SIZE_BYTES = 512 * 1024  # 512 KB threshold boundary limit

def execute_log_rotation():
    print("=== LYSANDER SUBSURFACE: RUNNING TELEMETRY LOG ROTATION SUITE ===")
    if not LOG_FILE.exists():
        print("[-] Target file daemon_runtime.log does not exist yet. Skipping rotation loop.")
        return

    current_size = LOG_FILE.stat().st_size
    print(f"[*] Current logging footprint allocation: {current_size} bytes")

    if current_size >= MAX_SIZE_BYTES:
        print("[!] Log profile exceeds allocation limits. Rotating tracking registers...")
        backup_file = LOG_FILE.with_suffix(".log.bak")
        
        # Shift active data to secondary backup storage space
        if backup_file.exists():
            backup_file.unlink()
        LOG_FILE.rename(backup_file)
        
        # Re-initialize clean runtime tracking log file
        LOG_FILE.touch()
        print("[+] Log profile successfully truncated. Backup preserved in .log.bak.")
    else:
        print("[+] Log buffer allocations within safe baseline boundaries.")

if __name__ == "__main__":
    execute_log_rotation()
