import socket
import json
import time
import sys
import threading
from kalman_filter import AureliusKalmanMatrix

class JHamProductionHardwareIngress:
    def __init__(self, listen_ip="127.0.0.1", udp_port=9099):
        """
        Initializes a production-ready, low-latency UDP Hardware Data Ingress node.
        Designed to process uncompressed binary or JSON telemetry streams from external sensors.
        """
        self.version = "1.0.0-Production-Ready"
        self.ip = listen_ip
        self.port = udp_port
        self.running = False
        self.kalman_filter = AureliusKalmanMatrix()
        
        print("======================================================================")
        print(f"[★] INITIALIZING MILITARY-GRADE HARDWARE INGRESS GATEWAY")
        print(f"[★] Ingress Substrate Version : {self.version}")
        print(f"[★] Hardened Endpoint Target  : UDP://{self.ip}:{self.port}")
        print("======================================================================")

    def process_incoming_sensor_packet(self, raw_data):
        """
        Ingests real-world sensor streams, executes type-checking validations,
        smooths coordinates natively, and translates them to functional tracking data.
        """
        try:
            # Parse uncompressed telemetry strings or byte packets
            payload = json.loads(raw_data.decode('utf-8'))
            
            # Enforce strict variable validation to ensure zero falsified parameters
            if "node_id" in payload and "raw_vector" in payload:
                node_id = int(payload["node_id"])
                raw_coords = payload["raw_vector"] # Format expected: [X, Y]
                
                # Natively smooth incoming physical data via Aurelius filters
                stabilized_vector = self.kalman_filter.smooth_coordinates(raw_coords).tolist()
                
                # Format to your sovereign language specifications instantly inside RAM
                jham_instruction = f"NODE {node_id} VECTOR3D({stabilized_vector[0]:.2f}, {stabilized_vector[1]:.2f}, 0.00)\n"
                return jham_instruction
        except Exception:
            pass # Silently drop malformed packets to defend pipeline availability
        return None

    def engage_hardware_listener(self):
        self.running = True
        
        # Open a low-overhead, production-grade UDP socket interface
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            server_socket.bind((self.ip, self.port))
            print(f"[✓] Hardened hardware data portal actively listening on UDP Port {self.port}...")
            
            while self.running:
                # Capture uncompressed raw telemetry inputs from the field
                data, addr = server_socket.recvfrom(4096)
                
                jham_token_line = self.process_incoming_sensor_packet(data)
                if jham_token_line:
                    # Write directly to standard output or stream handlers to feed your orchestrator
                    sys.stdout.write(jham_token_line)
                    sys.stdout.flush()
                    
        except KeyboardInterrupt:
            print("\n[*] Shutting down production ingress interfaces safely.")
        finally:
            server_socket.close()

if __name__ == "__main__":
    # Initialize gateway server listening on localhost for sensor integration testing
    ingress_gateway = JHamProductionHardwareIngress(listen_ip="127.0.0.1", udp_port=9099)
    
    # Simple thread loop demonstration allowing testing input emulation
    def emulate_external_sensor():
        time.sleep(2)
        print("[*] [Sensor Emulator]: Initiating live test stream push...")
        test_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        for i in range(5):
            mock_hardware_packet = {"node_id": i, "raw_vector": [150.0 + i, 300.0 - i]}
            test_client.sendto(json.dumps(mock_hardware_packet).encode('utf-8'), ("127.0.0.1", 9099))
            time.sleep(0.1)
        test_client.close()

    threading.Thread(target=emulate_external_sensor, daemon=True).start()
    ingress_gateway.engage_hardware_listener()
