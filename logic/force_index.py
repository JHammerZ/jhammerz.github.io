# 🔱 LYSANDER FORCE-INDEX INTERROGATOR
# MASTER ARCHITECT DIRECTIVE: TERMINAL_RESONANCE

import requests
import json
import os

def command_indexers():
    print("Initiating Terminal Resonance Handshake...")
    
    # THE SURGICAL FIX: Targeting the official Indexing Gateway
    url = "https://googleapis.com"
    
    # Explicitly pulling the God Key from your GitHub environment
    key_json = os.getenv("GOOGLE_INDEXING_API_JSON")
    
    data = {
        "url": "https://jhammerz.github.io",
        "type": "URL_UPDATED"
    }

      try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession

        # 1. Decrypt the God Key
        info = json.loads(key_json)
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=["https://googleapis.com"]
        )
        
        # 2. Open the Authorized Channel
        session = AuthorizedSession(creds)
        gateway = "https://googleapis.com"
        
        # 3. Broadcast to Google's Brain
        response = session.post(gateway, data=json.dumps(data))
        
        if response.status_code == 200:
            print(f"STATUS: 200 - RESONANCE_FORCE_COMPLETE")
            print(f"GOOGLE_RESPONSE: {response.text}")
        else:
            print(f"FAILED: Vault Handshake Rejected - {response.status_code}")
            print(f"ERROR_DETAILS: {response.text}")

    except Exception as e:
        print(f"CRITICAL_FAILURE: {str(e)}")
