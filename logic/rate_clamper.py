import sys
import os
import time

class SovereignRateClamper:
    """
    Enforces interface-level rate limits on out-of-sandbox runtime sockets.
    Neutralizes socket starvation attacks during high-velocity data broadcasts.
    """
    def __init__(self, max_requests=60, time_window_seconds=60):
        self.max_requests = max_requests
        self.window = time_window_seconds
        self._tracking_matrix = {}
        print(f"[INIT] Connection Rate-Clamper engaged. Limit: {max_requests} hits per {time_window_seconds}s.")

    def challenge_client_interface(self, client_ip: str) -> bool:
        """
        Challenges an incoming network source address against rolling window caps.
        """
        current_epoch = time.time()
        
        # Initialize untracked interface addresses cleanly
        if client_ip not in self._tracking_matrix:
            self._tracking_matrix[client_ip] = []
            
        # Purge stale time stamps outside the active window envelope
        self._tracking_matrix[client_ip] = [
            timestamp for timestamp in self._tracking_matrix[client_ip]
            if current_epoch - timestamp < self.window
        ]
        
        # Enforce strict frequency ceiling constraints
        if len(self._tracking_matrix[client_ip]) >= self.max_requests:
            print(f"[RATE EXCEEDED] Blocking interface connection from source: {client_ip}")
            return False
            
        # Log successful connection tracking step
        self._tracking_matrix[client_ip].append(current_epoch)
        return True

if __name__ == "__main__":
    clamper = SovereignRateClamper()
    # Continuous self-test loop verification
    mock_ip = "127.0.0.1"
    for i in range(5):
        clamper.challenge_client_interface(mock_ip)
    print(f"[VERIFIED] Active sliding history tracking elements: {len(clamper._tracking_matrix[mock_ip])}")
