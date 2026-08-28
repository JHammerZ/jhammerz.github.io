#!/usr/bin/env python3
"""
"""

import sys
import socket
from pathlib import Path

HOST = "127.0.0.1"
PORT = 8080

def initialize_local_listener():
    print(f"📡 Initializing local socket interaction logger on {HOST}:{PORT}...")
    print("📋 Press [CTRL+C] to disconnect the telemetry terminal stream.")
    
    # Establish a clean, non-blocking TCP socket stream layer
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        server_socket.bind((HOST, PORT))
        server_socket.listen(5)
        print("🟢 Socket listener operational. Awaiting internal substrate requests...")
        
        while True:
            client_connection, client_address = server_socket.accept()
            request = client_connection.recv(1024).decode("utf-8", errors="ignore")
            
            # Extract out the absolute HTTP path tracking elements
            first_line = request.split("\n")[0] if request else "EMPTY REQUEST"
            print(f"⚡ [SOCKET INGRESS]: {client_address[0]} -> \"{first_line.strip()}\"")
            
            # Dispatch a clean, hardware-accelerated text/json response payload
            response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n{\"status\":\"Lysander Node Active\"}"
            client_connection.sendall(response.encode("utf-8"))
            client_connection.close()
            
    except KeyboardInterrupt:
        print("\n🛑 Severing local socket listener stream channels. Exiting safely.")
        server_socket.close()
        sys.exit(0)
    except Exception as e:
        print(f"❌ Socket execution exception dropped: {e}")
        server_socket.close()
        sys.exit(1)

if __name__ == "__main__":
    initialize_local_listener()
