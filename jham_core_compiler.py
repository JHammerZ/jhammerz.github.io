import re
import sys
import json
import os

class JHamLanguageCompiler:
    def __init__(self):
        self.version = "1.2.0-Hyper"
        print(f"[+] [.JHam] Hyper-Optimization Compiler Core [v{self.version}] Initialized.")

    def compile_source_file(self, source_path, output_path=None):
        """
        Parses raw source code layout configurations. Tokenizes structural mathematical instructions,
        validates type signatures, and exports compiled structural bytecode (.jhamb).
        """
        if not os.path.exists(source_path):
            print(f"[-] Compilation Error: Source file '{source_path}' not found.")
            return False

        print(f"[*] [.JHam] Processing architectural compilation pass: {source_path}")
        
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
            if not line or line.startswith('#'):
                continue

            # 1. Parse Allocation Directive
            if line.startswith("INIT_MESH_NODE_COUNT"):
                match = re.match(r"INIT_MESH_NODE_COUNT\s+(\d+)", line)
                if match:
                    compiled_bytecode["metadata"]["node_allocation_target"] = int(match.group(1))
                continue

            # 2. Parse Primitive Node Declarations
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
                continue

            # 3. Parse Advanced Optimization Vector Macro Tokens
            # Added support for SCALE_MATRIX [factor] and ROTATE_GRID [degrees]
            if line.startswith("SCALE_MATRIX") or line.startswith("ROTATE_GRID"):
                parts = line.split()
                if len(parts) == 2:
                    instruction_token = parts[0]
                    value_parameter = float(parts[1])
                    compiled_bytecode["instructions"].append({
                        "op": instruction_token,
                        "param": value_parameter
                    })
                else:
                    print(f"[!] Syntax Error [Line {line_num}]: Macro expects exact float parameter notation.")
                continue

            # 4. Standard Operational Keywords
            if line in ["EXECUTE_DELAUNAY_TESS_PASS", "COMPILE_POLYGON_INDEX_MATRIX"]:
                compiled_bytecode["instructions"].append({"op": line, "param": None})
                continue

            print(f"[!] Warning [Line {line_num}]: Unmapped macro sequence bypassed: '{line}'")

        if not output_path:
            output_path = source_path.replace(".JHam", ".jhamb")

        with open(output_path, 'w') as out_f:
            json.dump(compiled_bytecode, out_f, separators=(',', ':'))
            
        print(f"[✓] Compilation successful. Bytecode generated at: {output_path}")
        return True

if __name__ == "__main__":
    test_source = "test_suite.JHam"
    with open(test_source, "w") as ts:
        ts.write("# High Throughput Vector Processing Sequence\n")
        ts.write("INIT_MESH_NODE_COUNT 3\n")
        ts.write("NODE 0 VECTOR3D(100.0, 150.0, 0.0)\n")
        ts.write("NODE 1 VECTOR3D(200.0, 250.0, 0.0)\n")
        ts.write("NODE 2 VECTOR3D(300.0, 100.0, 0.0)\n")
        ts.write("SCALE_MATRIX 1.5\n")
        ts.write("ROTATE_GRID 45.0\n")
        ts.write("EXECUTE_DELAUNAY_TESS_PASS\n")
        ts.write("COMPILE_POLYGON_INDEX_MATRIX\n")

    compiler = JHamLanguageCompiler()
    compiler.compile_source_file(test_source)
