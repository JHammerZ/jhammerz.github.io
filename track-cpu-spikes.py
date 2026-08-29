import sys
import time
import json
import os
from pathlib import Path

SPIKE_LOG = Path("secure_subsurface_vault/cpu_spikes_telemetry.json")

def audit_cpu_load_spikes():
    print("=== LYSANDER SUBSURFACE: ANALYZING HARDWARE PROCESSOR SPIKES ===")

    # Target sandboxed proc telemetry descriptors safely
    stat_path = Path("/proc/stat")
    cpu_usage_pct = "0.0%"

    try:
        if stat_path.exists() and os.access(str(stat_path), os.R_OK):
            with open(stat_path, "r") as f:
                first_line = f.readline()
            if first_line.startswith("cpu"):
                parts = [int(x) for x in first_line.split()[1:5]]
                idle_ticks = parts[3]
                total_ticks = sum(parts)
                # Quick micro-delta calculations
                time.sleep(0.05)
                with open(stat_path, "r") as f:
                    second_line = f.readline()
                parts2 = [int(x) for x in second_line.split()[1:5]]
                idle_delta = parts2[3] - idle_ticks
                total_delta = sum(parts2) - total_ticks
                if total_delta > 0:
                    cpu_usage_pct = f"{round((1.0 - (idle_delta / total_delta)) * 100, 1)}%"
    except Exception:
        cpu_usage_pct = "METRIC_RESTRICTED"

    telemetry_state = {
        "timestamp_epoch": int(time.time()),
        "live_cpu_utilization": cpu_usage_pct,
        "load_profile": "STABLE" if "RESTRICTED" in cpu_usage_pct or float(cpu_usage_pct.replace("%","")) < 70 else "SPIKE_DETECTED"
    }

    try:
        SPIKE_LOG.parent.mkdir(parents=True, exist_ok=True)
        SPIKE_LOG.write_text(json.dumps(telemetry_state), encoding='utf-8')
        print(f"[+] Local Hardware CPU Spike Tracking: {telemetry_state['live_cpu_utilization']}")
        print(f"[+] Processor Workload Load Profile: {telemetry_state['load_profile']}")
        return True
    except Exception as e:
        print(f"[-] Telemetry write failure for processor spikes: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if audit_cpu_load_spikes() else 1)
