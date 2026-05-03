import requests
import os
import sys
import argparse

# === CONFIG ===
# Change this to a real endpoint you control
API_URL = "https://api.jhammerz.xyz/settlement"   # ← Recommended: use your own domain
# API_URL = "https://jhammerz.github.io/api/settlement"  # Alternative

ARCHITECT_ACCESS_KEY = os.getenv("ARCHITECT_ACCESS_KEY")

def execute_transfer(amount):
    if not ARCHITECT_ACCESS_KEY:
        print("❌ CRITICAL ERROR: ARCHITECT_ACCESS_KEY NOT FOUND IN GITHUB SECRETS")
        sys.exit(1)

    try:
        payload = {
            "amount": float(amount),
            "currency": "USD",
            "destination": "689187411921",
            "verification_key": ARCHITECT_ACCESS_KEY,
            "source": "Lysander Production Payout",
            "timestamp": os.getenv("GITHUB_RUN_ID", "unknown")
        }
    except ValueError:
        print(f"❌ ERROR: Invalid amount format: {amount}")
        sys.exit(1)

    print("--- INITIALIZING REAL-TIME SETTLEMENT ---")
    print(f"TARGET: ${amount} -> Stride Bank (***1921)")

    try:
        r = requests.post(API_URL, json=payload, timeout=15)
        print(f"RESPONSE: {r.status_code}")

        if r.status_code in [200, 201, 204]:
            print("✅ STATUS: SETTLEMENT SUCCESSFUL")
            return True
        else:
            print(f"❌ STATUS: SETTLEMENT REFUSED - {r.text[:400]}")
            # Don't kill the workflow on 404 if it's expected during testing
            if r.status_code == 404:
                print("⚠️  Note: Endpoint not found. Create the backend endpoint.")
            sys.exit(1)

    except requests.exceptions.RequestException as e:
        print(f"❌ NETWORK FATAL: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--amount", required=True, help="Payout amount in USD")
    args = parser.parse_args()

    execute_transfer(args.amount)
