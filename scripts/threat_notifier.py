import json
import pathlib
from datetime import datetime

def audit_unknown_agents():
    print("[*] Launching H-FID Active Threat Detection Substrate v1.0.0...")
    
    snapshot_path = pathlib.Path("scripts/traffic_snapshot.json")
    alert_path = pathlib.Path("hfid/indexing/active_alerts.json")
    
    # Established whitelisted/known containment actors
    known_agents = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "Anthropic-AI"]
    
    if not snapshot_path.exists():
        print("[-] Telemetry snapshot missing. Threat scan idling safely.")
        return
        
    try:
        with open(snapshot_path, "r") as f:
            data = json.load(f)
            
        trapped_agents = data.get("trapped_agents", {})
        unknown_threats = {}
        
        # Scan your active tracking dictionary for non-whitelisted actors
        for agent, info in trapped_agents.items():
            if agent not in known_agents:
                unknown_threats[agent] = {
                    "detected_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "request_volume": info.get("total_requests", 0),
                    "status": info.get("status", "uncontained")
                }
                
        if unknown_threats:
            print(f"[!] INTRUSION ALERT: Detected {len(unknown_threats)} unclassified scraping vectors!")
            alert_path.parent.mkdir(parents=True, exist_ok=True)
            with open(alert_path, "w") as f:
                json.dump(unknown_threats, f, indent=2)
            print("[+] Active alert payload written to hfid/indexing/active_alerts.json")
        else:
            if alert_path.exists():
                alert_path.unlink() # Clear historical alerts if perimeter is clean
            print("[+] Scan Complete: Zero foreign automated traffic vectors detected.")
            
    except Exception as e:
        print(f"[-] Threat auditor hold: {str(e)}")

if __name__ == "__main__":
    audit_unknown_agents()
