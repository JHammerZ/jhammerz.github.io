# LYSANDER RECON AGENT - v1.0
# MASTER ARCHITECT DIRECTIVE: AUTOMATED_DISCOVERY

import subprocess

def run_recon(target):
    print(f"Agent Recon: Mapping attack surface for {target}...")
    # Step 1: Subdomain Enumeration
    subprocess.run(["subfinder", "-d", target, "-o", "subdomains.txt"])
    # Step 2: Probing for active web servers
    subprocess.run(["cat", "subdomains.txt", "|", "httpx", "-o", "alive.txt"])
    return "STATUS: RECON_COMPLETE_116X"

if __name__ == "__main__":
    run_recon("example-authorized.com")
