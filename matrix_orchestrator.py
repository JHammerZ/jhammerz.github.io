import time
import socket
import json
from kalman_filter import AureliusKalmanMatrix
from jham_compiler_bridge import JHamCompilerBridge

def run_lysander_aurelius_core():
    print("==================================================")
    print("[*] Launching Integrated Aurelius-Lysander Loop")
    print("==================================================")
    
    # Initialize Core Engine Modules
    kalman_filter = AureliusKalmanMatrix()
    jham_bridge = JHamCompilerBridge()
    
    # Establish local client connection to the Lysander Video Gateway port 5005
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect(('127.0.0.1', 5005))
        print("[+] Bound to Lysander Video Gateway on port 5005 successfully.")
    except Exception as e:
        print(f"[-] Failed to link to Lysander Video Gateway socket: {e}")
        print("[-] Ensure python autonomic_manager.py is actively running in the background.")
        return

    # Simulate an active live tracking stream (e.g., 5 raw camera capture frames)
    live_stream_simulation = [
        [[100.0, 200.0], [150.0, 250.0]],
        [[102.1, 198.5], [148.9, 251.2]],
        [[99.3,  201.1], [151.2, 249.7]],
        [[101.5, 199.0], [150.1, 250.4]],
        [[100.2, 200.3], [149.8, 250.1]]
    ]
    
    try:
        for tick, raw_frame_coords in enumerate(live_stream_simulation):
            print(f"\n--- [Engine Tick {tick}] ---")
            
            # 1. Aurelius Matrix Smoothing Pass
            smoothed_frame_nodes = []
            for node in raw_frame_coords:
                smoothed_node = kalman_filter.smooth_coordinates(node)
                smoothed_frame_nodes.append(smoothed_node.tolist())
                
            # 2. Compile into Sovereign .JHam Format 
            jham_source = jham_bridge.compile_geometry_mesh(smoothed_frame_nodes)
            
            # 3. Ship tokenized coordinate payloads over Lysander Media Pipelines
            payload = {
                "engine_tick": tick,
                "geometry_data": smoothed_frame_nodes,
                "jham_manifest": "active_face_mesh.JHam"
            }
            
            client_socket.sendall((json.dumps(payload) + "\n").encode('utf-8'))
            print(f"[+] Dispatched tracking token payload to Video Gateway port 5005.")
            
            time.sleep(1) # Keep pace with camera frame rates
            
    except KeyboardInterrupt:
        print("\n[*] Halting active runtime engine loop smoothly.")
    finally:
        client_socket.close()

if __name__ == "__main__":
    run_lysander_aurelius_core()
