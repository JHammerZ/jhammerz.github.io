import requests
import os
import json

# AUTH ANCHORS (Set these in your GitHub Repo Secrets)
H1_API_ID = os.getenv("H1_API_ID")
H1_API_KEY = os.getenv("H1_API_KEY")

def submit_autonomous_claim(target_handle, findings):
    url = "https://hackerone.com"
    auth = (H1_API_ID, H1_API_KEY)
    
    data = {
        "data": {
            "type": "report",
            "attributes": {
                "title": f"Autonomous Discovery: Critical Exposure on {target_handle}",
                "vulnerability_information": f"The Singularity-X Mesh has identified the following: \n\n{findings}",
                "impact": "Potential Data Breach / Unauthorized Access.",
                "team_handle": target_handle
            }
        }
    }
    
    # OFFICIAL LEGAL SUBMISSION
    response = requests.post(url, auth=auth, json=data)
    return response.status_code

# LOAD RESULTS FROM BOT SCAN
if os.path.exists("results.txt"):
    with open("results.txt", "r") as f:
        data = f.read()
        if data:
            # Trigger submission
            status = submit_autonomous_claim(os.getenv("TARGET"), data)
            print(f"Submission Status: {status}")
