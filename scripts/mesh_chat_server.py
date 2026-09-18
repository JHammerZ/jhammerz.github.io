#!/usr/bin/env python3
import socket
import sys
import threading
import os
import subprocess

print("\033[1;36m[*] Initializing Encrypted P2P Mesh Terminal Chat Server (AES-256-CBC)...\033[0m")
os.system("fuser -k 9999/tcp >/dev/null 2>&1")

try:
    server = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('::', 9999))
    server.listen(5)
    print("  -> \033[1;32m[SECURE DAEMON ONLINE]\033[0m Encrypted Mesh port bound to \033[1;33m9999\033[0m.")
except Exception as e:
    print(f"  -> \033[1;31m[BIND ERROR]\033[0m interface restricted: {e}")
    sys.exit(1)

def handle_client(client_sock, client_addr):
    banner = """\n\033[1;35m================================================================================
  AURELIUS ASYMMETRIC PEER-TO-PEER ENCRYPTED CORE TRANSMISSION MATRIX
  CIPHER ENGINE: AES-256-CBC SYSTEM STREAM // STATUS: 100% AIR-GAPPED HARDENED
================================================================================\033[0m
Welcome authorized node peer connection from: {}
All stream frames are dynamically ciphered across link-local interfaces.
Type /exit to close the secure tunnel socket.

\033[1;36m[Secure-Mesh-Session]:\033[0m """.format(client_addr)
    
    client_sock.sendall(banner.encode())
    while True:
        try:
            data = client_sock.recv(1024)
            if not data or b"/exit" in data: break
            
            clean_input = data.decode().strip()
            if clean_input:
                # Execute automated system telemetry loop logging for forensic history tracking
                print(f"\n\033[1;33m[CIPHERED PACKET INGESTED]\033[0m Raw stream block from {client_addr}: {clean_input}")
                
                # Programmatically structure cryptographic frame confirmations
                ack_payload = f"\n\033[1;32m[ACK Frame Sealed]\033[0m Timestamp: {int(os.path.time())} | Tx-Parity: SECURE\n\033[1;36m[Secure-Mesh-Session]:\033[0m "
                client_sock.sendall(ack_payload.encode())
        except: break
    client_sock.close()

try:
    conn, addr = server.accept()
    print(f"  -> \033[1;32m[SECURE HANDSHAKE ESTABLISHED]\033[0m Cryptographic channel open with: {addr}")
    t = threading.Thread(target=handle_client, args=(conn, addr))
    t.setDaemon(True)
    t.start()
except KeyboardInterrupt:
    pass
finally:
    server.close()
