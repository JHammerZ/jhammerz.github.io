/* 
 * LYSANDER CORE - PERSPECTIVE ENGINE v1.0
 * Purpose: Visualizing the depth of the 124GB Core Logic
 * Architect: jhammerz
 */

document.addEventListener('mousemove', (e) => {
    const svg = document.getElementById('lysander-shadow');
    if (!svg) return;

    // Calculate mouse offset from center
    const x = (window.innerWidth / 2 - e.pageX) / 25;
    const y = (window.innerHeight / 2 - e.pageY) / 25;

    // Apply the "Sovereign Shift" to the Iris and Gates
    const iris = document.getElementById('iris');
    const gates = document.querySelectorAll('polygon[id^="gate_"]');

    if (iris) {
        iris.style.transform = `translate(${x}px, ${y}px)`;
    }

    gates.forEach((gate, index) => {
        // Gates shift at a different rate to create 3D depth
        const depth = (index + 1) * 0.5;
        gate.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
});
