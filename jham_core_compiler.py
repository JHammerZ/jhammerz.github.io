import re
import sys
import json
import os

class JHamLanguageCompiler:
    def __init__(self):
        self.version = "1.5.0-HyperEngine"
        print(f"[+] [.JHam] Advanced Functional Register Compiler Core [v{self.version}] Initialized.")

    def compile_source_file(self, source_path, output_path=None):
        """
        Parses raw .JHam source paths. Maps variables, flow control loops, 
        and hardware audio-visual trigger parameters into optimized bytecode objects.
        """
        if not os.path.exists(source_path):
            print(f"[-] Compilation Error: Source file '{source_path}' not found.")
            return False

        print(f"[*] [.JHam] Structuring hyper-advanced token arrays: {source_path}")
        
        compiled_bytecode = {
            "compiler_version": self.version,
            "metadata": {"node_allocation_target": 0},
            "registers": {},
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

            # 2. Variable Register Allocation
            if line.startswith("SET_ITER_REG"):
                match = re.match(r"SET_ITER_REG\s+(\d+)", line)
                if match:
                    compiled_bytecode["registers"]["ITER_LIMIT"] = int(match.group(1))
                    compiled_bytecode["instructions"].append({"op": "SET_REG", "param": "ITER_LIMIT", "val": int(match.group(1))})
                continue

            # 3. HIGH-ADVANCED SPATIAL CONDITION TRIGGERS
            if line.startswith("TRIGGER_IF_NODE_LIMIT"):
                # Format: TRIGGER_IF_NODE_LIMIT [node_id] [threshold]
                match = re.match(r"TRIGGER_IF_NODE_LIMIT\s+(\d+)\s+([-\d\.]+)", line)
                if match:
                    node_id = int(match.group(1))
                    threshold = float(match.group(2))
                    compiled_bytecode["instructions"].append({
                        "op": "TRIGGER_IF_NODE_LIMIT", 
                        "param": "NODE_CHECK", 
                        "val": {"node_id": node_id, "threshold": threshold}
                    })
                continue

            # 4. MULTI-SILO DANTE AUDIO ROUTING TOKENS
            if line.startswith("ROUTE_AUDIO_GAIN"):
                # Format: ROUTE_AUDIO_GAIN [channel_id] [gain_value]
                match = re.match(r"ROUTE_AUDIO_GAIN\s+(\d+)\s+([-\d\.]+)", line)
                if match:
                    channel_id = int(match.group(1))
                    gain_val = float(match.group(2))
                    compiled_bytecode["instructions"].append({
                        "op": "ROUTE_AUDIO_GAIN", 
                        "param": "DANTE_MIX", 
                        "val": {"channel_id": channel_id, "gain": gain_val}
                    })
                continue

            # 5. Parse Primitive Vector Nodes
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

            # 6. Programmatic Flow Control Loops
            if line.startswith("LOOP_START"):
                match_reg = re.match(r"LOOP_START\s+([A-Za-z_]+)", line)
                match_val = re.match(r"LOOP_START\s+(\d+)", line)
                if match_reg:
                    compiled_bytecode["instructions"].append({"op": "LOOP_START", "param": match_reg.group(1), "val": None})
                elif match_val:
                    compiled_bytecode["instructions"].append({"op": "LOOP_START", "param": None, "val": int(match_val.group(1))})
                continue

            if line == "LOOP_END":
                compiled_bytecode["instructions"].append({"op": "LOOP_END", "param": None, "val": None})
                continue

            # 7. Core Spatial Geometry Modifiers
            if line.startswith("SCALE_MATRIX") or line.startswith("ROTATE_GRID"):
                parts = line.split()
                if len(parts) == 2:
                    compiled_bytecode["instructions"].append({"op": parts[0], "param": None, "val": float(parts[1])})
                continue

            if line in ["EXECUTE_DELAUNAY_TESS_PASS", "COMPILE_POLYGON_INDEX_MATRIX", "MINKOWSKI_METRIC_FLUX_COMPACT", "NON_EUCLIDEAN_METRIC_FOLD_PASS", "HYPERPLANE_PROJECT_PASS", "STOCHASTIC_GRID_INVERSION"]:
                compiled_bytecode["instructions"].append({"op": line, "param": None, "val": None})
                continue

            print(f"[!] Warning [Line {line_num}]: Unmapped grammar: '{line}'")

        if not output_path:
            output_path = source_path.replace(".JHam", ".jhamb")

        with open(output_path, 'w') as out_f:
            json.dump(compiled_bytecode, out_f, separators=(',', ':'))
            
        print(f"[✓] Advanced Feature Compiler Pass Successful. Bytecode written to: {output_path}")
        return True

if __name__ == "__main__":
    test_source = "test_suite.JHam"
    with open(test_source, "w") as ts:
        ts.write("# Hyper-Advanced Functional Conditional Multi-Silo Test\n")
        ts.write("INIT_MESH_NODE_COUNT 2\n")
        ts.write("SET_ITER_REG 3\n")
        ts.write("NODE 0 VECTOR3D(100.0, 200.0, 0.0)\n")
        ts.write("NODE 1 VECTOR3D(150.0, 250.0, 0.0)\n")
        ts.write("TRIGGER_IF_NODE_LIMIT 0 450.0\n")  # Dynamic conditional check token
        ts.write("ROUTE_AUDIO_GAIN 1 0.75\n")       # Dante audio matrix injection token
        ts.write("LOOP_START ITER_LIMIT\n")
        ts.write("SCALE_MATRIX 1.10\n")
        ts.write("ROTATE_GRID 5.0\n")
        ts.write("LOOP_END\n")
        ts.write("EXECUTE_DELAUNAY_TESS_PASS\n")

    compiler = JHamLanguageCompiler()
    compiler.compile_source_file(test_source)
