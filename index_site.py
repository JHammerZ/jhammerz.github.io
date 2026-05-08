import os
import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def broadcast_to_google():
    # 1. Load the credentials from your GitHub Secret
    service_account_info = os.getenv("GOOGLE_INDEXING_API")
    
    if not service_account_info:
        print("ERROR: GOOGLE_INDEXING_API_JSON secret is missing!")
        exit(1)

    try:
        credentials_dict = json.loads(service_account_info)
        scopes = ["https://googleapis.com"]
        credentials = service_account.Credentials.from_service_account_info(
            credentials_dict, scopes=scopes
        )
        
        # 2. Create an authorized session
        session = AuthorizedSession(credentials)
        
        # 3. Define the payload
        # Ensure this URL matches exactly what is in your Search Console
        target_url = "https://jhammerz.github.io"
        endpoint = "https://googleapis.com"
        
        data = {
            "url": target_url,
            "type": "URL_UPDATED"
        }

        print(f"Initiating Restoration: Broadcasting {target_url}...")
        
        # 4. Send the request
        response = session.post(endpoint, data=json.dumps(data))
        
        if response.status_code == 200:
            print("RESONANCE_FORCE_COMPLETE: Google has accepted the URL.")
            print(f"Response: {response.json()}")
        else:
            print(f"SIGNAL_FAILURE: Received {response.status_code}")
            print(f"Details: {response.text}")
            exit(1)

    except Exception as e:
        print(f"CRITICAL_ERROR: {str(e)}")
        exit(1)

if __name__ == "__main__":
    broadcast_to_google()
