import pathlib

def inject_neural_commit():
    print("[*] Wiring Neural Cortex outputs into Master Orchestrator...")
    orch_path = pathlib.Path("scripts/matrix_orchestrator.sh")
    
    if not orch_path.exists():
        print("[-] Target orchestrator missing.")
        return
        
    with open(orch_path, "r") as f:
        content = f.read()

    # Find where the neural generation needs to happen inside the hourly loop
    old_block = """    # 6. Aggregate and push all newly written telemetry strings and logs
    echo "[*] Staging dynamic substrate modifications..."
    git add -A
    
    if ! git diff-index --quiet HEAD --; then
        echo "[+] Modifications detected. Hardening repository head..."
        git commit -m "sys: automated matrix telemetry synchronization ($TIMESTAMP)"
        echo "[*] Pushing data vectors live via native git pipeline..."
        git push origin main"""

    new_block = """    # 7. Generate procedural neural narrative commit message
    echo "[*] Invoking Neural Cortex narrative generator..."
    python3 scripts/neural_cortex.py
    NEURAL_MSG=$(cat scripts/neural_commit_msg.txt 2>/dev/null || echo "sys: automated matrix telemetry synchronization ($TIMESTAMP)")

    # 8. Aggregate and push all newly written telemetry strings and logs
    echo "[*] Staging dynamic substrate modifications..."
    git add -A
    
    if ! git diff-index --quiet HEAD --; then
        echo "[+] Modifications detected. Hardening repository head..."
        git commit -m "$NEURAL_MSG"
        echo "[*] Pushing data vectors live via native git pipeline..."
        git push origin main"""

    if "neural_cortex.py" in content:
        print("[+] Orchestrator loop is already wired into the Neural Cortex.")
        return

    if old_block in content:
        content = content.replace(old_block, new_block)
        with open(orch_path, "w") as f:
            f.write(content)
        print("[+] Success: Master Orchestrator loop updated to consume neural thought outputs.")
    else:
        # Fallback if text alignment varies slightly due to previous additions
        print("[-] Exact string match block missed. Applying targeted line insertion...")
        content = content.replace('git commit -m "sys: automated matrix telemetry synchronization ($TIMESTAMP)"', 'python3 scripts/neural_cortex.py\n        NEURAL_MSG=$(cat scripts/neural_commit_msg.txt)\n        git commit -m "$NEURAL_MSG"')
        with open(orch_path, "w") as f:
            f.write(content)
        print("[+] Success: Target line insertion complete.")

if __name__ == "__main__":
    inject_neural_commit()
