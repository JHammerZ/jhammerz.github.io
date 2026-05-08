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
    key_json = os.getenv("LYSANDER_3_API_GOOGLE_KEY")
    
    data = {
        "url": "https://jhammerz.github.io",
        "type": "URL_UPDATED"
    }

   from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

# 1. Load credentials from your environment variable
info = json.loads(os.getenv("LYSANDER_3_API_GOOGLE_KEY"))
credentials = service_account.Credentials.from_service_account_info(
    info, scopes=["https://googleapis.com"]
)

# 2. Create an authorized session
session = AuthorizedSession(credentials)

# 3. Actually "Broadcast" to Google
endpoint = "https://googleapis.com"
response = session.post(endpoint, data=json.dumps(data))

if response.status_code == 200:
    print("RESONANCE_FORCE_COMPLETE: URL submitted successfully.")
else:
    print(f"FAILED: {response.status_code} - {response.text}")
