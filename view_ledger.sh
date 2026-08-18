#!/data/data/com.termux/files/usr/bin/bash
echo "=== SOVEREIGN FORENSIC LEDGER RECORD ==="
sqlite3 sovereign_metrics.db "SELECT timestamp, pipeline_id, status, h_fid_signature FROM transaction_logs ORDER BY id DESC LIMIT 5;" | sed 's/|/  |  /g'
echo "========================================"
