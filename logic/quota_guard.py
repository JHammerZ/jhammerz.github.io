import sys
import os
import time

def enforce_thread_quotas(max_cpu_seconds=2.0, max_memory_mb=128):
    """
    Sets deterministic hardware runtime limits on the active thread.
    Instantly terminates execution if an operation violates allocation parameters.
    """
    try:
        import resource
        
        # Enforce CPU Time Limit per process execution cycle
        resource.setrlimit(resource.RLIMIT_CPU, (int(max_cpu_seconds), int(max_cpu_seconds) + 1))
        
        # Enforce Max Virtual Memory Size (RLIMIT_AS) in bytes
        memory_bytes = max_memory_mb * 1024 * 1024
        resource.setrlimit(resource.RLIMIT_AS, (memory_bytes, memory_bytes + (1024 * 1024)))
        
        print(f"[QUOTA ACTIVE] Caps configured: CPU={max_cpu_seconds}s // RAM={max_memory_mb}MB.")
        return True
    except ImportError:
        # Fallback for systems lacking standard POSIX resource control features
        print("[WARN] POSIX resource boundaries unavailable. Utilizing manual timing checks.")
        return False

class StructuralExecutionTimer:
    """
    Manual context manager fallback to handle runtime deadlines.
    """
    def __enter__(self):
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.time() - self.start_time
        if duration > 2.0:
            print(f"[TIMEOUT ALERT] Operation exceeded strict time envelope: {duration:.4f}s.")
            os._exit(1)

if __name__ == "__main__":
    # Initialize the hardware quota guard
    enforce_thread_quotas()
