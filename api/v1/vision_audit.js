// LYSANDER VISION AUDIT NODE
// DIRECTIVE: VISUAL_FORENSICS

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function runVisualAudit(imagePath) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Preparing the visual data
    const imageData = fs.readFileSync(imagePath).toString("base64");
    const imagePart = { inlineData: { data: imageData, mimeType: "image/png" } };

    const prompt = "Act as Master Architect. Perform a forensic audit on this screenshot. Detect security vulnerabilities, UI glitches, or code anomalies.";

    try {
        const result = await model.generateContent([prompt, imagePart]);
        console.log("--- VISUAL AUDIT RESULTS ---");
        console.log(result.response.text());
    } catch (error) {
        console.error("Vision Audit Interrupted:", error.message);
    }
}

runVisualAudit("audit_screen.png");
