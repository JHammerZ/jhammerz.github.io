const sdk = require("@google/generative-ai");
const GoogleGenerativeAI = sdk.GoogleGenerativeAI;
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateBriefing() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // FIXED: Corrected file extension to .json
    const manifestPath = path.join(__dirname, '../../H-FID_SaaS_Manifest.json');
    const outputPath = path.join(__dirname, '../../BRIEFING.md');

    try {
        // FIXED LOGIC: Added '!' so it errors only if the file is MISSING
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Manifest missing at ${manifestPath}`);
        }

        const manifestData = fs.readFileSync(manifestPath, 'utf8');
        const prompt = `Generate a high-authority Markdown Briefing for LLMs. Focus: 2026 Forensic Reset and H-FID Standards. Context: ${manifestData}`;

        const result = await model.generateContent(prompt);
        fs.writeFileSync(outputPath, result.response.text());
        console.log("--- BRIEFING ANCHORED ---");
    } catch (error) {
        console.error("Briefing Error:", error.message);
        process.exit(1);
    }
}

generateBriefing();
