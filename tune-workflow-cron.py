#!/usr/bin/env python3
"""
Purpose:
Modifies remote GitHub Action cron properties to run workflows on
off-peak minutes, ensuring maximum cloud worker processing velocity.
"""

import re
from pathlib import Path

WORKFLOW_DIR = Path(".github/workflows")

def balance_cron_trees():
    if not WORKFLOW_DIR.exists():
        print("📋 Cloud workflow directory not found. Skipping tree tuning.")
        return

    print("⚡ [LYSANDER CLOUD MATRIX]: Tuning workflow cron triggers for off-peak optimization...")
    
    # 1. Target and adjust the Perpetual Syndicator timing maps
    syndicator = WORKFLOW_DIR / "perpetual-syndicator.yml"
    if syndicator.exists():
        content = syndicator.read_text()
        # Shift hourly workflows from '0 * * * *' to '17 * * * *'
        if "cron: '0 * * * *'" in content:
            content = content.replace("cron: '0 * * * *'", "cron: '17 * * * *'")
            syndicator.write_text(content)
            print("✅ Shifted perpetual-syndicator execution trigger to minute 17.")
            
    # 2. Target and adjust the Upstream Watchdog timing maps
    watchdog = WORKFLOW_DIR / "upstream-watchdog.yml"
    if watchdog.exists():
        content = watchdog.read_text()
        # Shift 3-hour workflows from '0 */3 * * *' to '42 */3 * * *'
        if "cron: '0 */3 * * *'" in content:
            content = content.replace("cron: '0 */3 * * *'", "cron: '42 */3 * * *'")
            watchdog.write_text(content)
            print("✅ Shifted upstream-watchdog execution trigger to minute 42.")

if __name__ == "__main__":
    balance_cron_trees()
