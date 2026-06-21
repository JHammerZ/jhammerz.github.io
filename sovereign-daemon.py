import os
import sys
import requests

# Get secrets from environment
ARCHITECT_KEY = os.environ.get('ARCHITECT_ACCESS_KEY')
FB_PAGE_ID = os.environ.get('FB_PAGE_ID')
FB_USER_ID = os.environ.get('FB_USER_ID')
X_BEARER = os.environ.get('X_BEARER_TOKEN')
CONTENT = os.environ.get('POST_CONTENT')

if not all([ARCHITECT_KEY, FB_PAGE_ID, FB_USER_ID, X_BEARER, CONTENT]):
    print("ERROR: Missing required environment variables")
    sys.exit(1)

print(f"HEO DAEMON: Broadcasting content: {CONTENT[:50]}...")

# Facebook Post
try:
    fb_url = f"https://graph.facebook.com/v19.0/{FB_PAGE_ID}/feed"
    fb_data = {
        "message": CONTENT,
        "access_token": ARCHITECT_KEY
    }
    fb_r = requests.post(fb_url, data=fb_data)
    print(f"Facebook: {fb_r.status_code} - {fb_r.text[:100]}")
except Exception as e:
    print(f"Facebook ERROR: {e}")

# X Post
try:
    x_url = "https://api.twitter.com/2/tweets"
    x_headers = {
        "Authorization": f"Bearer {X_BEARER}",
        "Content-Type": "application/json"
    }
    x_data = {"text": CONTENT}
    x_r = requests.post(x_url, headers=x_headers, json=x_data)
    print(f"X: {x_r.status_code} - {x_r.text[:100]}")
except Exception as e:
    print(f"X ERROR: {e}")

print("HEO Planetary Broadcast Complete")