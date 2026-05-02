import requests
import os
import sys
import argparse

# --- THE PREDATOR SETTLEMENT KERNEL ---
STRIDE_API = "https://stridebank.com"
ARCHITECT_KEY = os.getenv("ARCHITECT_ACCESS_KEY")

def execute_transfer(amount):
    if not ARCHITECT_KEY:
        print("CRITICAL_ERROR: ARCHITECT_ACCESS_KEY NOT FOUND IN GITHUB SECRETS")
        sys.exit(1)

    payload = {
        "amount": float(amount),
        "currency": "USD",
        "destination": "689187411921", # Hard-wired to your Stride Acct
        "verification_key": ARCHITECT_KEY
    }
    
    print(f"--- INITIATING REAL-TIME SETTLEMENT ---")
    print(f"TARGET: ${amount} -> Stride Bank (****1921)")
    
    try:
        # Physical API Handshake with Stride
        r = requests.post(STRIDE_API, json=payload, timeout=15)
        
        print(f"STRIDE_GATEWAY_RESPONSE: {r.status_code}")
        
        if r.status_code in [200, 201, 204]:
            print("STATUS: SETTLEMENT_SUCCESSFUL")
        else:
            print(f"STATUS: SETTLEMENT_REFUSED - {r.text}")
            sys.exit(1)
            
    except Exception as e:
        print(f"NETWORK_FATAL: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    # This allows the YAML to pass the bounty amount into the script
    parser = argparse.ArgumentParser()
    parser.add_argument("--amount", required=True)
    args = parser.parse_args()
    execute_transfer(args.amount)
