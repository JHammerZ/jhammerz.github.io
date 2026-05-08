import os
import json
import base64
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def command_indexer():
    print("Initiating Terminal Resonance Handshake...")
    
    # 1. Pull and Decode the Base64 Vault
    b64_key = os.getenv("GOOGLE_INDEXING_API_JSON")
    if not b64_key:
        print("CRITICAL_FAILURE: GOOGLE_INDEXING_API_JSON is missing.")
        return

    try:
        # Decode Base64 string back into raw JSON
        key_json = base64.b64decode(b64_key).decode('utf-8')
        info = json.loads(key_json)
        
        # 2. Setup Credentials with the correct Indexing Scope
        scopes = ["https://googleapis.com"]
        creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
        
        # 3. Open the Authorized Channel
        session = AuthorizedSession(creds)
        gateway = "https://googleapis.com"
        
        # 4. Define the Target
        data = {
            "url": "https://jhammerz.github.io",
            "type": "URL_UPDATED"
        }

        print(f"Broadcasting to Google: {data['url']}")
        
        # 5. Execute the Handshake
        response = session.post(gateway, data=json.dumps(data))
        
        if response.status_code == 200:
            print("STATUS: 200 - RESONANCE_FORCE_COMPLETE")
            print(f"GOOGLE_RESPONSE: {response.text}")
        else:
            print(f"FAILED: Vault Handshake Rejected - {response.status_code}")
            print(f"ERROR_DETAILS: {response.text}")

    except Exception as e:
        print(f"CRITICAL_FAILURE: {str(e)}")

if __name__ == "__main__":
    command_indexer()

