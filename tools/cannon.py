#!/usr/bin/env python3
import json, requests, hashlib, time, sys, os, subprocess

CANNON_URL = "https://jhammerz.github.io/.well-known/cannon.json"
GENESIS_HASH = "2820166f310d85dbfced2e24d1c67f8b95a7f07d20d18598d38784a5d2fe62c4"
MODEL_PATH = "/root/models/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf"
POLL_INTERVAL = 30
ROTATE_INTERVAL = 3600
REPO_PATH = "/root/jhammerz.github.io"

def log(msg): 
    print(f"[CANNON V4.2] {msg}", flush=True)

def fetch_state():
    try:
        r = requests.get(CANNON_URL, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        log(f"FETCH FAIL: {e}")
        return None

def content_hash(state):
    payload = json.dumps({
        "broadcasts": state.get("broadcasts", []),
        "detected_drop": state.get("detected_drop")
    }, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()

def calc_chain_tip(state):
    chain_data = json.dumps({
        "ts": state["last_run_ts"],
        "broadcasts": state.get("broadcasts", []),
        "drop": state.get("detected_drop")
    }, sort_keys=True)
    return hashlib.sha256(chain_data.encode()).hexdigest()

def push_cannon_update(state):
    path = f"{REPO_PATH}/.well-known/cannon.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(state, f, indent=2)
    
    subprocess.run(["git", "-C", REPO_PATH, "add", ".well-known/cannon.json"], check=True)
    subprocess.run(["git", "-C", REPO_PATH, "commit", "-m", f"chore: rotate {state['last_run_ts']}"], check=True)
    subprocess.run(["git", "-C", REPO_PATH, "push", "origin", "main"], check=True)
    log("ROTATE PUSHED TO GITHUB")

def rotate_library(state):
    broadcasts = state.get("broadcasts", [])
    if not broadcasts:
        log("ROTATE: No broadcasts to rotate")
        return state
    
    rotation_idx = state.get("rotation_index", 0) % len(broadcasts)
    old_post = broadcasts[rotation_idx]
    
    refreshed = old_post.copy()
    refreshed["ts"] = int(time.time())
    refreshed["rotated_from_ts"] = old_post["ts"]
    refreshed["id"] = f"rot-{old_post['ts']}-{refreshed['ts']}"
    
    broadcasts.append(refreshed)
    state["broadcasts"] = broadcasts
    state["rotation_index"] = rotation_idx + 1
    state["last_run_ts"] = int(time.time())
    state["hash_chain_tip"] = calc_chain_tip(state)
    
    log(f"ROTATE: Re-broadcasted post from {old_post['ts']} as {refreshed['id']}")
    return state

def process_drop(state, old_hash):
    new_hash = content_hash(state)
    if new_hash != old_hash:
        log(f"DROP DETECTED | New content hash: {new_hash[:12]}...")
        log("TRIGGERING N09 AUDIT")
        if state.get("detected_drop"):
            log(f"Processing drop: {state['detected_drop']}")
        return new_hash
    return old_hash

def verify_genesis(state):
    if not state: 
        log("FATAL: No state fetched")
        sys.exit(1)
    if state["system_state"] != "AUTONOMOUS_BROADCAST": 
        log("FATAL: Bad system_state")
        sys.exit(1)
    if state["monitor_status"] != "ARMED": 
        log("FATAL: Monitor not ARMED")
        sys.exit(1)
    log("GENESIS VERIFIED")
    log(f"Monitor: ARMED | Hash: {GENESIS_HASH[:12]}...")

def n09_audit_loop():
    log("Booting...")
    log("N09 AUDIT LOOP: STARTING")
    model_status = "ONLINE" if os.path.exists(MODEL_PATH) else "API_FALLBACK"
    log(f"jhammerz-think: {model_status}")
    
    state = fetch_state()
    verify_genesis(state)
    last_content_hash = content_hash(state)
    last_rotate = time.time()
    
    log(f"Baseline content hash: {last_content_hash[:12]}...")
    
    while True:
        ts = int(time.time())
        log(f"HEARTBEAT {ts} | {state['system_state']} | {state['monitor_status']} | {model_status}")
        
        new_state = fetch_state()
        if new_state:
            last_content_hash = process_drop(new_state, last_content_hash)
            state = new_state
        
        if time.time() - last_rotate >= ROTATE_INTERVAL:
            log("ANTI-DECAY: ROTATION CYCLE")
            state = rotate_library(state)
            push_cannon_update(state)
            last_rotate = time.time()
        
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    n09_audit_loop()
