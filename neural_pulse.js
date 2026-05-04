/* 
 * LYSANDER CORE - NEURAL PULSE v1.0
 * Purpose: Visualizing the data flow between Core and Nodes
 */

const NeuralPulse = {
    init: () => {
        const svg = document.getElementById('lysander-shadow');
        if (!svg) return;

        // Apply global pulse animation to all active synapses
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-flow {
                0% { stroke-dashoffset: 100; opacity: 0.2; }
                50% { opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0.2; }
            }
            line[id^="synapse_"] {
                stroke-dasharray: 10, 5;
                animation: pulse-flow 3s linear infinite;
                filter: drop-shadow(0 0 5px cyan);
            }
        `;
        document.head.appendChild(style);
        console.log("NEURAL_PULSE: Signal Flow Initialized.");
    }
};

window.addEventListener('DOMContentLoaded', NeuralPulse.init);
