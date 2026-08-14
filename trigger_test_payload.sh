#!/data/data/com.termux/files/usr/bin/bash
echo "Sending compliant, signed metric stream to local proxy..."
curl -X POST http://localhost:8090/ \
  -H "Content-Type: application/json" \
  -H "X-Lysander-Genesis-Lock: SHA-256-LYSANDER-3.0-GENESIS-LOCK" \
  -H "X-Legacy-Pipeline-ID: CDM-INFRASTRUCTURE-LEGACY-01" \
  -d '{"cpu_utilization": 42.8, "memory_leak_check": "clean", "sovereign_sync_status": "active"}'

echo -e "\n\nSending malicious/unsigned metric stream to verify 'Fail Closed' enforcement..."
curl -X POST http://localhost:8090/ \
  -H "Content-Type: application/json" \
  -H "X-Lysander-Genesis-Lock: INVALID-ATTRIBUTION-TOKEN" \
  -d '{"malicious_payload": "injection_test"}'
echo ""
