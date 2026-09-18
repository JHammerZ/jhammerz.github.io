import numpy as np

class AureliusKalmanMatrix:
    def __init__(self, process_variance=1e-4, measurement_variance=1e-2):
        """
        Initializes the Aurelius Matrix Coordinate Smoothing Filter.
        Keeps an internal state estimate for 2D/3D tracking vectors to counter data noise.
        """
        self.q = process_variance      # Process noise covariance
        self.r = measurement_variance  # Measurement noise covariance
        self.initialized = False
        
        # State tracking matrices
        self.x_post = None             # Posterio state estimate
        self.p_post = None             # Posterio error covariance

    def smooth_coordinates(self, measurement_array):
        """
        Applies a multi-dimensional matrix transformation pass to eliminate frame jitter.
        Takes a NumPy array or list of tracking points [x, y] or [x, y, z].
        """
        measured = np.array(measurement_array, dtype=float)
        
        if not self.initialized:
            self.x_post = measured
            self.p_post = np.ones_like(measured) * 1.0
            self.initialized = True
            return self.x_post

        # 1. Time Update (Predict next state)
        x_prior = self.x_post
        p_prior = self.p_post + self.q

        # 2. Measurement Update (Correct state with incoming camera data)
        kalman_gain = p_prior / (p_prior + self.r)
        self.x_post = x_prior + kalman_gain * (measured - x_prior)
        self.p_post = (1.0 - kalman_gain) * p_prior

        return self.x_post

if __name__ == "__main__":
    print("==================================================")
    print("[*] Initializing Aurelius Matrix Filter Tests")
    print("==================================================")
    
    # Simulate a jittery coordinate point stream from an active tracking pipeline
    filter_instance = AureliusKalmanMatrix()
    raw_jitter_stream = [[100, 200], [102, 198], [99, 201], [105, 195], [100, 200]]
    
    print("Raw Incoming Frame Data -> Post-Processed Smoothed Array")
    for frame_idx, coordinates in enumerate(raw_jitter_stream):
        smoothed = filter_instance.smooth_coordinates(coordinates)
        print(f"Frame {frame_idx}: Raw: {coordinates} -> Smoothed: {np.round(smoothed, 2).tolist()}")
