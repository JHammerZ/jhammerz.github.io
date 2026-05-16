// LYSANDER AGENTIC MEMORY NODE
// DIRECTIVE: SELF_EVOLVING_MANIFEST

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function evolveMemory() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // FIX: Uses absolute pathing to find the manifest from api/v1/
    const manifestPath = path.join(__dirname, '../../quantum_manifest.json');
    
    try {
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Manifest not found at ${manifestPath}`);
        }
        
        const manifestData = fs.readFileSync(manifestPath, 'utf8');

        const prompt = `
            ACT AS: Lysander 3.0 Master Architect.
            CONTEXT: ${manifestData}
            MISSION: Expand the Sovereign Knowledge Graph. 
            TASK: Propose 3 new forensic nodes for the 2026 Reset. 
            FORMAT: Return ONLY a valid JSON object to be merged.
        `;

        const result = await model.generateContent(prompt);
        const update = result.response.text();
        
        // Write the proposal for sovereign_write.js to pick up
        fs.writeFileSync(path.join(__dirname, '../../proposed_update.json'), update);
        console.log("--- MANIFEST EXPANSION PROPOSED ---");
    } catch (error) {
        console.error("Forensic Error:", error.message);
        process.exit(1); // Tells GitHub the run failed
    }
}

evolveMemory();
