import requests
import os
import sys
import argparse

# === CONFIG ===
STRIPE_API = "https://stridebank.com"  # Note: You had "str idebank" before
ARCHITECT_ACCESS_KEY = os.getenv("ARCHITECT_ACCESS_KEY")

def execute_transfer(amount):
    if not ARCHITECT_ACCESS_KEY:
        print("❌ CRITICAL ERROR: ARCHITECT_ACCESS_KEY NOT FOUND IN GITHUB SECRETS")
        sys.exit(2)

    try:
        payload = {
            "amount": float(amount),
            "currency": "USD",
            "destination": "689187411921",   # Hard-wired to your Stride account
            "verification_key": ARCHITECT_ACCESS_KEY
        }
    except ValueError:
        print(f"❌ ERROR: Invalid amount format: {amount}")
        sys.exit(1)

    print("--- INITIALIZING REAL-TIME SETTLEMENT ---")
    print(f"TARGET: ${amount} -> Stride Bank (***1921)")

    try:
        r = requests.post(STRIPE_API, json=payload, timeout=15)
        print(f"STRIDE GATEWAY RESPONSE: {r.status_code}")

        if r.status_code in [200, 201, 204]:
            print("✅ STATUS: SETTLEMENT SUCCESSFUL")
            return True
        else:
            print(f"❌ STATUS: SETTLEMENT REFUSED - {r.text[:200]}")
            sys.exit(1)

    except requests.exceptions.RequestException as e:
        print(f"❌ NETWORK FATAL: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--amount", required=True, help="Payout amount in USD")
    args = parser.parse_args()

    execute_transfer(args.amount)
