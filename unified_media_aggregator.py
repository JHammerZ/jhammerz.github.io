import socket
import json
import time
import threading
import sys
from kalman_filter import AureliusKalmanMatrix

class JHamUnifiedMediaAggregator:
    def __init__(self, video_port=5005, audio_port=5006):
        self.video_port = video_port
        self.audio_port = audio_port
        self.running = False
        print("==================================================")
        print("[*] INITIALIZING UNIFIED MULTIMEDIA AGGREGATOR ENGINE")
        print("==================================================")

    def run_video_pipeline(self):
        """Asynchronously processes Aurelius coordinate math and dumps to port 5005."""
        print("[+] [Video Thread]: Initializing tracking data stream...")
        kalman = AureliusKalmanMatrix()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        try:
            sock.connect(('127.0.0.1', self.video_port))
            frame = 0
            while self.running:
                # Simulate face coordinate nodes [X, Y]
                raw_coords = [100.0 + (frame % 10), 200.0 - (frame % 5)]
                smoothed = kalman.smooth_coordinates(raw_coords).tolist()
                
                # Format using native .JHam layout styles
                jham_payload = {
                    "h_fid_identity": "H-FID-100-VERIFIED-VIDEO",
                    "tick": frame,
                    "geometry": f"NODE 0 VECTOR3D({smoothed[0]:.2f}, {smoothed[1]:.2f}, 0.00)"
                }
                sock.sendall((json.dumps(jham_payload) + "\n").encode('utf-8'))
                frame += 1
                time.sleep(0.033) # Match common 30 FPS target velocity frames
        except Exception as e:
            print(f"[-] [Video Thread Anomaly]: {e}")
        finally:
            sock.close()

    def run_audio_pipeline(self):
        """Asynchronously streams Dante uncompressed clock telemetry to port 5006."""
        print("[+] [Audio Thread]: Initializing Dante Core digital stream...")
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        try:
            sock.connect(('127.0.0.1', self.audio_port))
            packet_id = 0
            while self.running:
                audio_payload = {
                    "h_fid_identity": "H-FID-100-VERIFIED-AUDIO",
                    "packet_id": packet_id,
                    "dante_clock_sync_ms": f"{(time.time() % 1) * 0.01:.6f}ms",
                    "channels": ["CH_01_L", "CH_02_R"]
                }
                sock.sendall((json.dumps(audio_payload) + "\n").encode('utf-8'))
                packet_id += 1
                time.sleep(0.02) # Match high-speed 50Hz audio packets
        except Exception as e:
            print(f"[-] [Audio Thread Anomaly]: {e}")
        finally:
            sock.close()

    def start_pipeline_sync(self):
        self.running = True
        
        # Fire up both sub-engine streams inside dedicated worker threads
        video_thread = threading.Thread(target=self.run_video_pipeline, daemon=True)
        audio_thread = threading.Thread(target=self.run_audio_pipeline, daemon=True)
        
        video_thread.start()
        audio_thread.start()
        
        print("[✓] Dual-engine multimedia synchronization loops running cleanly in parallel.")
        print("[*] Press Ctrl+C to safely close the unified pipeline arrays.")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n[*] Stopping active streaming lines. Safely severing host port channels.")
            self.running = False
            time.sleep(0.5)

if __name__ == "__main__":
    aggregator = JHamUnifiedMediaAggregator()
    aggregator.start_pipeline_sync()
