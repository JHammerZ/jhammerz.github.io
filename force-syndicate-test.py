import os
import sys
import json
from pathlib import Path

# Load original script logic structures to manipulate test bounds cleanly
sys.path.append(str(Path(".github/scripts")))
try:
    import social_syndicator
except ImportError:
    print("[-] Base social_syndicator component could not be resolved from paths.")
    sys.exit(1)

def inject_mock_drop():
    print("=== LYSANDER DIAGNOSTIC LAYER: STAGING ISOLATED WEBHOOK FORCE DROP ===")
    
    # Temporarily divert the state check logic by overriding the history log values
    original_state_file = social_syndicator.TELEMETRY_LOG
    social_syndicator.TELEMETRY_LOG = Path("mock_test_telemetry_state.json")
    
    # Write a zeroed out state baseline to trick the parsing array into registering a new drop
    with open(social_syndicator.TELEMETRY_LOG, 'w', encoding='utf-8') as tf:
        json.dump({"last_syndicated_track_id": "MOCK_FLUSH_TRIGGER_INIT"}, tf)
        
    print("[+] Test tracking baseline injected. Initiating forced scan sweep...")
    social_syndicator.execute_omni_broadcast()
    
    # Clean up local environment diagnostic debris
    if social_syndicator.TELEMETRY_LOG.exists():
        social_syndicator.TELEMETRY_LOG.unlink()
        
    print("=== DIAGNOSTIC WEBHOOK SIMULATION TASK COMPLETE ===")

if __name__ == "__main__":
    inject_mock_drop()
