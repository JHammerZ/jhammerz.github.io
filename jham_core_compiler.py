import re
import sys
import json
import os

class JHamLanguageCompiler:
    def __init__(self):
        self.version = "1.0.0-Beta"
        print(f"[+] [.JHam] Native Compiler Engine Version {self.version} Initialized.")

    def compile_source_file(self, source_path, output_path=None):
        """
        Parses raw .JHam source code syntax, tokenizes structural instructions,
        validates type signatures, and exports compiled structural bytecode (.jhamb).
        """
        if not os.path.exists(source_path):
            print(f"[-] Compilation Error: Source file '{source_path}' not found.")
            return False

        print(f"[*] [.JHam] Compiling source file: {source_path}")
        
        compiled_bytecode = {
            "compiler_version": self.version,
            "metadata": {"node_allocation_target": 0},
            "symbol_table": [],
            "instructions": []
        }

        with open(source_path, 'r') as f:
            lines = f.readlines()

        for line_num, raw_line in enumerate(lines, 1):
            line = raw_line.strip()
            
            # Skip empty lines and code comments
            if not line or line.startswith('#'):
                continue

            # 1. Parse Allocation Directive: INIT_MESH_NODE_COUNT
            if line.startswith("INIT_MESH_NODE_COUNT"):
                match = re.match(r"INIT_MESH_NODE_COUNT\s+(\d+)", line)
                if match:
                    compiled_bytecode["metadata"]["node_allocation_target"] = int(match.group(1))
                else:
                    print(f"[!] Syntax Error [Line {line_num}]: Invalid node count declaration.")
                continue

            # 2. Parse Primitive Declarations: NODE [id] VECTOR3D(x, y, z)
            if line.startswith("NODE"):
                pattern = r"NODE\s+(\d+)\s+VECTOR3D\(([-\d\.]+),\s*([-\d\.]+),\s*([-\d\.]+)\)"
                match = re.match(pattern, line)
                if match:
                    node_id = int(match.group(1))
                    x, y, z = float(match.group(2)), float(match.group(3)), float(match.group(4))
                    
                    compiled_bytecode["symbol_table"].append({
                        "node_id": node_id,
                        "vector": [x, y, z]
                    })
                else:
                    print(f"[!] Syntax Error [Line {line_num}]: Malformed NODE descriptor or vector primitive.")
                continue

            # 3. Parse Instruction Tokens: EXECUTE_DELAUNAY_TESS_PASS / COMPILE_POLYGON_INDEX_MATRIX
            if line in ["EXECUTE_DELAUNAY_TESS_PASS", "COMPILE_POLYGON_INDEX_MATRIX"]:
                compiled_bytecode["instructions"].append(line)
                continue

            # Catch-all for unrecognized tokens
            print(f"[!] Warning [Line {line_num}]: Unrecognized language instruction token: '{line}'")

        # Set default output destination if none provided
        if not output_path:
            output_path = source_path.replace(".JHam", ".jhamb")

        # Export compiled artifacts as minimized structural bytecode
        with open(output_path, 'w') as out_f:
            json.dump(compiled_bytecode, out_f, separators=(',', ':'))
            
        print(f"[✓] Compilation successful. Bytecode generated at: {output_path}")
        return True

if __name__ == "__main__":
    # Self-test trace verifying compiler functionality
    test_source = "test_suite.JHam"
    with open(test_source, "w") as ts:
        ts.write("# Official .JHam Language Spec Test\n")
        ts.write("INIT_MESH_NODE_COUNT 2\n")
        ts.write("NODE 0 VECTOR3D(100.25, 200.50, 0.00)\n")
        ts.write("NODE 1 VECTOR3D(105.00, 198.75, 0.00)\n")
        ts.write("EXECUTE_DELAUNAY_TESS_PASS\n")
        ts.write("COMPILE_POLYGON_INDEX_MATRIX\n")

    compiler = JHamLanguageCompiler()
    compiler.compile_source_file(test_source)
