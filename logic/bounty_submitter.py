# LYSANDER BOUNTY SUBMITTER
# MASTER ARCHITECT DIRECTIVE: DETERMINISTIC_SUBMISSION
import requests
import json
import os

H1_API_USER = os.getenv('H1_API_USERNAME')
H1_API_TOKEN = os.getenv('H1_API_TOKEN')

def submit_vulnerability(report_data):
    url = "https://hackerone.com"
    headers = {'Accept': 'application/json'}
    
    # Mapping our H-Fid™ report to the HackerOne JSON schema
    payload = {
        "data": {
            "type": "report",
            "attributes": {
                "title": report_data['title'],
                "vulnerability_information": report_data['audit_content'],
                "impact": report_data['impact_statement']
            }
        }
    }
    
    r = requests.post(url, auth=(H1_API_USER, H1_API_TOKEN), headers=headers, json=payload)
    return f"STATUS: SUBMISSION_RATIFIED | ID: {r.json()['data']['id']}"
