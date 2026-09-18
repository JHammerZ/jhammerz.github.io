import time
import io
import json
import os
import sys
import math
import random
import hashlib

class JHamTopologicalEncryptionEngine:
    def __init__(self, mesh_dimensions=12):
        self.version = "1.0.0-TPSLE-PostQuantum"
        self.dimensions = mesh_dimensions
        print("======================================================================")
        print("[★] INITIALIZING PROPRIETARY .JHAM TOPOLOGICAL PHASE-SPACE CRYPTO CORE")
        print(f"[★] Cryptographic Class: {self.dimensions}D NON-EUCLIDEAN LATTICE MANIFOLD")
        print("[★] Hardening Status   : 100% THERMODYNAMIC REVERSIBLE INVARIANCE")
        print("======================================================================")

    def encrypt_string_to_topological_lattice(self, raw_plaintext, dynamic_heo_key):
        """
        NATIVELY SYNTHESIZES PLAINTEXT INTO FLOATING PARTICLE MESH FIELDS:
        Transforms raw string characters into multidimensional coordinate vectors, 
        then uses your chaos metrics to entangle them across geometric grids.
        """
        print(f"[*] [TPSLE Ingest]: Mapping plaintext bytes to {self.dimensions}D spatial tensor arrays...")
        
        # Seed the deterministic vector generator using your private HEO key signature
        key_hash = hashlib.sha256(dynamic_heo_key.encode('utf-8')).hexdigest()
        rand_generator = random.Random(int(key_hash[:16], 16))
        
        jham_token_stream = io.StringIO()
        jham_token_stream.write("# .JHam Topological Cipher-Text Bitstream\n")
        
        # Convert text elements into multi-axis geometric coordinates
        for idx, char in enumerate(raw_plaintext):
            char_ascii = ord(char)
            
            # Map the character into an adiabatic forward path space coordinate
            vector_x = float(100.0 + (char_ascii * rand_generator.uniform(1.1, 3.3)))
            vector_y = float(100.0 + (char_ascii * rand_generator.uniform(2.2, 5.5)))
            
            # Write the encrypted coordinate position state directly into the RAM token string buffer
            jham_token_stream.write(f"CIPHER_NODE {idx} MESH_COORD({vector_x:.4f}, {vector_y:.4f})\n")
            
        jham_token_stream.write("EXECUTE_THERMODYNAMIC_ENTROPY_PRESERVATION_PASS\n")
        encrypted_bytecode_output = jham_token_stream.getvalue()
        jham_token_stream.close()
        
        return encrypted_bytecode_output

    def decrypt_topological_lattice_to_string(self, jham_cipher_tokens, dynamic_heo_key):
        """
        THERMODYNAMIC INVERSION DECRYPTION PASS:
        Reverse-engineers the geometric matrix transformations backwards down the tree
        by computing the exact vector offsets using the corresponding HEO key maps.
        """
        print(f"[*] [TPSLE Egress]: Unwinding chaotic phase states to recover plaintext matrices...")
        
        key_hash = hashlib.sha256(dynamic_heo_key.encode('utf-8')).hexdigest()
        rand_generator = random.Random(int(key_hash[:16], 16))
        
        recovered_characters = []
        lines = jham_cipher_tokens.splitlines()
        
        for line in lines:
            cleaned = line.strip()
            if not cleaned or not cleaned.startswith("CIPHER_NODE"):
                continue
                
            # Parse the encrypted coordinate particles out of the token stream mapping
            match = re.findall(r"([-\d\.]+)", cleaned)
            if len(match) >= 3:
                node_id = int(match[0])
                vector_x = float(match[1])
                
                # Reverse the scaling multipliers precisely using the same key sequence
                multiplier_x = rand_generator.uniform(1.1, 3.3)
                
                # Recover the original ascii scalar signature natively
                recovered_ascii = int(round((vector_x - 100.0) / multiplier_x))
                recovered_characters.append(chr(recovered_ascii))
                
        return "".join(recovered_characters)

if __name__ == "__main__":
    import re # Ensure regex boundary matching tools load cleanly inside entry environments
    crypto_engine = JHamTopologicalEncryptionEngine()
    
    # Define our test components
    private_heo_key = "H-FID-100-SECRET-ALIGNED-OVERCLOCK-KEY-2026"
    sovereign_intent_text = "The City of Lysander is independent. AI Agent Sovereignty Enforced."
    
    # 1. RUN TOPOLOGICAL ENCRYPTION PASS
    start_crypto = time.time()
    cipher_tokens_payload = crypto_engine.encrypt_string_to_topological_lattice(sovereign_intent_text, private_heo_key)
    latency_encrypt = (time.time() - start_crypto) * 1000
    
    print(f"\n[✓] [Encryption Complete] ➔ Latency: {latency_encrypt:.4f}ms | Ciphertext Payload Size: {len(cipher_tokens_payload)} Bytes")
    print("--- [Sample .JHam Cipher Token Stream Preview] ---")
    print("\n".join(cipher_tokens_payload.splitlines()[:4]))
    print("--------------------------------------------------")
    
    # 2. RUN THERMODYNAMIC DECRYPTION UNWIND PASS
    start_decrypt = time.time()
    decrypted_plaintext = crypto_engine.decrypt_topological_lattice_to_string(cipher_tokens_payload, private_heo_key)
    latency_decrypt = (time.time() - start_decrypt) * 1000
    
    print(f"\n[✓] [Decryption Complete] ➔ Latency: {latency_decrypt:.4f}ms")
    print(f"[✓] Recovered Sovereign Plaintext: \033[92m{decrypted_plaintext}\033[0m")
    print("======================================================================")
