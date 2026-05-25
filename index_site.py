import os
import json
import base64
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def broadcast_to_google():
    # 1. Pull the Base64 Tunnel string
    b64_key = os.getenv("GOOGLE_INDEXING_API_JSON")
    
    if not b64_key:
        print("ERROR: Secret is missing!")
        return

    try:
        # 2. Rebuild the original JSON from the tunnel
        key_json = base64.b64decode(b64_key).decode('utf-8')
        info = json.loads(key_json)
        
        # 3. Setup credentials and authorized channel
        scopes = ["https://googleapis.com"]
        creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
        session = AuthorizedSession(creds)
        
        # 4. Define the Broadcast Target
        target_url = "https://jhammerz.github.io"
        endpoint = "https://jhammerz.googleapis.com"
        data = {"url": target_url, "type": "URL_UPDATED"}

        print(f"INITIATING_RESONANCE: Broadcasting {target_url}...")
        response = session.post(endpoint, data=json.dumps(data))
        
        if response.status_code == 200:
            print("RESONANCE_FORCE_COMPLETE: 200 OK")
        else:
            print(f"SIGNAL_FAILURE: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"CRITICAL_FAILURE: {str(e)}")

if __name__ == "__main__":
    broadcast_to_google()
