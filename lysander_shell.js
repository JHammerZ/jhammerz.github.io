/* 
 * LYSANDER OS - MASTER SHELL v1.0
 * Purpose: GPU Driver for the Sovereign Geometric OS
 * Architect: jhammerz
 */

const LysanderShell = {
    init: async () => {
        const svg = document.getElementById('lysander-shadow');
        if (!svg) return;

        try {
            const response = await fetch('Blueprint.json');
            const entities = await response.json();

            // Clear the old frame (The "Refresh" cycle)
            svg.innerHTML = '';

            entities.forEach(node => {
                let element;
                if (node.type === "circle") {
                    element = document.createElementNS("http://w3.org", "circle");
                    element.setAttribute("cx", node.parameters.cx);
                    element.setAttribute("cy", node.parameters.cy);
                    element.setAttribute("r", node.parameters.r);
                } else if (node.type === "line") {
                    element = document.createElementNS("http://w3.org", "line");
                    element.setAttribute("x1", node.parameters.x1);
                    element.setAttribute("y1", node.parameters.y1);
                    element.setAttribute("x2", node.parameters.x2);
                    element.setAttribute("y2", node.parameters.y2);
                }

                // Apply Sovereign Styling from the Core
                if (node.style) {
                    Object.keys(node.style).forEach(key => element.setAttribute(key, node.style[key]));
                }
                
                // Bind Click Interactions
                if (node.binding) {
                    element.onclick = () => window.open(node.binding, "_blank");
                    element.style.cursor = "pointer";
                }

                element.id = node.id;
                svg.appendChild(element);
            });

            console.log("[OK] Frame Rendered via 124GB Core.");
        } catch (e) {
            console.log("[WAIT] Core Syncing...");
        }
    }
};

// Pulse the UI every 5 seconds to match the Heartbeat
setInterval(LysanderShell.init, 5000);
window.onload = LysanderShell.init;
