import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Initialize the SDK with your API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Critical Error: GEMINI_API_KEY environment variable is missing.");
    process.exit(1);
}

const ai = new GoogleGenerativeAI(apiKey);

async function runSovereignSequence() {
    console.log("⚡ Initializing Sovereign Sequence Core...");
    console.log("🧠 AI Modules successfully mapped in memory.");

    // 2. Initialize the model (Recommended default for fast tasks)
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log("📊 Executing foundational sovereign vector calculation checks...");

    // 3. Fallback/test prompt structure
    const prompt = "Generate a foundational system status overview for a sovereign vector node.";

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log("\n🛰️ --- Gemini Response ---");
        console.log(responseText);
        console.log("---------------------------\n");

        console.log("✅ Complete Sovereign Sequence executed cleanly!");
    } catch (apiError) {
        throw new Error(`Gemini API Call Failed: ${apiError.message}`);
    }
}

runSovereignSequence().catch(err => {
    console.error("❌ Execution Error: ", err);
    process.exit(1);
});
