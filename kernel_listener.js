/* 
 * LYSANDER OS - INTERACTIVE KERNEL LISTENER v1.0
 * Purpose: Handling UI Interrupts for Forensic Data Access
 * Architect: jhammerz
 */

const KernelListener = {
    "REPORT_FETCH": (nodeId) => {
        console.log(`[!] INTERRUPT: Fetching Forensic State for ${nodeId}...`);
        
        // Simulates pulling the specific audit report for that process
        window.open(`https://github.io`, '_blank');
        
        // Trigger a visual "Handshake" confirmation on the UI
        const block = document.getElementById(nodeId);
        if (block) {
            block.setAttribute('style', 'stroke: gold; stroke-width: 5;');
            setTimeout(() => block.setAttribute('style', 'stroke: cyan; stroke-width: 2;'), 1000);
        }
    }
};

// Global OS Click Handler
document.addEventListener('click', (e) => {
    const targetId = e.target.id;
    if (targetId && targetId.startsWith("log_block_")) {
        KernelListener.REPORT_FETCH(targetId);
    }
});
