/* 
 * LYSANDER OS - FORENSIC DISPLAY v1.0
 * Purpose: Projecting the bridged code snippets to the Hub
 * Architect: jhammerz
 */

const ForensicDisplay = {
    init: async () => {
        console.log("[!] LYSANDER: Accessing extraction bridge...");
        
        try {
            const response = await fetch('extracted_snippet.json');
            const data = await response.json();

            // Find the display area on your site
            const display = document.getElementById('forensic-terminal');
            if (display) {
                display.innerHTML = `
                    <div style="color: gold; border-bottom: 1px solid #333; margin-bottom: 10px;">
                        SOURCE: ${data.source} | INTEGRITY: ${data.integrity}
                    </div>
                    <pre style="color: cyan;">${data.content}</pre>
                `;
            }
        } catch (e) {
            console.log("[WAIT] Bridge idle. Awaiting next extraction pulse...");
        }
    }
};

// Auto-load on startup
window.addEventListener('DOMContentLoaded', ForensicDisplay.init);
