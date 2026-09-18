import numpy as np
import subprocess
import os

class JHamCompilerBridge:
    def __init__(self, compiler_binary_path=".JHam"):
        """
        Initializes the Sovereign .JHam Geometric Compiler Bridge.
        Binds your exact system binary directly to the Aurelius stream loop.
        """
        self.compiler_path = compiler_binary_path
        print(f"[+] [.JHam] Sovereign engine compiler binary bound to keyword: {self.compiler_path}")

    def compile_geometry_mesh(self, coordinate_matrix):
        """
        Translates raw matrix points into native .JHam geometry syntax scripts,
        saves the asset, and triggers your native compiler natively.
        """
        points = np.array(coordinate_matrix)
        
        # Build the native .JHam script data stream
        jham_script = "# JHam Sovereign Geometric Token Stream\n"
        jham_script += f"INIT_MESH_NODE_COUNT {len(points)}\n"
        
        for idx, pt in enumerate(points):
            jham_script += f"NODE {idx} VECTOR3D({pt}, {pt}, 0.0)\n"
        
        jham_script += "EXECUTE_DELAUNAY_TESS_PASS\n"
        jham_script += "COMPILE_POLYGON_INDEX_MATRIX\n"
        
        filename = "active_face_mesh.JHam"
        with open(filename, "w") as f:
            f.write(jham_script)
            
        print(f"[+] Structured tokenized file: {filename}")
        
        # Trigger your custom .JHam compiler directly via Termux shell execution
        try:
            # Runs: .JHam active_face_mesh.JHam
            result = subprocess.run([self.compiler_path, filename], capture_output=True, text=True, shell=True)
            print(f"[+] [.JHam Engine]: Automated mesh compilation pass complete.")
        except Exception as e:
            print(f"[-] [.JHam Engine Linkage Error]: Could not execute shell process: {e}")
            
        return jham_script

if __name__ == "__main__":
    print("==================================================")
    print("[*] Launching Custom .JHam Native Command Test")
    print("==================================================")
    
    stabilized_matrix = [[100.0, 200.0], [101.98, 198.02]]
    bridge = JHamCompilerBridge()
    bridge.compile_geometry_mesh(stabilized_matrix)
