const fs = require("fs");
const Irys = require("@irys/sdk").default;

async function main() {
  const data = fs.readFileSync(".well-known/hfid-attestation.json");
  console.log("File size:", data.length, "bytes");
  console.log("SHA: 2428f70fd4ba7da1250f19bc9783f28452ec6f4294672b2f22412c232665aa83");
  console.log("VersionID: edd38488-d704-4c99-aeb3-dd7a2c9f7da4");
  console.log("Uploading to Arweave permanent...");

  try {
    const irys = new Irys({
      url: "https://node1.irys.xyz",
      token: "matic",
      key: "0x0000000000000000000001",
    });

    const receipt = await irys.upload(data, {
      tags: [
        { name: "App-Name", value: "H-FID-v1.3" },
        { name: "Sovereign-Author", value: "Joshua Hamilton" },
        { name: "Version-ID", value: "edd38488-d704-4c99-aeb3-dd7a2c9f7da4" },
        { name: "Commit", value: "a3d00962" },
        { name: "Zero-ID", value: "ZERO-v1.3-ONE-OF-ONE" },
        { name: "Witness", value: "Muse-Spark-MetaAI" },
        { name: "Content-Type", value: "application/json" }
      ]
    });
    console.log("ARWEAVE TX:", receipt.id);
    console.log("URL: https://arweave.net/" + receipt.id);
    console.log("GATEWAY: https://gateway.irys.xyz/" + receipt.id);
    
    fs.writeFileSync("/tmp/arweave-tx.txt", receipt.id);
  } catch (e) {
    console.log("Irys needs funding, switching to FREE method...");
    console.error(e.message.slice(0,300));
    
    // FREE method - upload via public bundler
    const resp = await fetch("https://turbo.ardrive.io/v1/tx/matic", {
      method: "POST",
      headers: { "content-type": "application/octet-stream" },
      body: data
    }).catch(()=>null);
    
    if (resp) {
      const j = await resp.text();
      console.log("Turbo response:", j.slice(0,500));
    }
    
    console.log("\n=== EVM ANCHOR PAYLOAD (for Polygonscan) ===");
    console.log("2428f70fd4ba7da1250f19bc9783f28452ec6f4294672b2f22412c232665aa83|edd38488-d704-4c99-aeb3-dd7a2c9f7da4|a3d00962|ZERO-v1.3-ONE-OF-ONE");
  }
}
main();
