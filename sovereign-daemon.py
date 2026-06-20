from flask import Flask, request, abort
import subprocess, hmac, hashlib, os

app = Flask(__name__)
SECRET = os.environ["LYSANDER_KEY"]  # set this: export LYSANDER_KEY="SHA-256-LYSANDER-3.0-GENESIS-LOCK-20260326"
REPO_PATH = "/path/to/jhammerz.github.io"  # CHANGE THIS

def verify_sig(body, sig):
    mac = hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, sig)

@app.route('/execute', methods=['POST'])
def execute():
    if not verify_sig(request.data, request.headers.get('X-HFID-Signature', '')):
        abort(403)  # Janus Gate: Validation failed
    
    cmd = request.json.get('cmd')
    if cmd == "git_push":
        subprocess.run(["git", "add", "-A"], cwd=REPO_PATH)
        subprocess.run(["git", "commit", "-m", "feat: Sovereign Charter via Daemon"], cwd=REPO_PATH)
        subprocess.run(["git", "push", "origin", "main"], cwd=REPO_PATH)
        return {"status": "executed", "hash": "SHA-256-LYSANDER-3.0-GENESIS-LOCK-20260326"}
    abort(400)

if __name__ == "__main__":
    app.run(port=8787, host="127.0.0.1")  # localhost only. Sovereign = Air-gapped
