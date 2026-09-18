import socket
import json
import time
import threading
import sys

class JanusSovereignProxyGateway:
    def __init__(self, incoming_port=7007, outgoing_stream_port=9009, auth_token="H-FID-100-AUTH"):
        """
        Initializes the Janus Proxy Gateway.
        Relays compiled flow-control telemetry structures to target web nodes seamlessly.
        """
        self.version = "1.0.0-Proxy"
        self.in_port = incoming_port
        self.out_port = outgoing_stream_port
        self.auth_token = auth_token
        self.running = False
        
        print("======================================================================")
        print("[+] [.JHam] INITIALIZING SOVEREIGN JANUS PROXY GATEWAY SYSTEM")
        print(f"[+] Active Authorization Key : {self.auth_token}")
        print(f"[+] Gateway Structural Ports : Inbound: {self.in_port} ➔ Outbound: {self.out_port}")
        print("======================================================================")

    def host_outbound_streaming_node(self):
        """Spins up a lightweight distribution socket for external web rendering engines."""
        print("[➔] [Proxy Outbound]: Opening digital data distribution node...")
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            server.bind(("0.0.0.0", self.out_port))
            server.listen(5)
            while self.running:
                client, addr = server.accept()
                # Run asynchronous relay sessions per connected listener
                threading.Thread(target=self.stream_telemetry_relay, args=(client,), daemon=True).start()
        except Exception as e:
            print(f"[-] [Proxy Network Anomaly]: Exception on broadcast port {self.out_port}: {e}")
        finally:
            server.close()

    def stream_telemetry_relay(self, web_client_socket):
        """Pulls raw matrix states out of your running sandbox and pipes them out to listeners."""
        try:
            web_client_socket.settimeout(3.0)
            print("[+] [Proxy Sync Handshake]: Web visualization tool successfully tethered.")
            
            # Fetch a live snapshot frame from the running loop VM on Port 7007
            sandbox_connector = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sandbox_connector.connect(("127.0.0.1", self.in_port))
            
            # Authenticate against H-FID token constraints
            sandbox_connector.sendall((self.auth_token + "\n").encode('utf-8'))
            raw_payload = sandbox_connector.recv(4096)
            sandbox_connector.close()
            
            # Relay the clean spatial array blocks straight out to the web window
            web_client_socket.sendall(raw_payload)
            
        except Exception:
            pass
        finally:
            web_client_socket.close()

    def boot_proxy_gateway(self):
        self.running = True
        proxy_thread = threading.Thread(target=self.host_outbound_streaming_node, daemon=True)
        proxy_thread.start()
        
        print("[✓] Janus Proxy Gateway running smoothly across parallel memory layers.")
        print("[*] Monitoring streaming packet transaction queues. Press Ctrl+C to minimize.")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n[*] Halting proxy routing streams. Safely closing communication lanes.")
            self.running = False
            time.sleep(0.5)

if __name__ == "__main__":
    gateway = JanusSovereignProxyGateway()
    gateway.boot_proxy_gateway()
