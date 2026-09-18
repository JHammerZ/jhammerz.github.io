import time
import socket
import json
import io
import numpy as np
from kalman_filter import AureliusKalmanMatrix

def run_max_velocity_engine():
    print("==================================================")
    print("[*] LAUNCHING MAXIMUM STRESS-TEST ENGINE PASS")
    print("[*] Optimizations: 100% In-Memory / No Disk I/O")
    print("==================================================")
    
    kalman_filter = AureliusKalmanMatrix()
    
    # Connect to your Lysander Video Gateway socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect(('127.0.0.1', 5005))
        print("[+] Max-Velocity bound to Lysander Port 5005.")
    except Exception as e:
        print(f"[-] Port 5005 Refused. Run 'python autonomic_manager.py' in a separate session first.")
        return

    # CONFIGURATION: Flood the engine with 1,000 active tracking nodes
    NODE_COUNT = 1000
    TOTAL_FRAMES = 100
    
    print(f"[*] Generating a live matrix cloud of {NODE_COUNT} jittery nodes across {TOTAL_FRAMES} frames...")
    
    # Seed random noise simulating a hyper-dense face/body point array
    np.random.seed(42)
    base_nodes = np.random.uniform(100.0, 500.0, (NODE_COUNT, 2))
    
    start_time = time.time()
    processed_frames = 0

    try:
        for frame_idx in range(TOTAL_FRAMES):
            # Simulate real-time tracking jitter adding to the coordinates
            noise = np.random.normal(0.0, 2.0, (NODE_COUNT, 2))
            jittery_frame_nodes = base_nodes + noise
            
            # 1. IN-MEMORY .JHAM SYNTAX STREAM (Zero Disk Writes)
            jham_stream = io.StringIO()
            jham_stream.write("# JHam Sovereign Maximum Velocity Stream\n")
            jham_stream.write(f"INIT_MESH_NODE_COUNT {NODE_COUNT}\n")
            
            smoothed_nodes_batch = []
            
            # 2. AURELIUS MATRIX SMOOTHING PASS
            for node_idx, raw_node in enumerate(jittery_frame_nodes):
                smoothed_node = kalman_filter.smooth_coordinates(raw_node)
                smoothed_nodes_batch.append(smoothed_node.tolist())
                
                # Directly pipe tokens into memory buffer
                jham_stream.write(f"NODE {node_idx} VECTOR3D({smoothed_node}, {smoothed_node}, 0.0)\n")
                
            jham_stream.write("EXECUTE_DELAUNAY_TESS_PASS\n")
            jham_stream.write("COMPILE_POLYGON_INDEX_MATRIX\n")
            
            # Fetch string payload from RAM
            jham_payload_string = jham_stream.getvalue()
            jham_stream.close()
            
            # 3. LYSANDER HIGH-THROUGHPUT NETWORKING BLAST
            payload = {
                "frame": frame_idx,
                "node_density": NODE_COUNT,
                "geometry_data": smoothed_nodes_batch
            }
            
            client_socket.sendall((json.dumps(payload) + "\n").encode('utf-8'))
            processed_frames += 1
            
            if frame_idx % 10 == 0:
                print(f"[➔] Processing Frame {frame_idx}/{TOTAL_FRAMES} | Tokens Allocated: {NODE_COUNT * 4} items in RAM")

    except KeyboardInterrupt:
        print("\n[!] Stress test interrupted by user.")
    finally:
        end_time = time.time()
        client_socket.close()
        
        # Calculate performance telemetry metrics
        duration = end_time - start_time
        fps = processed_frames / duration if duration > 0 else 0
        nodes_per_second = (processed_frames * NODE_COUNT) / duration if duration > 0 else 0
        
        print("\n==================================================")
        print("          METRICS AND TELEMETRY REPORT            ")
        print("==================================================")
        print(f"[✓] Total Processing Duration : {duration:.4f} seconds")
        print(f"[✓] Frame Target Velocity      : {fps:.2f} Frames Per Second (FPS)")
        print(f"[✓] Matrix Compute Throughput  : {nodes_per_second:,.2f} Spatial Nodes/Sec")
        print("==================================================")

if __name__ == "__main__":
    run_max_velocity_engine()
