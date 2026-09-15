import urllib.request, json

A = 'jhammerz-github-io-production'
B = 'jhammerzofficial.workers.dev'
url = f"https://{A}.{B}/health"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Connection Alert: {e}")
