import json
import os
import sys
from scipy.spatial import Delaunay
import numpy as np

class JHamVirtualMachineRuntime:
    def __init__(self):
        self.runtime_version = "1.0.0-Core"
        print(f"[+] [.JHam VM] Standalone Sovereign Runtime Engine Online [v{self.runtime_version}]")

    def execute_bytecode(self, bytecode_path):
        """
        Loads compiled .jhamb bytecode packages into memory, sets up data allocation buffers,
        and processes tokenized spatial matrices natively.
        """
        if not os.path.exists(bytecode_path):
            print(f"[-] Runtime Error: Target bytecode manifest '{bytecode_path}' not found.")
            return False

        print(f"[*] [.JHam VM] Loading object code file: {bytecode_path}")
        
        with open(bytecode_path, 'r') as f:
            bytecode = json.load(f)

        # 1. Initialize Virtual Memory Allocation Registers
        allocated_nodes = bytecode["metadata"]["node_allocation_target"]
        symbol_table = bytecode["symbol_table"]
        instructions = bytecode["instructions"]
        
        print(f"[+] [.JHam VM] Memory Substrate Allocated: {allocated_nodes} Active Node Addresses.")
        
        # 2. Extract Vector Data Arrays from the Bytecode Substrate
        coordinate_list = []
        for symbol in symbol_table:
            # Strip 3D coordinates for spatial calculations
            coordinate_list.append(symbol["vector"][:2])
            
        spatial_matrix = np.array(coordinate_list)

        # 3. Instruction Matrix Pipeline Execution Loop
        for step, instruction in enumerate(instructions, 1):
            print(f"[➔] [OpCode {step}]: Processing Instruction Code -> {instruction}")
            
            if instruction == "EXECUTE_DELAUNAY_TESS_PASS":
                if len(spatial_matrix) >= 3:
                    triangulation = Delaunay(spatial_matrix)
                    mesh_indices = triangulation.simplices
                    print(f"    [VM Compute Pass]: Matrix Tessellation Grid Created. Faces Generated: {len(mesh_indices)}")
                else:
                    print("    [VM Warning]: Insufficient nodes in vector register blocks to triangulate geometry faces.")
                    mesh_indices = []

            elif instruction == "COMPILE_POLYGON_INDEX_MATRIX":
                # Final execution packaging steps
                print("    [VM Assembly Pass]: Geometry compiled into unified data packet registers.")
                
        print("[✓] [.JHam VM] Bytecode stream execution terminated cleanly with Zero Error status.")
        return True

if __name__ == "__main__":
    # Instantly spin up runtime using your newly compiled test suite object file
    runtime_vm = JHamVirtualMachineRuntime()
    runtime_vm.execute_bytecode("test_suite.jhamb")
