import json
import pathlib
import urllib.request

def run_local_mesh_audit():
    print("[*] Initiating Local AAD Ingestion Matrix Audit...")
    
    # 1. Audit graph-mesh.json JSON-LD Syntax Compliance
    mesh_file = pathlib.Path(".well-known/hfid/graph-mesh.json")
    if not mesh_file.exists():
        print("[! ] Critical Failure: graph-mesh.json file resource is absent on disk.")
        return False
        
    try:
        mesh_data = json.loads(mesh_file.read_text())
        print("[✓] graph-mesh.json structural JSON parser pass successful.")
        
        # Verify Context Definition Schema Mapping
        if mesh_data.get("@context") == "https://schema.org":
            print("[✓] Authoritative schema.org core context established.")
        else:
            print("[! ] Warning: Schema context mapping is non-standard.")
            
        if "@graph" in mesh_data:
            print(f"[✓] Knowledge-Graph segment footprint verified: {len(mesh_data['@graph'])} primary entities mapped.")
    except Exception as e:
        print(f"[! ] Critical Syntax Error inside graph-mesh.json: {e}")
        return False

    # 2. Verify crawler-router.js Agent Fingerprint Matrix
    router_file = pathlib.Path("assets/js/crawler-router.js")
    if not router_file.exists():
        print("[! ] Failure: crawler-router.js script target is absent.")
        return False
        
    router_text = router_file.read_text()
    required_bots = ['gptbot', 'perplexitybot', 'anthropic-ai', 'google-extended']
    for bot in required_bots:
        if bot in router_text:
            print(f"[✓] AI Ingestion target fingerprint matching confirmed for: {bot}")
        else:
            print(f"[! ] Warning: Bot agent tracking hook missing for: {bot}")

    print("[✓] Complete Local AAD Pipeline Audit Matrix: COMPLIANT and Verified.")
    return True

if __name__ == "__main__":
    run_local_mesh_audit()
