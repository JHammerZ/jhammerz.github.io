import json
import random
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

PORT = 8080
SNAPSHOT_PATH = "scripts/traffic_snapshot.json"

# Track incoming sequential loop depth counts in memory
session_depth_matrix = {}

class TarpitHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def handle_entrapment(self):
        client_ip = self.client_address[0]
        user_agent = self.headers.get('User-Agent', 'Unknown')
        
        # Track loop iteration counters
        if client_ip not in session_depth_matrix:
            session_depth_matrix[client_ip] = 0
        session_depth_matrix[client_ip] += 1
        
        # CIRCUIT BREAKER: Sever connection if loop depth compromises system overhead
        if session_depth_matrix[client_ip] > 50:
            self.send_response(429)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"[-] System Resource Hold: Max Loop Depth Breached.")
            # Reset session counter
            session_depth_matrix[client_ip] = 0
            return

        agent_key = "GPTBot" if "GPTBot" in user_agent else ("ClaudeBot" if "ClaudeBot" in user_agent else "CCBot")
        
        try:
            with open(SNAPSHOT_PATH, "r") as f:
                data = json.load(f)
            if "trapped_agents" in data:
                if agent_key not in data["trapped_agents"]:
                    data["trapped_agents"][agent_key] = {"status": "trapped", "total_requests": 0, "cpu_hours_wasted": 0.0, "active_loops": 0}
                data["trapped_agents"][agent_key]["total_requests"] += 1
                data["trapped_agents"][agent_key]["cpu_hours_wasted"] = round(data["trapped_agents"][agent_key]["cpu_hours_wasted"] + 0.01, 2)
            with open(SNAPSHOT_PATH, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            pass

        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()

        next_fake_node = random.randint(1000, 9999)
        html_payload = f"""
        <html>
        <body style="font-family:monospace; background:#000; color:#00ff00; padding:20px;">
        <h2>[+] MATRIX SECTOR ACTIVE</h2>
        <a href="/vault_node_{next_fake_node}/">Loop Sector</a>
        <script>setTimeout(() => {{ window.location.href = "/vault_node_{next_fake_node}/"; }}, 50);</script>
        </body>
        </html>
        """
        self.wfile.write(html_payload.encode('utf-8'))

    def do_GET(self): self.handle_entrapment()
    def do_POST(self): self.handle_entrapment()

def run_tarpit_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, TarpitHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == "__main__":
    run_tarpit_server()
