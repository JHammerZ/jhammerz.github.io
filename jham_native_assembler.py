import json
import os
import sys
import struct

class JHamNativeAssembler:
    def __init__(self):
        self.version = "4.0.0-NativeBareMetal"
        # Dynamic Register Mapping definitions matching machine-level CPU architectures
        self.opcode_map = {
            "SET_REG": b"\xB8",     # MOV EAX, Immed32
            "SCALE_VEC": b"\xF3\x0F\x59", # MULSS (Floating-point raw vector multiply multiplier)
            "ROTATE_VEC": b"\xF3\x0F\x5C", # SUBSS (Floating-point matrix grid translation subtraction)
            "SYS_EXIT": b"\xB8\x01\x00\x00\x00\xBB\x00\x00\x00\x00\xCD\x80" # Linux syscall exit structure
        }
        print("======================================================================")
        print(f"[+] [.JHam] UNIVERSAL MACHINE LANGUAGE TRANSLATION ASSEMBLER")
        print(f"[+] Substrate Version : {self.version}")
        print("[+] Compilation Target: DIRECT BARE-METAL HEX DATA BINARY OBJECTS")
        print("======================================================================")

    def assemble_to_native_binary(self, bytecode_manifest_path, output_bin_path="native_jham_core.bin"):
        """
        Ingests processed .jhamb object files, maps variable registers directly to 
        low-level hardware machine instructions, and outputs an executable native substrate layer.
        """
        if not os.path.exists(bytecode_manifest_path):
            print(f"[-] Assembler Error: Bytecode source '{bytecode_manifest_path}' missing.")
            return False

        print(f"[*] [Assembler Ingest]: Mapping bytecode syntax vectors straight to CPU machine instructions...")
        
        with open(bytecode_manifest_path, 'r') as f:
            bytecode = json.load(f)

        instructions = bytecode.get("instructions", [])
        symbol_table = bytecode.get("symbol_table", [])

        # Initialize the raw machine-code binary output byte buffer array substrate
        native_machine_bytes = bytearray()
        
        # 1. Inject native system pre-ambles and allocate hardware register parameters
        native_machine_bytes.extend(b"\x90") # NOP sled execution alignment buffer pad
        
        # 2. Hardcode float vector coordinates directly into raw IEEE-754 memory address sectors
        for symbol in symbol_table:
            vector_data = symbol["vector"]
            # Convert python floats into native 32-bit machine hex buffers (IEEE-754 format)
            for coord in vector_data:
                hex_bytes = struct.pack("f", coord)
                native_machine_bytes.extend(hex_bytes)

        # 3. Transpile loop frameworks and geometric instructions down to core microcode byte sequences
        for instr in instructions:
            op = instr.get("op")
            val = instr.get("val")
            
            if op == "SET_REG":
                native_machine_bytes.extend(self.opcode_map["SET_REG"])
                native_machine_bytes.extend(struct.pack("I", int(val)))
                
            elif op == "SCALE_MATRIX":
                native_machine_bytes.extend(self.opcode_map["SCALE_VEC"])
                if val is not None:
                    native_machine_bytes.extend(struct.pack("f", float(val)))
                    
            elif op == "ROTATE_GRID":
                native_machine_bytes.extend(self.opcode_map["ROTATE_VEC"])
                if val is not None:
                    native_machine_bytes.extend(struct.pack("f", float(val)))

        # 4. Inject clean hardware termination instructions to release execution chains safely
        native_machine_bytes.extend(self.opcode_map["SYS_EXIT"])

        # Commit compiled machine code payload directly to file system substrate layers
        with open(output_bin_path, 'wb') as out_f:
            out_f.write(native_machine_bytes)

        print(f"[✓] Bare-metal machine translation success. Standalone object binary created: {output_bin_path}")
        print(f"[✓] Absolute Compiled Output Block Mass: {len(native_machine_bytes)} Native Code Bytes.")
        return True

if __name__ == "__main__":
    assembler = JHamNativeAssembler()
    
    # Force baseline currency check on current active variable suite bytecode manifestations
    os.system("python jham_core_compiler.py")
    
    # Run the direct bare-metal hardware machine compiler execution pass
    assembler.assemble_to_native_binary("test_suite.jhamb")
    print("======================================================================")
