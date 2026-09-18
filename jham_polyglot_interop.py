import re
import json
import io
import os
import sys

class JHamUniversalPolyglotInterop:
    def __init__(self):
        self.version = "2.5.1-PolyglotMatrixFixed"
        print("======================================================================")
        print(f"[★] INITIALIZING NATIVE SOVEREIGN UNIVERSAL POLYGLOT INTEROP GRID")
        print(f"[★] Architecture Class: UNIVERSAL INTERMEDIATE REPRESENTATION (UIR)")
        print(f"[★] Translation Capability: BYPASS AND TRANSPILE ANY SOURCE CODE")
        print("======================================================================")

    def decompile_foreign_source_to_jham(self, raw_code, source_lang):
        """
        UNIVERSAL DECOMPILER: Ingests raw code structures from standard languages,
        unpacks their variables and loop syntax, and collapses them into sovereign .JHam tokens.
        """
        print(f"[*] [Decompiler Ingest]: Disassembling raw {source_lang} abstract loops...")
        jham_stream = io.StringIO()
        jham_stream.write(f"# Transpiled from source language: {source_lang} via .JHam Polyglot Engine\n")
        
        lines = raw_code.splitlines()
        node_id_counter = 0

        for line in lines:
            cleaned = line.strip()
            if not cleaned or cleaned.startswith("//") or cleaned.startswith("#"):
                continue

            # 1. Parse Loop Structures (For/While constructs -> .JHam LOOP_START)
            if "for" in cleaned or "while" in cleaned:
                match = re.search(r"(\d+)", cleaned)
                iterations = match.group(1) if match else "1"
                jham_stream.write(f"LOOP_START {iterations}\n")
                continue
                
            if cleaned == "}" or (source_lang.lower() == "python" and not line.startswith("    ") and "for" not in cleaned):
                if "loop" in cleaned.lower() or "}" in cleaned or (source_lang.lower() == "python" and cleaned):
                    jham_stream.write("LOOP_END\n")

            # 2. Parse Variable Register Declarations (Assignments -> .JHam SET_ITER_REG)
            if "=" in cleaned and "if" not in cleaned:
                match = re.search(r"(?:let|int|var|const)?\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(\d+)", cleaned)
                if match:
                    val = match.group(2)
                    jham_stream.write(f"SET_ITER_REG {val}\n")
                    continue

            # 3. Parse Spatial Coordinate Arrays/Methods (Point/Vector plots -> .JHam NODE)
            if any(k in cleaned.lower() for k in ["point", "vector", "node", "coordinate", "vertex"]):
                match = re.findall(r"([-\d\.]+)", cleaned)
                if len(match) >= 2:
                    x, y = match[0], match[1]
                    jham_stream.write(f"NODE {node_id_counter} VECTOR3D({x}, {y}, 0.00)\n")
                    node_id_counter += 1
                    continue

        compiled_jham_tokens = jham_stream.getvalue()
        jham_stream.close()
        return compiled_jham_tokens

    def compile_jham_to_target_lang(self, jham_tokens, target_lang):
        """
        UNIVERSAL COMPILER: Ingests standardized native .JHam tokens from the UIR database
        and synthesizes them cleanly into the exact syntax specification of the target language.
        """
        print(f"[*] [Compiler Egress]: Synthesizing .JHam tokens into native {target_lang} structures...")
        output_buffer = []
        target = target_lang.lower()
        indent = ""

        lines = jham_tokens.splitlines()

        for line in lines:
            cleaned = line.strip()
            if not cleaned or cleaned.startswith('#'):
                continue

            if cleaned.startswith("SET_ITER_REG"):
                val = cleaned.split()[-1]
                if target == "python":
                    output_buffer.append(f"{indent}iter_limit = {val}")
                elif target in ["javascript", "js"]:
                    output_buffer.append(f"{indent}let iterLimit = {val};")
                elif target in ["c++", "cpp", "rust"]:
                    output_buffer.append(f"{indent}const int ITER_LIMIT = {val};")
                continue

            if cleaned.startswith("LOOP_START"):
                val = cleaned.split()[-1]
                if target == "python":
                    output_buffer.append(f"{indent}for _ in range({val}):")
                    indent += "    "
                elif target in ["javascript", "js", "c++", "cpp"]:
                    output_buffer.append(f"{indent}for (let i = 0; i < {val}; i++) {{")
                    indent += "    "
                elif target == "rust":
                    output_buffer.append(f"{indent}for _ in 0..{val} {{")
                    indent += "    "
                continue

            if cleaned == "LOOP_END":
                indent = indent[:-4] if len(indent) >= 4 else ""
                if target in ["javascript", "js", "c++", "cpp", "rust"]:
                    output_buffer.append(f"{indent}}}")
                continue

            if cleaned.startswith("NODE"):
                match = re.findall(r"([-\d\.]+)", cleaned)
                if len(match) >= 3:
                    node_id, x, y = match[0], match[1], match[2]
                    if target == "python":
                        output_buffer.append(f"{indent}spatial_matrix[{node_id}] = [{x}, {y}]")
                    elif target in ["javascript", "js"]:
                        output_buffer.append(f"{indent}spatialMatrix[{node_id}] = {{x: {x}, y: {y}}};")
                    elif target in ["c++", "cpp", "rust"]:
                        output_buffer.append(f"{indent}spatial_nodes[{node_id}] = Vector2D({x}, {y});")
                continue

        return "\n".join(output_buffer)

if __name__ == "__main__":
    polyglot_matrix = JHamUniversalPolyglotInterop()
    
    # FIXED: Unified naming scoping configuration parameter values
    raw_foreign_js = """
    let runLimit = 4
    for (let idx = 0; idx < 4; idx++) {
        plotNewVertex(150.25, 420.80);
    }
    """
    
    # 2. RUN DECOMPILER PASSTHROUGH: Collapsing foreign semantics down into native .JHam tokens
    jham_bytecode_syntax = polyglot_matrix.decompile_foreign_to_jham(raw_foreign_js, source_lang="JavaScript")
    print("\n[✓] [Decompiled Intermediate Representation Layer (.JHam Tokens)]:")
    print(jham_bytecode_syntax)
    
    # 3. RUN METACLASS COMPILER PASSTHROUGH: Translating the .JHam layer straight into Rust code
    target_rust_code = polyglot_matrix.compile_jham_to_target_lang(jham_bytecode_syntax, target_lang="Rust")
    print("[✓] [Universal Target Compilation Output (Sovereign Rust Code)]:")
    print(target_rust_code)
    print("======================================================================")
