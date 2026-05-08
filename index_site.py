import os
import json
import base64
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def broadcast_to_google():
    # 1. Pull and Decode the Base64 Vault
    b64_key = os.getenv("GOOGLE_INDEXING_API_JSON")
    if not b64_key:
        print("ERROR: Secret is missing!")
        return

    try:
        # Rebuild the JSON from the Base64 Tunnel
        key_json = base64.b64decode(b64_key).decode('utf-8')
        info = json.loads(key_json)
        
        scopes = ["https://googleapis.com"]
        creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
        
        # 2. Open the Authorized Channel
        session = AuthorizedSession(creds)
        endpoint = "https://googleapis.com"
        
        # 3. Define the Target
        target_url = "https://jhammerz.github.io"
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
