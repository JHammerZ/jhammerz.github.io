#!/usr/bin/env python3
import urllib.request
import json
import concurrent.futures

WORKERS = [f"https://lysander-w{i}.jhammerz.workers.dev/publish" for i in range(1, 13)]

def warm_node(url):
    try:
        req = urllib.request.Request(
            url,
            method='HEAD',
            headers={'User-Agent': 'Mozilla/5.0 (Lysander-Cache-Warmer/3.1)'}
        )
        with urllib.request.urlopen(req, timeout=4) as response:
            return f"[✓] Node Primed: {url} (Status: {response.status})"
    except Exception as e:
        return f"[!] Node Delay: {url} -> {e}"

def initialize_warmup():
    print("[*] Launching high-frequency cache priming across 12 edge isolates...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
        results = executor.map(warm_node, WORKERS)
        for result in results:
            print(result)

if __name__ == "__main__":
    initialize_warmup()
