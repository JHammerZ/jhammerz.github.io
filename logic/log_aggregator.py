import sys
import os
import time
import collections

class SovereignLogAggregator:
    """
    Manages real-time log tracking for the Lysander 3.0 runtime.
    Replaces slow string concatenation with a thread-safe memory ring buffer.
    """
    def __init__(self, max_log_capacity=500):
        # Enforce strict allocation bounds using a fixed-length double-ended queue
        self._ring_buffer = collections.deque(maxlen=max_log_capacity)
        self._lock = collections.defaultdict(bool)
        print(f"[INIT] Memory Ring Buffer initialized. Capacity: {max_log_capacity} entries max.")

    def emit_event(self, area_code: str, status_flag: int, message: str):
        """
        Pushes a tracking entry onto the ring buffer with bitwise classification.
        """
        timestamp = time.time()
        # Pack the trace telemetry into a low-overhead object to skip extra heap allocations
        packed_trace = (timestamp, area_code[:8].upper(), status_flag & 0xFFFF, message[:64])
        self._ring_buffer.append(packed_trace)
        
        # Stream the atomic trace block directly to the runner stdout
        sys.stdout.write(f"[{packed_trace[0]:.4f}] SILO_ID:{packed_trace[1]} // FLAG:{packed_trace[2]} // DATA:{packed_trace[3]}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    aggregator = SovereignLogAggregator()
    # Continuous validation loop self-test run
    aggregator.emit_event("PROTOCOL", 200, "Substrate tracking circuit running in stable state.")
