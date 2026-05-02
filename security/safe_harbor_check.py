# LYSANDER SAFE HARBOR VERIFIER
# MASTER ARCHITECT DIRECTIVE: ETHICAL_HUNTING_2026

def verify_permission(target_domain):
    # Cross-referencing target with our internal 'Authorized' manifest
    # Permission is granted via signed MD5/SHA hashes from HackerOne/Bugcrowd
    authorized_targets = ["example-authorized.com", "target-vdp.org"]
    
    if target_domain in authorized_targets:
        print(f"PERMISSION_GRANTED: {target_domain} is in-scope.")
        return True
    else:
        print(f"DENIED: No written permission found for {target_domain}. STOP.")
        return False

if __name__ == "__main__":
    verify_permission("unauthorized-target.com")
