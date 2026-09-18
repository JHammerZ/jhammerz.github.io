#!/usr/bin/env python3
import socket
import sys
import threading
import os
import subprocess

print("\033[1;36m[*] Activating Localized P2P Mesh Terminal Chat Server...\033[0m")

# Automated Port Release: Find and kill any old instances holding port 9999 open
try:
    # Query system network sockets for processes binding port 9999 natively
    pid_check = subprocess.check_output("fuser 9999/tcp 2>/dev/null", shell=True).decode().strip()
    if pid_check:
        print(f"  -> \033[1;33m[INTERFACE LOCK ACTIVE]\033[0m Releasing process {pid_check} holding socket tracks...")
        os.system("fuser -k 9999/tcp >/dev/null 2>&1")
except:
    pass

print("  -> Binding socket interfaces to Link-Local IPv6 scope...")

try:
    server = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('::', 9999))
    server.listen(5)
    print("  -> \033[1;32m[ONLINE]\033[0m Mesh Server actively listening on port \033[1;33m9999\033[0m completely offline.")
except Exception as e:
    print(f"  -> \033[1;31m[BIND ERROR]\033[0m Hardware socket busy or restricted: {e}")
    sys.exit(1)

def handle_client(client_sock, client_addr):
    client_sock.sendall(b"\n==================================================\n  AURELIUS AD-HOC MESH COGNITIVE CHAT INTERFACE  \n==================================================\nWelcome peer node connection.\nType /exit to decouple.\n\n[Mesh-Chat]: ")
    while True:
        try:
            data = client_sock.recv(1024)
            if not data or b"/exit" in data: break
            print(f"\n[MESH TRAFFIC] Captured packet from {client_addr}: {data.decode().strip()}")
            client_sock.sendall(b"[ACK] Telemetry payload received.\n[Mesh-Chat]: ")
        except: break
    client_sock.close()

try:
    conn, addr = server.accept()
    print(f"  -> \033[1;32m[CONNECTION ESTABLISHED]\033[0m Neighbor node peer linked from: {addr}")
    t = threading.Thread(target=handle_client, args=(conn, addr))
    t.start()
except KeyboardInterrupt:
    pass
finally:
    server.close()
