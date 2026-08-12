import os
import sys
import requests
from datetime import datetime
from requests_oauthlib import OAuth1

ARCHITECT_KEY = os.environ.get('ARCHITECT_ACCESS_KEY')
FB_PAGE_ID = os.environ.get('FB_PAGE_ID')
CONTENT = os.environ.get('POST_CONTENT', f'HEO: Sovereign broadcast {datetime.utcnow().isoformat()}')

X_API_KEY = os.environ.get('X_API_KEY')
X_API_SECRET = os.environ.get('X_API_SECRET')
X_ACCESS_TOKEN = os.environ.get('X_ACCESS_TOKEN')
X_ACCESS_SECRET = os.environ.get('X_ACCESS_SECRET')

if not ARCHITECT_KEY or not FB_PAGE_ID:
    print("Skipping: ARCHITECT_ACCESS_KEY or FB_PAGE_ID not set")
    sys.exit(0)

if not CONTENT:
    print("ERROR: Missing POST_CONTENT")
    sys.exit(1)

print(f"HEO DAEMON: Broadcasting content: {CONTENT[:50]}...")

try:
    fb_url = f"https://graph.facebook.com/v25.0/{FB_PAGE_ID}/feed"
    fb_data = {
        "message": CONTENT,
        "access_token": ARCHITECT_KEY
    }
    fb_r = requests.post(fb_url, data=fb_data)
    print(f"Facebook: {fb_r.status_code} - {fb_r.text[:100]}")
except Exception as e:
    print(f"Facebook ERROR: {e}")

try:
    if all([X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET]):
        auth = OAuth1(X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET)
        x_url = "https://api.twitter.com/2/tweets"
        x_data = {"text": CONTENT}
        x_r = requests.post(x_url, json=x_data, auth=auth)
        print(f"X: {x_r.status_code} - {x_r.text[:100]}")
    else:
        print("X: Skipping - X credentials not set")
except Exception as e:
    print(f"X ERROR: {e}")

print("HEO DAEMON: Complete")
