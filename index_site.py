import os
import json
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def broadcast_truth():
    # 1. Access the Vault (GitHub Secret)
    key_json = os.getenv("GOOGLE_INDEXING_API_JSON")
    
    if not key_json:
        print("ERROR: GOOGLE_INDEXING_API_JSON is missing from the environment.")
        exit(1)

    try:
        # 2. Decrypt the God Key
        info = json.loads(key_json)
        scopes = ["https://googleapis.com"]
        creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
        
        # 3. Open the Authorized Channel
        session = AuthorizedSession(creds)
        endpoint = "https://googleapis.com"
        
        # 4. Define the Target
        target_url = "https://jhammerz.github.io"
        data = {
            "url": target_url,
            "type": "URL_UPDATED"
        }

        print(f"INITIATING_RESONANCE: Broadcasting {target_url}...")
        
        # 5. Execute the Handshake
        response = session.post(endpoint, data=json.dumps(data))
        
        if response.status_code == 200:
            print("RESONANCE_FORCE_COMPLETE: Google has accepted the Truth.")
            print(f"RESPONSE: {response.text}")
        else:
            print(f"SIGNAL_FAILURE: Received {response.status_code}")
            print(f"DETAILS: {response.text}")
            exit(1)

    except Exception as e:
        print(f"CRITICAL_FAILURE: {str(e)}")
        exit(1)

if __name__ == "__main__":
    broadcast_truth()
