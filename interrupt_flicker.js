/* 
 * LYSANDER OS - INTERRUPT FLICKER v1.0
 * Purpose: Visualizing the UI-to-Kernel Handshake
 * Architect: jhammerz
 */

const InterruptFlicker = {
    activate: () => {
        const beacon = document.getElementById('beacon');
        if (!beacon) return;

        console.log("[!] SYSTEM INTERRUPT: Signaling Core...");
        
        // High-speed data flicker
        beacon.style.transition = "opacity 0.05s";
        let flickerCount = 0;
        const interval = setInterval(() => {
            beacon.style.opacity = flickerCount % 2 === 0 ? "1" : "0.2";
            flickerCount++;
            if (flickerCount > 10) {
                clearInterval(interval);
                beacon.style.opacity = "1";
            }
        }, 50;
    }
};

// Hook into the Radial Menu logic
document.addEventListener('mousedown', (e) => {
    if (e.target.id === 'iris') {
        InterruptFlicker.activate();
    }
});
