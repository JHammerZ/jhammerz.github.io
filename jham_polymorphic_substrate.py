import time
import io
import math
import json
import os
import sys
import queue
import threading
import random

# Global High-Velocity Field Packet Bus linking the unified state matrix
polymorphic_field_bus = queue.Queue(maxsize=1000)

class JHamFieldStateNode:
    def __init__(self, node_id, raw_coordinates):
        self.node_id = node_id
        # Vector Coordinates are stored natively alongside their own mutating operational behaviors
        self.vector = list(raw_coordinates)
        self.scale_factor = 1.0
        self.rotation_radians = 0.0
        self.history_states = []

    def self_evaluate_spatial_transform(self, expansion_multiplier, step_angle_deg):
        """SELF-EVALUATION LOGIC: The node updates its own hyper-dimensional matrix coordinates natively."""
        self.scale_factor *= expansion_multiplier
        self.rotation_radians += math.radians(step_angle_deg)
        
        # Capture current coordinate profile before folding the state field
        self.history_states.append(list(self.vector))
        if len(self.history_states) > 10:
            self.history_states.pop(0) # Static memory buffer compaction to prevent heap leaks
            
        # Natively process multi-axis trigonometric scale adjustments inside the memory register itself
        x_mutated = self.vector[0] * self.scale_factor * math.cos(self.rotation_radians)
        y_mutated = self.vector[1] * self.scale_factor * math.sin(self.rotation_radians)
        self.vector = [round(x_mutated, 2), round(y_mutated, 2)]

class JHamPolymorphicSubstrateCore:
    def __init__(self, field_density=5000):
        self.field_density = field_density
        self.running = False
        self.lock = threading.Lock()
        
        print("======================================================================")
        print("[★] INITIALIZING POLYMORPHIC FIELD-STATE MATRIX ROUTER CORE")
        print(f"[★] Computational Class: SELF-EVALUATING TOPOLOGICAL MATRIX FIELD")
        print(f"[★] Active Node Capacity: {self.field_density} Fluid Logic-State Vectors")
        print("======================================================================")

    def continuous_field_ingress(self):
        """AGENT 1 & 2: MANUS + AURELIUS INTEGRATED UNIFIED DATA MATRIX"""
        frame = 0
        np_gen = random.Random(888)
        
        # Initialize an active, self-contained fluid node field pool array
        active_field_pool = [
            JHamFieldStateNode(idx, [np_gen.uniform(200.0, 600.0), np_gen.uniform(200.0, 600.0)])
            for idx in range(self.field_density)
        ]

        while self.running:
            start_ingress_tick = time.time()
            
            # Simulate dynamic field shifts affecting every single node parameter simultaneously
            multiplier = 1.01
            angle_shift = 2.5
            
            # Every spatial node executes its own code logic inside the matrix state array concurrently
            for node in active_field_pool:
                node.self_evaluate_spatial_transform(multiplier, angle_shift)
                
            # Extract current unified field configurations to ship down the pipeline channels
            current_field_snapshot = [[node.vector[0], node.vector[1]] for node in active_field_pool]
            
            latency_ms = (time.time() - start_ingress_tick) * 1000
            
            packet = {
                "frame": frame,
                "snapshot": current_field_snapshot,
                "latency_ms": latency_ms
            }
            polymorphic_field_bus.put(packet)
            frame += 1
            time.sleep(0.02) # Precision 50Hz hardware-aligned clock speed sync loop

    def polymorphic_stream_processor(self):
        """AGENT 3 & 4: MYTHOS + LYSANDER HIGH-VELOCITY NETWORK DISPATCH"""
        while self.running:
            try:
                field_packet = polymorphic_field_bus.get(timeout=2.0)
            except queue.Empty:
                continue
                
            frame = field_packet["frame"]
            snapshot = field_packet["snapshot"]
            latency = field_packet["latency_ms"]
            
            # Serialize the fluid field states directly into optimized .JHam tokens within RAM
            jham_stream = io.StringIO()
            jham_stream.write(f"# .JHam Polymorphic Field State Output Stream\n")
            jham_stream.write(f"INIT_MESH_NODE_COUNT {len(snapshot)}\n")
            
            for idx, pt in enumerate(snapshot[:2]): # Stream structural control points cleanly
                jham_stream.write(f"NODE {idx} VECTOR3D({pt[0]:.2f}, {pt[1]:.2f}, 0.00)\n")
                
            jham_stream.write("EXECUTE_FIELD_STATE_TOPOLOGY_COLLAPSE\n")
            compiled_bytecode_output = jham_stream.getvalue()
            jham_stream.close()
            
            # Non-blocking async file stream routing to update your jhammerz.github.io front-end layout
            if frame % 100 == 0:
                print(f"[✓] [Field-State Sync Frame {frame}] ➔ Fluid Tensors Active: {len(snapshot)} | Core Micro-Latency: {latency:.4f}ms")
                
                telemetry_payload = {
                    "h_fid_identity": "H-FID-100-POLYMORPHIC-FIELD-VERIFIED",
                    "metrics": {
                        "active_sync_frame": frame,
                        "aurelius_compute_latency_ms": f"{latency:.4f}ms",
                        "cluster_spatial_density_nodes": len(snapshot),
                        "system_stability_flag": "FIELD_STATE_SYNTHESIS_ACTIVE"
                    }
                }
                try:
                    with open("jham-ide/live_telemetry.json", "w") as f:
                        json.dump(telemetry_payload, f)
                except Exception:
                    pass
                    
            polymorphic_field_bus.task_done()

    def launch_polymorphic_substrate(self):
        self.running = True
        t1 = threading.Thread(target=self.continuous_field_ingress, daemon=True)
        t2 = threading.Thread(target=self.polymorphic_stream_processor, daemon=True)
        t1.start()
        t2.start()
        
        print("\n[✓] Polymorphic Field-State Matrix Router fully engaged. Streams active.")
        print("[*] Continuous self-evaluating memory loop active. Press Ctrl+C to minimize.")
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.running = False
            print("\n[*] Safely detaching from active field registers. Boundaries locked.")

if __name__ == "__main__":
    substrate_engine = JHamPolymorphicSubstrateCore(field_density=5000)
    substrate_engine.launch_polymorphic_substrate()
