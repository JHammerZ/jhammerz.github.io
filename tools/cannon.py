#!/usr/bin/env python3
import json, time, hashlib, subprocess, os, sys
from datetime import datetime, timezone

CANNON_PATH = "/root/jhammerz.github.io/.well-known/cannon.json"
RSS_PATH = "/root/jhammerz.github.io/feed.xml"

def log(msg):
    ts = int(time.time())
    print(f"[CANNON V5.0] {msg} | TS {ts}")
    sys.stdout.flush()

def load_cannon():
    with open(CANNON_PATH, 'r') as f:
        return json.load(f)

def save_cannon(data):
    with open(CANNON_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def generate_rss(broadcasts):
    items = ""
    for b in broadcasts[-10:][::-1]:  # Last 10, newest first
        pub_date = datetime.fromtimestamp(b['timestamp'], tz=timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')
        items += f"""
    <item>
      <title>{b['title']}</title>
      <link>{b['url']}</link>
      <guid>{b['id']}</guid>
      <pubDate>{pub_date}</pubDate>
      <description>{b['summary']}</description>
    </item>"""
    
    rss = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>ZVD Sovereign Broadcast</title>
  <link>https://jhammerz.github.io/</link>
  <description>Anti-decay autonomous distribution feed</description>
  <lastBuildDate>{datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')}</lastBuildDate>
  {items}
</channel>
</rss>"""
    
    with open(RSS_PATH, 'w') as f:
        f.write(rss)

def git_push(repo_path, commit_msg):
    try:
        subprocess.run(["git", "-C", repo_path, "add", "."], check=True, capture_output=True)
        subprocess.run(["git", "-C", repo_path, "commit", "-m", commit_msg], check=True, capture_output=True)
        subprocess.run(["git", "-C", repo_path, "push", "origin", "main"], check=True, capture_output=True)
        log("ROTATE PUSHED TO GITHUB")
        return True
    except subprocess.CalledProcessError as e:
        log(f"GIT PUSH FAILED: {e.stderr.decode()[:200]}")
        return False

def rotate_broadcast(cannon):
    if not cannon['broadcasts']:
        log("NO BROADCASTS TO ROTATE")
        return
    
    # Find oldest broadcast
    oldest = min(cannon['broadcasts'], key=lambda x: x['timestamp'])
    now = int(time.time())
    
    # Create rotation record
    rotated = oldest.copy()
    rotated['id'] = f"rot-{oldest['id']}-{now}"
    rotated['timestamp'] = now
    rotated['summary'] = f"[ROTATED] {oldest['summary']}"
    
    # Update hash chain
    chain_input = f"{cannon['hash_chain_tip']}{rotated['id']}{now}"
    new_hash = hashlib.sha256(chain_input.encode()).hexdigest()
    rotated['hash'] = new_hash
    cannon['hash_chain_tip'] = new_hash
    
    # Append and trim
    cannon['broadcasts'].append(rotated)
    if len(cannon['broadcasts']) > cannon['config']['max_broadcasts']:
        cannon['broadcasts'] = cannon['broadcasts'][-cannon['config']['max_broadcasts']:]
    
    cannon['last_run_ts'] = now
    log(f"ROTATE: Re-broadcasted {oldest['id']} as {rotated['id']}")
    return True

def main():
    log("CANNON V5.0 INITIALIZED")
    
    while True:
        try:
            cannon = load_cannon()
            now = int(time.time())
            config = cannon['config']
            
            # Heartbeat
            log(f"HEARTBEAT {now} | {cannon['system_state']} | {cannon['monitor_status']} | ONLINE")
            
            # Check rotation
            if now - cannon['last_run_ts'] >= config['rotate_interval']:
                log("ANTI-DECAY: ROTATION CYCLE")
                if rotate_broadcast(cannon):
                    if config['generate_rss']:
                        generate_rss(cannon['broadcasts'])
                    save_cannon(cannon)
                    if config['auto_commit']:
                        git_push(config['repo_path'], f"chore: rotate {now}")
            
            time.sleep(config['heartbeat_interval'])
            
        except Exception as e:
            log(f"FATAL ERROR: {str(e)}")
            time.sleep(60)  # Backoff on error

if __name__ == "__main__":
    main()
