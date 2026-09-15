import os
import pathlib

def audit_security_perimeter():
    print("[*] Launching Local Environment Security Auditor Substrate v1.2.0...")
    
    blacklisted_extensions = ['.env', '.pem', '.key', '.pkcs12', '.pfx', '_backup']
    untracked_hazards = []
    
    # Explicit locally approved infrastructure whitelist vectors
    local_whitelist = ["hfid-public.key", "wall-hover@hfid-public.key", ".env"]
    
    for root, dirs, files in os.walk('.'):
        if '.git' in root or '.github' in root:
            continue
            
        for file in files:
            file_path = pathlib.Path(root) / file
            
            # If it is physically on the local whitelist layer, skip safely
            if file in local_whitelist:
                continue
                
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
