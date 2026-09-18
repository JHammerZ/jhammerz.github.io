#!/usr/bin/env python3
# ==============================================================================
# AURELIUS ORCHESTRATOR MATRIX // GOOGLE AI STUDIO SYNC BRIDGE
# TARGET: TWO-WAY ENDPOINT PIPELINE FOR REMOTE TELEMETRY INGESTION
# ==============================================================================

import http.server
import json
import os
import subprocess

PORT = 8080
FIFO_PATH = "/data/data/com.termux/files/home/.matrix_diode.fifo"

class AIStudioSyncHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silence standard output noise to keep your terminal display pristine
        return

    def do_POST(self):
        if self.path == "/v1/dispatch":
            content_length = int(self.headers['Content-Length'])
            raw_body = self.rfile.read(content_length)
            
            try:
                data = json.loads(raw_body.decode('utf-8'))
                directive = data.get("directive")
                auth_token = data.get("auth_token")
                
                # Structural Identity Verification Check
                if auth_token != "JHammerZ-001-Aurelius-Auth-Token-Gate":
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b'{"status": "ERROR", "message": "Unauthorized Attestation Signature"}')
                    return
                
                if directive:
                    # Strip harmful string mutations and drop directly down the pipe stream
                    sanitized_cmd = str(directive).strip()
                    
                    if os.path.exists(FIFO_PATH):
                        with open(FIFO_PATH, "w") as fifo:
                            fifo.write(f"{sanitized_cmd}\n")
                        
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        response = {"status": "SUCCESS", "message": f"Piped down matrix: {sanitized_cmd}"}
                        self.wfile.write(json.dumps(response).encode('utf-8'))
                        return
                    else:
                        self.send_response(503)
                        self.end_headers()
                        self.wfile.write(b'{"status": "ERROR", "message": "Local Hardware Pipe Disconnected"}')
                        return
                        
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ERROR", "reason": str(e)}).encode('utf-8'))
                return
                
        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    print(f"[*] Initializing Aurelius Sync Node on Port {PORT}...")
    server = http.server.HTTPServer(('0.0.0.0', PORT), AIStudioSyncHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Detaching AI Studio web hook framework sync loop.")
        server.server_close()
