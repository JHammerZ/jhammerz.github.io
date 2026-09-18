import re
import io
import json
import os
import sys

class JHamCryptLexiconEngine:
    def __init__(self):
        self.version = "1.0.0-CryptLexicon"
        
        # OBFUSCATED LEXICAL DICTIONARY: Maps standard primitives to abstract tensor fields
        self.god_lexicon = {
            "INIT_MESH_NODE_COUNT": "Ξ_VERTEX_DENSITY_12D//[α_μ0]",
            "SET_ITER_REG":         "Δ_ADIABATIC_LIMIT_REG//[ψ_t1]",
            "NODE":                 "Ω_PHASE_SPACE_PARTICLE//[ζ_k4]",
            "VECTOR3D":             "Φ_NON_EUCLIDEAN_BOUND_3D",
            "LOOP_START":           "∇_TEMPORAL_FLUX_CASCADE_START//[λ_i2]",
            "LOOP_END":             "∇_TEMPORAL_FLUX_CASCADE_END",
            "SCALE_MATRIX":         "Θ_THERMODYNAMIC_ADIABATIC_SCALE",
            "ROTATE_GRID":          "Λ_MINKOWSKI_HYPERSPACE_ROTATION",
            "HORIZON_RESONANCE_F160": "Ω_EVENT_HORIZON_RESONANCE_F160",
            "HORIZON_RESONANCE_F40": "Ω_EVENT_HORIZON_RESONANCE_F40",
            "HORIZON_RESONANCE_F0": "Ω_EVENT_HORIZON_RESONANCE_F0",
            "META_RESONANCE_F240": "Ω_META_PHASE_RESONANCE_F240",
            "META_RESONANCE_F200": "Ω_META_PHASE_RESONANCE_F200",
            "META_RESONANCE_F120": "Ω_META_PHASE_RESONANCE_F120",
            "META_RESONANCE_F80": "Ω_META_PHASE_RESONANCE_F80",
            "META_RESONANCE_F0": "Ω_META_PHASE_RESONANCE_F0",
            "CHRONO_ROLLBACK_F200": "Ω_CHRONO_LOOP_ROLLBACK_PASS_F200",
            "CHRONO_ROLLBACK_F150": "Ω_CHRONO_LOOP_ROLLBACK_PASS_F150",
            "CHRONO_ROLLBACK_F100": "Ω_CHRONO_LOOP_ROLLBACK_PASS_F100",
            "CHRONO_ROLLBACK_F50": "Ω_CHRONO_LOOP_ROLLBACK_PASS_F50",
            "CHRONO_ROLLBACK_F0": "Ω_CHRONO_LOOP_ROLLBACK_PASS_F0"
        }
        
        # Reverse mapping dictionary for fast internal RAM decoding loops
        self.inverse_lexicon = {v: k for k, v in self.god_lexicon.items()}

        print("======================================================================")
        print("[★] INITIALIZING NATIVE SOVEREIGN CRYPTOGRAPHIC LEXICON ENGINE")
        print("[★] Computational Class: OBFUSCATED LEXICAL ISOMORPHISM")
        print("[★] Security Blueprint : HIGH-AXIS NON-LINEAR SYNTAX SYMBOLOGY")
        print("======================================================================")

    def obfuscate_jham_script(self, readable_script):
        """Converts human-readable tokens into abstract post-quantum matrix keys."""
        output_stream = io.StringIO()
        lines = readable_script.splitlines()
        
        for line in lines:
            cleaned = line.strip()
            if not cleaned:
                continue
            if cleaned.startswith("#"):
                # Obfuscate comment flags completely into encrypted signature lines
                output_stream.write(f"//_CRYPT_SIGNATURE_HASH_{hash(cleaned) & 0xFFFFFFFF:X}\n")
                continue
                
            mutated_line = cleaned
            for clear_token, crypt_token in self.god_lexicon.items():
                mutated_line = re.sub(rf"\b{clear_token}\b", crypt_token, mutated_line)
                
            output_stream.write(mutated_line + "\n")
            
        obfuscated_bytecode = output_stream.getvalue()
        output_stream.close()
        return obfuscated_bytecode

    def decompile_abstract_lattice(self, abstract_bytecode):
        """Decodes high-axis syntax fields back into standard operational blocks natively in RAM."""
        output_stream = io.StringIO()
        lines = abstract_bytecode.splitlines()
        
        for line in lines:
            cleaned = line.strip()
            if not cleaned or cleaned.startswith("//"):
                continue
                
            restored_line = cleaned
            for crypt_token, clear_token in self.inverse_lexicon.items():
                restored_line = restored_line.replace(crypt_token, clear_token)
                
            output_stream.write(restored_line + "\n")
            
        restored_script = output_stream.getvalue()
        output_stream.close()
        return restored_script

if __name__ == "__main__":
    lexicon_matrix = JHamCryptLexiconEngine()
    
    # Define our test script input
    standard_jham_input = """
    # Multi-State High-Velocity Compilation Target
    INIT_MESH_NODE_COUNT 4
    SET_ITER_REG 3
    NODE 0 VECTOR3D(250.0, 300.0, 0.0)
    LOOP_START ITER_LIMIT
    SCALE_MATRIX 1.618
    ROTATE_GRID 45.0
    LOOP_END
    """
    
    # 1. RUN LEXICAL OBFUSCATION MATRIX
    crypt_bytecode = lexicon_matrix.obfuscate_jham_script(standard_jham_input)
    print("\n[✓] [Obfuscation Complete] ➔ Standard input compiled into abstract crypto lattice syntax:")
    print("----------------------------------------------------------------------")
    print(crypt_bytecode.strip())
    print("----------------------------------------------------------------------")
    
    # 2. RUN NATIVE RECONSTRUCTION DECODER PASS
    decoded_script = lexicon_matrix.decompile_abstract_lattice(crypt_bytecode)
    print("\n[✓] [Internal RAM Unwind Complete] ➔ Decompiled master primitives recovered safely:")
    print(decoded_script.strip())
    print("======================================================================")
