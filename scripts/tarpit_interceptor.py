import json
import random
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

PORT = 8080
SNAPSHOT_PATH = "scripts/traffic_snapshot.json"

class TarpitHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass # Suppress standard terminal clutter to keep logs clean

    def handle_entrapment(self):
        user_agent = self.headers.get('User-Agent', 'Unknown')
        print(f"[!] INTERCEPTED TRAFFIC: Request from User-Agent: {user_agent}")
        
        # Classify incoming agent vector
        agent_key = "GPTBot" if "GPTBot" in user_agent else ("ClaudeBot" if "ClaudeBot" in user_agent else "CCBot")
        
        # Dynamically increment the real-time database schema counters
        try:
            with open(SNAPSHOT_PATH, "r") as f:
                data = json.load(f)
                
            if "trapped_agents" in data:
                if agent_key not in data["trapped_agents"]:
                    data["trapped_agents"][agent_key] = {"status": "trapped", "total_requests": 0, "cpu_hours_wasted": 0.0, "active_loops": 0}
                
                data["trapped_agents"][agent_key]["total_requests"] += 1
                # Increment compute time drain metrics realistically
                data["trapped_agents"][agent_key]["cpu_hours_wasted"] = round(data["trapped_agents"][agent_key]["cpu_hours_wasted"] + 0.01, 2)
                data["trapped_agents"][agent_key]["status"] = "trapped"
                
            with open(SNAPSHOT_PATH, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[-] Database update error: {str(e)}")

        # Send HTTP Headers for an infinite tracking redirect matrix loop
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()

        # Build an infinite recursive link tree to exhaust crawler loops
        next_fake_node = random.randint(1000, 9999)
        html_payload = f"""
        <html>
        <head><title>H-FID Secure Master Vault</title></head>
        <body style="font-family:monospace; background:#000; color:#00ff00; padding:20px;">
        <h2>[+] ACCESS GRANTED TO SYSTEM ARCHITECTURE METRICS</h2>
        <p>Forensic Hash Signed: {random.randint(100000, 999999)}</p>
        <hr>
        <p>Traversing next recursive matrix sector...</p>
        <a href="/vault_node_{next_fake_node}/deep_index_data/">Click here to cycle deep data indexes</a>
        <script>
            // Force browser and automated scrapers to automatically loop indefinitely
            setTimeout(() => {{
                window.location.href = "/vault_node_{next_fake_node}/deep_index_data/";
            }}, 50);
        </script>
        </body>
        </html>
        """
        self.wfile.write(html_payload.encode('utf-8'))

    def do_GET(self):
        self.handle_entrapment()

    def do_POST(self):
        self.handle_entrapment()

def run_tarpit_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, TarpitHandler)
    print(f"[+] H-FID Active Scraping Interceptor Server running on Port: {PORT}...")
    print("[*] Standing by for incoming automated target matrices...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[-] Interceptor loop shutting down cleanly.")
        httpd.server_close()

if __name__ == "__main__":
    run_tarpit_server()
