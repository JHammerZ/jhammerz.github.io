import os
import requests

def push_jhammerz_signal():
    """
    LYSANDER 3.0: TIKTOK COMMAND ROOT (LOCKED)
    Principal Architect: Joshua Hamilton
    Signature: #JHammerZ
    """
    # [FIXED]: Official Production Endpoint for Video Listing
    url = "https://open.tiktokapis.com/v2/video/list/"
    
    # [CREDENTIALS]: Correctly pulled from Vault Secrets
    CLIENT_KEY = "awcpiasfo2p4m2kh"
    CLIENT_SECRET = os.getenv("TIKTOK_CLIENT_SECRET") # In GitHub Secrets
    ACCESS_TOKEN = os.getenv("TIKTOK_ROOT_TOKEN")    # From CMD Input

    # [FIXED]: Authorization headers must use 'Bearer' type
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Client-Key": CLIENT_KEY
    }

    # [FIXED]: Request body for v2 API
    payload = {
        "max_count": 10,
        "fields": ["id", "title", "view_count", "share_count"]
    }

    try:
        # [FIXED]: Corrected 'json=payload' argument
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            print("[ROOT]: TikTok Bridge Locked. #JHammerZ Signal Propagating.")
            return response.json()
        elif response.status_code == 401:
            print("[ERROR]: 401 Unauthorized. Check if Token is expired.")
        else:
            print(f"[ERROR]: Status {response.status_code} | {response.text}")
            
    except Exception as e:
        print(f"[CRITICAL]: Bridge Failure: {e}")

if __name__ == "__main__":
    push_jhammerz_signal()
