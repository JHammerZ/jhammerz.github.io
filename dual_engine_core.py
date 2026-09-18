import time
import socket
import json
import io
import queue
import threading
import numpy as np
from kalman_filter import AureliusKalmanMatrix

# Thread-safe queue to pass structural data frames between engines instantly
matrix_exchange_queue = queue.Queue(maxsize=10)

def aurelius_compute_engine(node_count, total_frames):
    """
    ENGINE LAYER 1: The Aurelius Compute Core.
    Handles high-speed matrix smoothing math and raw .JHam token serialization in RAM.
    """
    print("[+] [Aurelius Core] Compute Engine online and accelerating.")
    kalman_filter = AureliusKalmanMatrix()
    
    np.random.seed(42)
    base_nodes = np.random.uniform(100.0, 500.0, (node_count, 2))
    
    for frame_idx in range(total_frames):
        noise = np.random.normal(0.0, 2.0, (node_count, 2))
        jittery_frame_nodes = base_nodes + noise
        
        # 1. Faster Vector Math Optimization
        smoothed_nodes_batch = []
        jham_stream = io.StringIO()
        jham_stream.write(f"INIT_MESH_NODE_COUNT {node_count}\n")
        
        for node_idx, raw_node in enumerate(jittery_frame_nodes):
            smoothed_node = kalman_filter.smooth_coordinates(raw_node)
            smoothed_nodes_batch.append(smoothed_node.tolist())
            jham_stream.write(f"NODE {node_idx} VECTOR3D({smoothed_node}, {smoothed_node}, 0.0)\n")
            
        jham_stream.write("EXECUTE_DELAUNAY_TESS_PASS\n")
        jham_stream.close()
        
        # 2. Handoff to Queue: Push completed geometry data to the streaming pipeline
        payload = {
            "frame": frame_idx,
            "node_density": node_count,
            "geometry_data": smoothed_nodes_batch
        }
        
        # Blocks momentarily only if the pipeline queue is completely full
        matrix_exchange_queue.put(payload)
        
    # Signal to the networking thread that calculations are complete
    matrix_exchange_queue.put(None)
    print("[✓] [Aurelius Core] Completed all geometric compilation ticks.")

def lysander_network_engine():
    """
    ENGINE LAYER 2: The Lysander Network Pipeline.
    Manages socket handshakes and broadcasts geometric asset bundles asynchronously.
    """
    print("[+] [Lysander Pipeline] Network Streaming Loop online.")
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect(('127.0.0.1', 5005))
        print("[+] [Lysander Pipeline] Connected to Port 5005 Gateway.")
    except Exception as e:
        print(f"[-] Network connection error: {e}. Run 'python autonomic_manager.py' first.")
        return

    while True:
        # Fetch the next compiled frame asset out of RAM the moment it's ready
        frame_payload = matrix_exchange_queue.get()
        if frame_payload is None:
            matrix_exchange_queue.task_done()
            break
            
        # Fast JSON streaming over the active socket
        try:
            client_socket.sendall((json.dumps(frame_payload) + "\n").encode('utf-8'))
        except Exception as e:
            print(f"[-] [Lysander Pipeline] Packet drop error: {e}")
            
        matrix_exchange_queue.task_done()
        
    client_socket.close()
    print("[✓] [Lysander Pipeline] Closed communication paths cleanly.")

if __name__ == "__main__":
    print("==================================================")
    print("[*] INITIALIZING PARALLEL DUAL-ENGINE ARCHITECTURE")
    print("==================================================")
    
    NODE_COUNT = 1000
    TOTAL_FRAMES = 100
    
    start_time = time.time()
    
    # Initialize and fire up both engines on independent processing threads
    compute_thread = threading.Thread(target=aurelius_compute_engine, args=(NODE_COUNT, TOTAL_FRAMES))
    network_thread = threading.Thread(target=lysander_network_engine)
    
    compute_thread.start()
    network_thread.start()
    
    # Wait for both independent loops to cross the finish line
    compute_thread.join()
    network_thread.join()
    
    duration = time.time() - start_time
    fps = TOTAL_FRAMES / duration
    throughput = (TOTAL_FRAMES * NODE_COUNT) / duration
    
    print("\n==================================================")
    print("          DUAL-ENGINE TELEMETRY REPORT            ")
    print("==================================================")
    print(f"[✓] Total Compute Runtime     : {duration:.4f} seconds")
    print(f"[✓] Asynchronous Velocity     : {fps:.2f} Frames Per Second (FPS)")
    print(f"[✓] Combined Pipeline Speed   : {throughput:,.2f} Spatial Nodes/Sec")
    print("==================================================")
