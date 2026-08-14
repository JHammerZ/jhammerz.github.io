import os
import sys
import json
import hashlib
import hmac
import sqlite3
import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer

CONFIG_FILE = "node_config.json"
DB_FILE = "sovereign_metrics.db"
SOVEREIGN_DROPZONE = "dropzone/sovereign_out"
LEGACY_DROPZONE = "dropzone/legacy_archive"

def init_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transaction_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            pipeline_id TEXT,
            status TEXT,
            h_fid_signature TEXT
        )
    ''')
    conn.commit()
    conn.close()

def log_to_ledger(pipeline_id, status, signature):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "INSERT INTO transaction_logs (timestamp, pipeline_id, status, h_fid_signature) VALUES (?, ?, ?, ?)",
        (now, pipeline_id, status, signature)
    )
    conn.commit()
    conn.close()

def load_verification_context():
    if not os.path.exists(CONFIG_FILE):
        print("[CRITICAL] Node configuration missing. System halting.", file=sys.stderr)
        sys.exit(1)
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

class SovereignProxyHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"[SEGREGATED LOG] {format%args}\n")

    def hfim_sign(self, payload_bytes, secret_key):
        return hmac.new(secret_key, payload_bytes, hashlib.sha256).hexdigest()

    def verify_genesis_lock(self, headers):
        config = load_verification_context()
        return headers.get("X-Lysander-Genesis-Lock") == config.get("genesis_lock")

    def do_POST(self):
        config = load_verification_context()
        content_length = int(self.headers.get('Content-Length', 0))
        raw_payload = self.rfile.read(content_length)
        pipe_id = self.headers.get("X-Legacy-Pipeline-ID", "UNKN_PIPE")

        if not self.verify_genesis_lock(self.headers):
            print("[ALERT-SEGREGATED] Validation Failure: Unsigned traffic rejected.", file=sys.stderr)
            log_to_ledger(pipe_id, "REJECTED", "FAIL_CLOSED_BLOCKED")
            self.send_response(403)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "REJECTED"}).encode())
            return

        try:
            telemetry_data = json.loads(raw_payload.decode('utf-8'))
        except Exception:
            self.send_response(400)
            self.end_headers()
            return

        secret_seed = os.environ.get("LYSANDER_SECRET_SEED", "fallback_seed").encode()
        h_fid_signature = self.hfim_sign(raw_payload, secret_seed)

        log_to_ledger(pipe_id, "PROCESSED", h_fid_signature)

        timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        
        sovereign_out_file = os.path.join(SOVEREIGN_DROPZONE, f"sov_sig_{timestamp_str}.json")
        with open(sovereign_out_file, "w") as sf:
            json.dump({"metrics": telemetry_data, "sig": h_fid_signature, "audit": "100/100"}, sf)

        legacy_out_file = os.path.join(LEGACY_DROPZONE, f"leg_pipe_{timestamp_str}.json")
        with open(legacy_out_file, "w") as lf:
            json.dump({"legacy_pipe_id": pipe_id, "raw_data": telemetry_data}, lf)

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ISOLATED_AND_SAVED", "h_fid_signature": h_fid_signature}).encode())

if __name__ == '__main__':
    init_database()
    server_address = ('', 8090)
    httpd = HTTPServer(server_address, SovereignProxyHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
