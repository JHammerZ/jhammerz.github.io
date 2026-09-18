import socket
import threading
import time
import sys

def mock_media_gateway(port, service_name):
    """Initializes a local background socket to host the media stream."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind(('127.0.0.1', port))
        server.listen(5)
        print(f"[+] [Lysander] {service_name} operational and listening on port {port}")
        while True:
            client, addr = server.accept()
            # Maintain active streaming channel
            threading.Thread(target=handle_stream, args=(client,)).start()
    except Exception as e:
        print(f"[-] {service_name} initialization failure on port {port}: {e}")
    finally:
        server.close()

def handle_stream(client_socket):
    try:
        while True:
            data = client_socket.recv(1024)
            if not data:
                break
    except ConnectionResetError:
        pass
    finally:
        client_socket.close()

if __name__ == "__main__":
    print("==================================================")
    print("[*] Launching Aurelius-Lysander Orchestrator Loop")
    print("==================================================")
    
    # Spin up Lysander Engine Media Gateways in background worker threads
    video_thread = threading.Thread(target=mock_media_gateway, args=(5005, "Video Gateway"), daemon=True)
    audio_thread = threading.Thread(target=mock_media_gateway, args=(5006, "Audio Gateway"), daemon=True)
    
    video_thread.start()
    audio_thread.start()
    
    # Keep master loop running to handle incoming engine tasks
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[*] Terminating core engine environments safely.")
        sys.exit(0)
