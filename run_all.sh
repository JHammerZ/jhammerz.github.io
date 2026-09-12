#!/bin/bash
set -euo pipefail

echo "======================================================="
echo " [🌀] LAUNCHING APEX INTEGRATED MASTER DISTRIBUTION"
echo "======================================================="

# 1. Sync repository data nodes cleanly past heartbeats
./hfid_sync.sh

# 2. Run Recovered Security Core Suite
python3 scripts/apex_security_vault.py

# 3. Run Activated HFID Asset Registry Scanner
python3 scripts/hfid_dynamic_scanner.py

# 4. Unlock Atomic Throughput Thread Locks (Phase 23)
python3 scripts/atomic_shuffler.py

# 5. Compile High-Speed RAM Matrices (Phase 20)
python3 scripts/edge_accelerator.py

# 6. Fire Predictive Surge Pre-Caching Engines (Phase 21)
python3 scripts/surge_engine.py

# 7. Trigger Universal Saturation Suite (Phase 22)
python3 scripts/sovereign_suite.py

# 8. Map Decentralized P2P Substrate Telemetry (Phase 24)
python3 scripts/p2p_telemetry.py

# 9. Execute Real-Time Performance Monitor (Resurrected & Upgraded Code)
python3 scripts/hfid_live_monitor.py

echo "======================================================="
echo " [💎] MAXIMUM SYNDICATION SUITE ONLINE AND ACTIVE"
echo "======================================================="
