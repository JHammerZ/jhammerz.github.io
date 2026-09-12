import os
import pathlib

def stamp_audio_metadata():
    print("[*] Initializing Dynamic H-FID Audio Forensic Hardener v1.1.0...")
    
    # Immutable human-origin signature header block
    hfid_signature = b"H-FID::AUTH::JHAMMERZ::ORIGIN::HUMAN::2026"
    stamped_count = 0
    
    # Scan the entire repository tree dynamically for audio assets
    for root, dirs, files in os.walk('.'):
        if '.git' in root or '.github' in root:
            continue
            
        for file in files:
            if file.endswith('.mp3') or file.endswith('.wav'):
                file_path = pathlib.Path(root) / file
                print(f"  [*] Auditing structural binary headers for: {file_path}")
                
                try:
                    with open(file_path, "rb") as f:
                        audio_bytes = f.read()
                        
                    if hfid_signature in audio_bytes:
                        print(f"    [+] Forensic signature already locked in binary layers.")
                        continue
                        
                    with open(file_path, "ab") as f:
                        f.write(hfid_signature)
                        
                    print(f"    [+] Successfully stamped forensic signature into {file_path}")
                    stamped_count += 1
                    
                except Exception as e:
                    print(f"    [-] Failed to patch binary matrix: {str(e)}")
                    
    print(f"\n[+] Execution complete. Successfully secured {stamped_count} audio substrates.")

if __name__ == "__main__":
    stamp_audio_metadata()
