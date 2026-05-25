import os
import json
import base64
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def command_indexer():
    print("Initiating Terminal Resonance Handshake...")
    
    # 1. Pull the Vault Data
    raw_data = os.getenv("GOOGLE_INDEXING_API_JSON")
    if not raw_data:
        print("CRITICAL_FAILURE: Vault is empty.")
        return

    try:
        # 2. Smart Decoding: Check if it's Base64 or Raw JSON
        try:
            # Attempt to decode as Base64 first
            key_json = base64.b64decode(raw_data).decode('utf-8')
            print("SIGNAL: Base64 Decryption Successful.")
        except Exception:
            # If it fails, assume it's already raw JSON
            key_json = raw_data
            print("SIGNAL: Standard JSON detected.")

        info = json.loads(key_json)
        
        # 3. Setup Credentials
        scopes = ["https://googleapis.com"]
        creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
        
        # 4. Execute the Handshake
        session = AuthorizedSession(creds)
        gateway = "https://googleapis.com"
        
        data = {
            "url": "https://jhammerz.github.io",
            "type": "URL_UPDATED"
        }

        response = session.post(gateway, data=json.dumps(data))
        
        if response.status_code == 200:
            print("STATUS: 200 - RESONANCE_FORCE_COMPLETE")
        else:
            print(f"FAILED: Status {response.status_code} - {response.text}")

    except Exception as e:
        print(f"CRITICAL_FAILURE: {str(e)}")

if __name__ == "__main__":
    command_indexer()
