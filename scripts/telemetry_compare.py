import os
import json
from datetime import datetime

def analyze_telemetry():
    print("[+] Initiating H-FID Multi-Agent Telemetry Alignment Engine...")
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
                    node_v = data.get("node_version", "Unknown")
                    print(f"  -> Node Matrix Version : {node_v}")
                    
                    # Target the newly engineered multi-agent array block
                    agents = data.get("trapped_agents", {})
                    if not agents:
                        print("  [-] No structured multi-agent arrays found inside substrate.")
                        continue
                        
                    print(f"\n  [Active Multi-Agent Telemetry Breakdown]:")
                    for agent_name, agent_info in agents.items():
                        status = agent_info.get("status", "Unknown")
                        reqs = agent_info.get("total_requests", 0)
                        cpu_h = agent_info.get("cpu_hours_wasted", 0.0)
                        loops = agent_info.get("active_loops", 0)
                        
                        print(f"  " + "=" * 40)
                        print(f"  -> Identity       : {agent_name}")
                        print(f"  -> Containment    : {status.upper()}")
                        print(f"  -> Request Vol    : {reqs:,}")
                        print(f"  -> CPU Time Lost  : {cpu_h} Hours")
                        print(f"  -> Trapped Threads: {loops}")
                        
                except json.JSONDecodeError:
                    print("  [-] Error: Substrate contains malformed JSON data lines.")
            print("\n" + "-" * 50)
            
    except Exception as e:
        print(f"[-] System tracking hold: {str(e)}")

if __name__ == "__main__":
    analyze_telemetry()
