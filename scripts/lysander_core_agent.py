import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Re-constructing vertical directory structures for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_DIR = path.join(__dirname, '../content/queue');
const ARCHIVE_DIR = path.join(__dirname, '../content/archive');
const FORENSICS_DIR = path.join(__dirname, '../forensics');

async function runSovereignSequence() {
    console.log("⚡ Activating Lysander 3.0 JHammerZ Protocol Merged Core...");
    console.log("🧠 Autonomous FYP Retention Machine active.");
    
    // Maintain sterile workspace environment boundaries
    if (!fs.existsSync(QUEUE_DIR)) fs.mkdirSync(QUEUE_DIR, { recursive: true });
    if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    if (!fs.existsSync(FORENSICS_DIR)) fs.mkdirSync(FORENSICS_DIR, { recursive: true });

    const files = fs.readdirSync(QUEUE_DIR).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
        console.log("[⚡] Monitoring Matrix clear. Zero incoming payload vectors staged in queue.");
        return;
    }

    console.log(`[📂] Intercepted ${files.length} payload packet(s) inside queue directory.`);

    for (const file of files) {
        const filePath = path.join(QUEUE_DIR, file);
        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);

            const topic = data.topic || "Sovereign Protocol";
            const rawBody = data.text || data.payload_message || "";

            // FYP Retention Loop Optimization Matrix
            const optimizedScript = `
🎬 [0-3s ALGORTIHMIC VISUAL HOOK]: *Bold On-Screen Text Change* -> "This is why your tracking loops are lagging..."
🧠 [3-30s CORE VALUE RETENTION]: ${rawBody}
🔄 [DYNAMIC LOOP REWATCH ANCHOR]: "...and that's exactly why you need to realize..."
            `.trim();

            // SEO/AEO Discovery Search Metadata Block
            const fypCaption = `
🚀 ${topic} | System Architecture Matrix.

Anomalies mitigated. Multi-repository parameters mapped cleanly down to edge loops. 

#${topic.replace(/\s+/g, '')} #JHammerZ #LysanderProtocol #Coding #DevOps #TechTrends2026 #DataAutomation #SovereignSync
🌐 Track live footprint: https://github.io
            `.trim();

            const packageId = `H-FID-${Date.now()}`;
            const productionAsset = {
                id: packageId,
                status: "OPTIMIZED_FOR_SATURATION",
                script_framework: optimizedScript,
                caption_metadata: fypCaption,
                distribution_nodes: 16,
                telemetry_signature: "100/100 H-FID"
            };

            console.log(`\n=================== [🚀 MERGED PACKET: ${packageId}] ===================`);
            console.log(JSON.stringify(productionAsset, null, 2));
            console.log("========================================================================\n");

            // Append to forensics trail ledger permanently
            const logLine = `[${new Date().toISOString()}] METRIC_SYNC | ID: ${packageId} | Status: Optimized for FYP Saturation.\n`;
            fs.appendFileSync(path.join(FORENSICS_DIR, 'sentinel.log'), logLine);

            // Relocate file cleanly to prevent re-posting loops
            fs.renameSync(filePath, path.join(ARCHIVE_DIR, file));
            console.log(`[🚀] Asset archived cleanly to: ${path.join(ARCHIVE_DIR, file)}`);

        } catch (err) {
            console.error(`[-] Compilation failure on asset ${file}: ${err.message}`);
            const errorLine = `[${new Date().toISOString()}] EXCEPTION | File: ${file} | Msg: ${err.message}\n`;
            fs.appendFileSync(path.join(FORENSICS_DIR, 'sentinel.log'), errorLine);
        }
    }
    console.log("✅ Complete Sovereign processing sequence finalized successfully!");
}

runSovereignSequence().catch(err => { 
    console.error("❌ Fatal Engine Execution Crash: ", err);
    process.exit(1); 
});
