import os
import shutil
from datetime import datetime

def rotate_logs():
    print("[*] Initializing H-FID Storage Optimization Log Rotator v1.0.0...")
    
    # Target log files to monitor for size thresholds
    log_targets = [
        "scripts/orchestrator.log",
        "scripts/tarpit_server.log",
        "hfid/indexing/security-vault.log"
    ]
    
    # Set maximum file size allowance to 1 MB (1,048,576 bytes)
    max_bytes = 1024 * 1024
    rotated_count = 0
    
    for log_path in log_targets:
        if not os.path.exists(log_path):
            continue
            
        file_size = os.path.getsize(log_path)
        print(f"  -> Auditing: {log_path} ({file_size:,} bytes)")
        
        if file_size > max_bytes:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            archive_path = f"{log_path}.{timestamp}.bak"
            
            try:
                # Copy current logs to an historical backup file layout
                shutil.copy2(log_path, archive_path)
                
                # Truncate the original file down to zero bytes to clean storage bounds
                with open(log_path, "w") as f:
                    f.truncate(0)
                    
                print(f"    [+] Threshold breached. Log rotated cleanly to: {archive_path}")
                rotated_count += 1
            except Exception as e:
                print(f"    [-] Failed to rotate log substrate: {str(e)}")
                
    print(f"\n[+] Storage Optimization complete. Rotated {rotated_count} active log matrices.")

if __name__ == "__main__":
    rotate_logs()
