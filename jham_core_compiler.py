import re
import sys
import json
import os

class JHamLanguageCompiler:
    def __init__(self):
        self.version = "1.3.0-Flow"
        print(f"[+] [.JHam] Advanced Flow Control Compiler Core [v{self.version}] Initialized.")

    def compile_source_file(self, source_path, output_path=None):
        """
        Parses raw .JHam syntax, tokenizes structural instructions,
        and adds explicit support for programmatic nested matrix loops.
        """
        if not os.path.exists(source_path):
            print(f"[-] Compilation Error: Source file '{source_path}' not found.")
            return False

        print(f"[*] [.JHam] Compiling token array structures: {source_path}")
        
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

            # 1. Parse Allocation Directives
            if line.startswith("INIT_MESH_NODE_COUNT"):
                match = re.match(r"INIT_MESH_NODE_COUNT\s+(\d+)", line)
                if match:
                    compiled_bytecode["metadata"]["node_allocation_target"] = int(match.group(1))
                continue

            # 2. Parse Primitive Vector Nodes
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

            # 3. ADVANCED FLOW CONTROL TOKENS
            if line.startswith("LOOP_START"):
                match = re.match(r"LOOP_START\s+(\d+)", line)
                if match:
                    compiled_bytecode["instructions"].append({"op": "LOOP_START", "param": int(match.group(1))})
                continue

            if line == "LOOP_END":
                compiled_bytecode["instructions"].append({"op": "LOOP_END", "param": None})
                continue

            # 4. Standard Operational Primitives
            if line.startswith("SCALE_MATRIX") or line.startswith("ROTATE_GRID"):
                parts = line.split()
                if len(parts) == 2:
                    compiled_bytecode["instructions"].append({"op": parts[0], "param": float(parts[1])})
                continue

            if line in ["EXECUTE_DELAUNAY_TESS_PASS", "COMPILE_POLYGON_INDEX_MATRIX"]:
                compiled_bytecode["instructions"].append({"op": line, "param": None})
                continue

            print(f"[!] Warning [Line {line_num}]: Unmapped syntax token: '{line}'")

        if not output_path:
            output_path = source_path.replace(".JHam", ".jhamb")

        with open(output_path, 'w') as out_f:
            json.dump(compiled_bytecode, out_f, separators=(',', ':'))
            
        print(f"[✓] Structural Flow Compilation Success. Bytecode written to: {output_path}")
        return True

if __name__ == "__main__":
    test_source = "test_suite.JHam"
    with open(test_source, "w") as ts:
        ts.write("# High Density Programmatic Nested Loop Test\n")
        ts.write("INIT_MESH_NODE_COUNT 2\n")
        ts.write("NODE 0 VECTOR3D(120.0, 240.0, 0.0)\n")
        ts.write("NODE 1 VECTOR3D(140.0, 220.0, 0.0)\n")
        ts.write("LOOP_START 3\n")
        ts.write("SCALE_MATRIX 1.1\n")
        ts.write("ROTATE_GRID 15.0\n")
        ts.write("LOOP_END\n")
        ts.write("EXECUTE_DELAUNAY_TESS_PASS\n")

    compiler = JHamLanguageCompiler()
    compiler.compile_source_file(test_source)
