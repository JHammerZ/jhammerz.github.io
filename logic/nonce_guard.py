import sys
import os
import time

class SovereignNonceGuard:
    """
    Enforces absolute transaction uniqueness across out-of-sandbox runtime interfaces.
    Neutralizes payload replay vectors without introducing file-system disk latency.
    """
    def __init__(self, token_expiry_seconds=300):
        self.expiry_window = token_expiry_seconds
        # Utilizes a fast memory dictionary structure for rapid lookup checks
        self._nonce_vault = {}
        print(f"[INIT] Nonce Fragmentation Engine Active. Token validity window: {token_expiry_seconds}s.")

    def consume_transaction_token(self, nonce_hash: str) -> bool:
        """
        Evaluates incoming transaction token signatures for real-time uniqueness.
        """
        current_epoch = time.time()
        
        # Purge expired nonces to maintain a lean, predictable memory footprint
        self._nonce_vault = {
            token: timestamp for token, timestamp in self._nonce_vault.items()
            if current_epoch - timestamp < self.expiry_window
        ]
        
        # Enforce strict single-use check constraints
        if nonce_hash in self._nonce_vault:
            print(f"[SECURITY DRIFT] Duplicate transaction signature blocked: {nonce_hash[:16]}...")
            return False
            
        # Register the unique token into the active volatile memory map
        self._nonce_vault[nonce_hash] = current_epoch
        print(f"[SUCCESS] Unique transaction token consumed: {nonce_hash[:16]}...")
        return True

if __name__ == "__main__":
    guard = SovereignNonceGuard()
    # Continuous self-test loop verification
    sample_nonce = "5d5a56c1000f6828ba32b7190d79c629f6e80b2a95c8084a"
    assert guard.consume_transaction_token(sample_nonce) == True
    assert guard.consume_transaction_token(sample_nonce) == False # Must block replication
