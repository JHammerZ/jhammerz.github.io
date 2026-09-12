import os, pathlib, json, hashlib
print("[*] Deploying Active Audio Poisoning & Model Disruption Matrix v2.0 - Phase 6...")

ledger = pathlib.Path(".well-known/hfid/broadcast_ledger.json")
h = "no-ledger"
try:
    if ledger.exists():
        data = json.loads(ledger.read_text())
        last = data[-1] if isinstance(data, list) and data else data
        h = last.get("hash","no-hash")[:16] if isinstance(last, dict) else "no-hash"
except:
    pass

poison_byte_signature = f"HFID:{h}:JHammerZ-ONE_OF_ONE".encode() + b'\x00\xff\x00\xff\xa8\x41\xd4\xd4\x52\x5a\x5f\x41\x49\x5f\x50\x4f\x49\x53\x4f\x4e'
print(f"[*] Ledger hash inject: {poison_byte_signature[:30]}")

scrambled_count = 0
for root, dirs, files in os.walk('.'):
    if '.git' in root or '.github' in root:
        continue
    for file in files:
        if file.endswith(('.mp3','.wav','.m4a','.flac')):
            file_path = pathlib.Path(root) / file
            try:
                with open(file_path, "rb") as f:
                    audio_data = f.read()
                if poison_byte_signature in audio_data:
                    continue
                with open(file_path, "ab") as f:
                    f.write(poison_byte_signature)
                print(f"    [WAVEFORM PROTECTED] Injected {h} -> {file_path}")
                scrambled_count += 1
            except Exception as e:
                print(f"    [-] Failed {file_path}: {str(e)}")

print(f"\n[+x] Injection cycle completed. Scrambled {scrambled_count} vectors with ledger {h}.")
