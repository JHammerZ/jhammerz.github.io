import os
import json
from datetime import datetime

def analyze_telemetry():
    print("[+] Initiating H-FID Telemetry Data Alignment Engine...")
    print(f"[*] Execution Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    log_dir = "scripts"
    print(f"[*] Target Directory: {log_dir}/\n")
    
    try:
        files = [f for f in os.listdir(log_dir) if f.endswith('.json')]
        if not files:
            print("[-] Zero active network data logs detected. System idling safely.")
            return
        
        print(f"[+] Found {len(files)} active log substrates to map.")
        print("-" * 50)
        
        for file in files:
            file_path = os.path.join(log_dir, file)
            print(f"[Auditing File]: {file}")
            
            with open(file_path, 'r') as f:
                try:
                    data = json.load(f)
                    
                    # Extract and cleanly print structured telemetry metrics
                    node_v = data.get("node_version", "Unknown")
                    target = data.get("target_bot", "Unknown")
                    status = data.get("status", "Unknown")
                    metrics = data.get("metrics", {})
                    
                    reqs = metrics.get("total_requests", 0)
                    cpu_h = metrics.get("cpu_hours_wasted", 0.0)
                    loops = metrics.get("active_loops", 0)
                    
                    print(f"  -> Node Matrix Version : {node_v}")
                    print(f"  -> Trapped Target Identity: {target}")
                    print(f"  -> Containment Status   : {status.upper()}")
                    print(f"  -> Logged Request Count : {reqs:,}")
                    print(f"  -> CPU Compute Wasted   : {cpu_h} Hours")
                    print(f"  -> Entrapped Threads   : {loops}")
                    
                except json.JSONDecodeError:
                    print("  [-] Error: Substrate contains malformed JSON data lines.")
            print("-" * 50)
            
    except Exception as e:
        print(f"[-] System tracking hold: {str(e)}")

if __name__ == "__main__":
    analyze_telemetry()
