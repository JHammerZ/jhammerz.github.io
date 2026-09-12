import os
import pathlib

def audit_security_perimeter():
    print("[*] Launching Local Environment Security Auditor Substrate v1.0.0...")
    
    # Define files that should strictly NEVER bypass repository controls
    blacklisted_extensions = ['.env', '.pem', '.key', '.pkcs12', '.pfx', '_backup']
    untracked_hazards = []
    
    # Audit local working repository directories
    for root, dirs, files in os.walk('.'):
        # Exclude internal git system layers from deep scans
        if '.git' in root or '.github' in root:
            continue
            
        for file in files:
            file_path = pathlib.Path(root) / file
            
            # Identify unmapped file variations matching blacklisted signatures
            if any(file.endswith(ext) for ext in blacklisted_extensions):
                untracked_hazards.append(str(file_path))

    if untracked_hazards:
        print(f"\n[!] WARNING: Detected {len(untracked_hazards)} unmapped security parameters:")
        for hazard in untracked_hazards:
            print(f"  -> EXPOSURE HAZARD: {hazard}")
        print("\n[-] Action Required: Ensure these assets are safely cleared or appended to your .gitignore matrix.")
    else:
        print("\n[+] Verification Complete: Zero untracked environmental key structures discovered.")
        print("[+] Local perimeter tree is secure for automated daemon distribution cycles.")

if __name__ == "__main__":
    audit_security_perimeter()
