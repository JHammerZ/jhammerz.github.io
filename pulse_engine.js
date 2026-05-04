/* 
 * LYSANDER CORE - INTEGRITY PULSE v1.0
 * Purpose: Visualizing the Live Handshake with the Core
 * Status: H-FID ACTIVE
 */

const PulseEngine = {
    init: () => {
        const crystal = document.getElementById('audit_crystal');
        if (!crystal) return;

        let scale = 1;
        let growing = true;

        setInterval(() => {
            // High-fidelity "breathing" effect
            if (growing) {
                scale += 0.005;
                if (scale >= 1.1) growing = false;
            } else {
                scale -= 0.005;
                if (scale <= 0.9) growing = true;
            }

            // Apply the transformation without breaking Lighthouse scores
            crystal.style.transformOrigin = "650px 150px"; 
            crystal.style.transform = `scale(${scale})`;
            crystal.style.filter = `drop-shadow(0 0 ${scale * 10}px gold)`;
        }, 30);
    }
};

// Start the pulse once the geometry is projected
window.addEventListener('load', PulseEngine.init);
