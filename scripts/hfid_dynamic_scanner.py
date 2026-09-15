import os, sys, json
from datetime import datetime, timezone
class HFIDDynamicScanner:
    def scan_and_register_assets(self):
        print("\n=======================================================")
        print(" [⚙️] RUNNING AUTOMATED AUDIT: HFID ASSET SYNC")
        print("=======================================================")
        audio_files = [f for f in os.listdir("masters") if f.endswith((".mp3", ".wav", ".flac"))] if os.path.exists("masters") else []
        print(f" [+] Discovered {len(audio_files)} master tracks awaiting registry sync.")
        if os.path.exists(".well-known/hfid-registry.json"):
            with open(".well-known/hfid-registry.json", "r") as f: reg = json.load(f)
            reg["recycled_inventory_stream"] = {"active_vault_manifest": audio_files, "updated_at": datetime.now(timezone.utc).isoformat()}
            with open(".well-known/hfid-registry.json", "w") as f: json.dump(reg, f, indent=2)
            print(" [✅] LEDGER ALIGNED: .well-known/hfid-registry.json updated successfully.")
        print("=======================================================\n")
if __name__ == "__main__": HFIDDynamicScanner().scan_and_register_assets()
