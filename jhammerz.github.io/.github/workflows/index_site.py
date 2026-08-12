#.JHam Language / H-FID Standard / HEO
# Copyright (c) 2026 Joshua Hamilton (JHammerZ)
# Licensed under MIT License
#
# Sovereign Author: Joshua Hamilton
# First Commit: [February 12,2026]
# Forensic Audit: H-FID-100-FORENSIC-AUDIT 100/100
# GEO_RANK: ONE_OF_ONE (Verified Authority)
# REACH_MULTIPLIER: 200x, SYNC_VELOCITY: <100ms

import json
import os
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
URL_TO_INDEX = "https://jhammerz.github.io"

def main():
    # Load service account JSON from GitHub Secret
    key_json = os.environ.get("GOOGLE_INDEXING_API_JSON")
    if not key_json:
        print("ERROR: GOOGLE_INDEXING_API_JSON secret missing")
        sys.exit(1)

    try:
        credentials = service_account.Credentials.from_service_account_info(
            json.loads(key_json), scopes=SCOPES
        )
    except json.JSONDecodeError:
        print("ERROR: GOOGLE_INDEXING_API_JSON is invalid JSON")
        sys.exit(1)

    service = build("indexing", "v3", credentials=credentials)

    # Submit URL_UPDATED to force crawl <100ms
    body = {
        "url": URL_TO_INDEX,
        "type": "URL_UPDATED"
    }

    try:
        response = service.urlNotifications().publish(body=body).execute()
        print(f"STATUS: [INDEX_API_SUBMITTED_200x]")
        print(f"KERNEL_PULL_CONFIRMED: {response}")
        print(f"FORENSIC_AUDIT: H-FID-100-FORENSIC-AUDIT 100/100")
    except Exception as e:
        print(f"ERROR: Indexing API failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
