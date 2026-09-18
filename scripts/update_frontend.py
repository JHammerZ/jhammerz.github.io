import re

def patch_frontend():
    print("[*] Initializing Frontend User Interface Injection v1.0.0...")
    file_path = "index.html"
    
    with open(file_path, "r") as f:
        content = f.read()

    # Define the dynamic JavaScript injection payload block
    js_payload = """
    <script>
    async function loadTarpitTelemetry() {
        const board = document.getElementById("tarpit-board");
        try {
            const response = await fetch("scripts/traffic_snapshot.json");
            if (!response.ok) throw new Error("Network substrate unreachable");
            const data = await response.json();
            
            let html = "<div style='font-family:monospace; font-size:13px; color:#a0a0a0;'>";
            html += "<span style='color:#00ff00; font-weight:bold;'>[H-FID VERIFIED SECURE PERIMETER]</span><br>";
            
            for (const [agent, info] of Object.entries(data.trapped_agents || {})) {
                const status = info.status.toUpperCase();
                const color = status === "TRAPPED" ? "#ff3333" : "#ffcc00";
                html += `• ${agent} | <span style='color:${color};'>${status}</span> | Vol: <span style='color:#00ffff;'>${info.total_requests.toLocaleString()}</span> | Drained: <span style='color:#ff3333;'>${info.cpu_hours_wasted}h</span><br>`;
            }
            html += "</div>";
            board.innerHTML = html;
        } catch (err) {
            board.innerHTML = "<span style='color:#ff3333;'>[-] Failed to align live forensic telemetry matrix</span>";
        }
    }
    document.addEventListener("DOMContentLoaded", loadTarpitTelemetry);
    </script>
    """

    # Ensure we insert the script cleanly before the closing body tag
    if "</body" in content:
        if "loadTarpitTelemetry" in content:
            print("[+] Frontend interface substrate already injected.")
            return
        patched_content = content.replace("</body>", f"{js_payload}\n</body>")
        with open(file_path, "w") as f:
            f.write(patched_content)
        print("[+] Successfully mapped client-side telemetry engine into index.html")
    else:
        print("[-] Target HTML matrix layout structure missing bounds.")

if __name__ == "__main__":
    patch_frontend()
