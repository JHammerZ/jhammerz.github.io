const fs = require('fs');
const path = require('path');

const QUEUE_DIR = path.join(__dirname, '../content/queue');
const ARCHIVE_DIR = path.join(__dirname, '../content/archive');
const FORENSICS_DIR = path.join(__dirname, '../forensics');

async function runSovereignSequence() {
    console.log("⚡ Activating Lysander 3.0 FYP Saturation Optimizer...");
    
    if (!fs.existsSync(QUEUE_DIR)) fs.mkdirSync(QUEUE_DIR, { recursive: true });
    if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    if (!fs.existsSync(FORENSICS_DIR)) fs.mkdirSync(FORENSICS_DIR, { recursive: true });

    const files = fs.readdirSync(QUEUE_DIR).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
        console.log("[⚡] Queue empty. Monitoring matrix active and idling.");
        return;
    }

    for (const file of files) {
        const filePath = path.join(QUEUE_DIR, file);
        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);

            const topic = data.topic || "Sovereign Protocol";
            const rawBody = data.text || "";

            // FYP Algorithmic Hook & Script Structuring Logic
            const optimizedScript = `
🎬 [0-3s VISUAL HOOK]: *Bold on-screen text change* -> "This is why your tracking loops are lagging..."
🧠 [3-30s CORE VALUE DELIVERY]: ${rawBody}
🔄 [LOOP TRAILING REWATCH ANCHOR]: "...and that's exactly why you need to..."
            `.trim();

            // SEO/AEO-Optimized Meta Caption Block
            const fypCaption = `
🚀 ${topic} | System Architecture Update. 

Anomalies mitigated. Multi-repository parameters mapped cleanly down to edge loops. 

#${topic.replace(/\s+/g, '')} #JHammerZ #LysanderProtocol #Coding #DevOps #TechTrends2026 #DataAutomation #SovereignSync
🌐 Track live footprint: https://github.io
            `.trim();

            const packageId = `FYP-${Date.now()}`;
            const productionAsset = {
                id: packageId,
                status: "READY_FOR_BROADCAST",
                script_framework: optimizedScript,
                caption_metadata: fypCaption,
                distribution_nodes: 16
            };

            console.log(`\n=================== [🚀 GENERATED PACKET: ${packageId}] ===================`);
            console.log(JSON.stringify(productionAsset, null, 2));
            console.log("========================================================================\n");

            // Append to forensics trail
            fs.appendFileSync(
                path.join(FORENSICS_DIR, 'sentinel.log'), 
                `[${new Date().toISOString()}] SUCCESS | ${packageId} | Optimized for FYP Saturation.\n`
            );

            fs.renameSync(filePath, path.join(ARCHIVE_DIR, file));
        } catch (err) {
            console.error(`[-] Compilation failure on asset ${file}: ${err.message}`);
        }
    }
}

runSovereignSequence().catch(err => { process.exit(1); });
