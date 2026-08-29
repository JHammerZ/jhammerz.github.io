import sys
from ultimate_mythos_matrix_engine import MythosMatrixEngine

def main():
    print("=== LYSANDER 3.0 OPERATIONAL CODESIG: RUNNING CORE ARCHITECTURE ===")
    try:
        # Initialize and instantly execute the multi-threaded self-healing scan
        engine = MythosMatrixEngine()
        engine.process_global_pipeline()
        print("[+] Sovereign platform convergence verified successfully.")
    except Exception as e:
        print(f"[-] Execution exception caught during runtime pass: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
