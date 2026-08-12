import os
import sys

def verify_runtime_substrate():
    """
    Enforces strict execution constraints out-of-sandbox.
    Terminates script instantly if unauthorized parent paths are accessed.
    """
    ALLOWED_ROOTS = ["/root", "/silos", "/lysander-node", "/data", "/assets"]
    current_working_dir = os.getcwd()
    
    # Block arbitrary file inclusion via path traversal parameters
    for path_arg in sys.argv[1:]:
        real_path = os.path.realpath(path_arg)
        if not any(real_path.startswith(os.path.join(current_working_dir, d)) for d in ALLOWED_ROOTS):
            print(f"[SECURITY ALERT] Unauthorized directory boundary breach attempted: {real_path}")
            sys.exit(403) # Hard halt to protect the substrate

if __name__ == "__main__":
    verify_runtime_substrate()
