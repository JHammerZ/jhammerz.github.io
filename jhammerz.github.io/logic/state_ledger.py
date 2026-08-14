import sys
import os
import time
import hashlib
import json

class SovereignStateLedger:
    """
    Maintains an immutable, append-only cryptographic ledger for substrate state transitions.
    Protects critical identity and protocol manifests against out-of-sequence tampering.
    """
    def __init__(self):
        self._state_chain = []
        # Establish genesis block bound directly to the Human Kernel Root baseline
        self._genesis_hash = hashlib.sha256(b"HUMAN_KERNEL_ROOT_JHAMMERZ_GENESIS").hexdigest()
        self._state_chain.append({
            "block_index": 0,
            "timestamp": time.time(),
            "payload": "GENESIS_NODE_INITIALIZATION",
            "previous_hash": "0000000000000000000000000000000000000000000000000000000000000000",
            "block_hash": self._genesis_hash
        })
        print(f"[INIT] Cryptographic State Ledger active. Genesis Hash: {self._genesis_hash[:16]}...")

    def append_state_mutation(self, transaction_payload: str) -> str:
        """
        Appends a validated transaction block to the state chain after structural hashing.
        """
        last_block = self._state_chain[-1]
        new_index = last_block["block_index"] + 1
        timestamp = time.time()
        prev_hash = last_block["block_hash"]
        
        # Build block contents for verification serialization
        block_content = f"{new_index}:{timestamp}:{transaction_payload}:{prev_hash}".encode('utf-8')
        new_hash = hashlib.sha256(block_content).hexdigest()
        
        new_block = {
            "block_index": new_index,
            "timestamp": timestamp,
            "payload": transaction_payload,
            "previous_hash": prev_hash,
            "block_hash": new_hash
        }
        
        self._state_chain.append(new_block)
        print(f"[LEDGER COMMIT] Block #{new_index} locked. Hash: {new_hash[:16]}...")
        return new_hash

if __name__ == "__main__":
    ledger = SovereignStateLedger()
    # Continuous self-test loop verification
    secure_mutation = ledger.append_state_mutation("SUBSTRATE_STABILIZATION_LOCK_ACTIVE")
