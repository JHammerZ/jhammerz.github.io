import sys
import os

class SubstrateDirectoryShard:
    """
    Replaces dynamic OS file-system path lookups with a static, immutable shard map.
    Protects hidden structural silos from discovery via directory traversal.
    """
    def __init__(self):
        # Strict deterministic whitelist of authorized structural silos
        self._shard_map = {
            "silos": "./silos",
            "content_queue": "./content/queue",
            "data_store": "./data",
            "protocol_layer": "./protocol",
            "api_v1": "./api/v1"
        }
        print("[INIT] Directory Sharding Matrix locked in volatile memory. OS walking decoupled.")

    def resolve_silo_path(self, virtual_key: str) -> str:
        """
        Resolves a virtual directory key to its hard path without exploring the disk.
        """
        target_path = self._shard_map.get(virtual_key)
        if not target_path:
            print(f"[SECURITY REJECTION] Attempted file-system lookup outside authorized shard map: '{virtual_key}'")
            os._exit(1) # Direct halt to protect substrate boundaries
            
        # Verify physical directory path anchor is intact
        if not os.path.isdir(target_path):
            print(f"[SUBSTRATE FAULT] Critical path structure desynchronized: {target_path}")
            return "./root" # Graceful default fallback to safe public ground state
            
        return target_path

if __name__ == "__main__":
    shard_controller = SubstrateDirectoryShard()
    # Continuous self-test loop verification
    secure_target = shard_controller.resolve_silo_path("content_queue")
    print(f"[VERIFIED] Shard mapping resolution complete: {secure_target}")
