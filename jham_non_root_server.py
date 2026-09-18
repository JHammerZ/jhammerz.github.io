import http.server
import socketserver
import json
import os
import sys

# Define unprivileged user-space execution port
PORT = 9999

class JHamNonRootProxyHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silence standard HTTP terminal logging to prevent console buffer saturation
        return

    def do_GET(self):
        """Maps HTTP requests directly to memory variables or localized directory channels."""
        if self.path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            # Read current active sovereign core parameters asynchronously out of local files
            telemetry_snapshot = {"status": "ONLINE", "profile": "NON_ROOT_USER_SPACE_ACTIVE"}
            if os.path.exists("jham-ide/live_telemetry.json"):
                try:
                    with open("jham-ide/live_telemetry.json", "r") as f:
                        telemetry_snapshot = json.load(f)
                except Exception:
                    pass
            self.wfile.write(json.dumps(telemetry_snapshot).encode('utf-8'))
            return
            
        # Default behavior: Serve standard static web assets out of your repository directory
        return super().do_GET()

if __name__ == "__main__":
    print("======================================================================")
    print(f"[★] INITIALIZING SOVEREIGN NON-ROOT LOCAL INTEROP SERVER")
    print(f"[★] Architecture Class: Unprivileged User-Space Proxy Substrate")
    print(f"[★] Bound Endpoint Target: HTTP://127.0.0.1:{PORT}")
    print("======================================================================")
    
    # Change current working path explicitly to your safe home repository directory layout
    os.chdir("/data/data/com.termux/files/home/jhammerz.github.io")
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), JHamNonRootProxyHandler) as httpd:
        print("[✓] Non-root server actively running. Memory channels listening smoothly...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[*] Shutting down non-root interop gates safely.")
            sys.exit(0)
