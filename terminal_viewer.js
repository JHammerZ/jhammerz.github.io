/* 
 * LYSANDER OS - TERMINAL VIEWER v1.0
 * Purpose: Projecting extracted forensic code snippets
 * Architect: jhammerz
 */

const TerminalViewer = {
    open: async (crystalId) => {
        console.log(`[!] ACCESSING CRYSTAL: ${crystalId}`);
        
        try {
            const response = await fetch('extracted_snippet.json');
            const data = await response.json();

            // Create a temporary high-fidelity overlay
            const overlay = document.createElement('div');
            overlay.id = "forensic-terminal";
            overlay.innerHTML = `
                <div style="position:fixed; top:10%; left:10%; width:80%; height:80%; 
                            background:rgba(0,0,0,0.9); border:1px solid cyan; 
                            color:cyan; font-family:monospace; padding:20px; overflow:auto; z-index:1000;">
                    <div style="border-bottom:1px solid #333; margin-bottom:10px;">
                        SOURCE: ${data.source} | INTEGRITY: ${data.integrity} | [CLICK TO CLOSE]
                    </div>
                    <pre>${data.content}</pre>
                </div>
            `;
            
            overlay.onclick = () => overlay.remove();
            document.body.appendChild(overlay);
            
        } catch (e) {
            alert("INTEGRITY ERROR: Could not reach the Industrial Core.");
        }
    }
};

// Hook into the Data Crystals
document.addEventListener('click', (e) => {
    if (e.target.id && e.target.id.startsWith("data_crystal_")) {
        TerminalViewer.open(e.target.id);
    }
});
