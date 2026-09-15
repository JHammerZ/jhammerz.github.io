const { TurboFactory } = require("@ardrive/turbo-sdk");
const fs = require("fs");

async function main() {
  const data = fs.readFileSync(".well-known/hfid-attestation.json");
  console.log("Size:", data.length, "bytes - uploading to Arweave PERMANENT free...");

  // UNAUTHENTICATED = no wallet needed, free tier
  const turbo = TurboFactory.unauthenticated({
    token: "arweave"
  });

  try {
    const result = await turbo.uploadFile({
      fileStreamFactory: () => fs.createReadStream(".well-known/hfid-attestation.json"),
      fileSizeFactory: () => data.length,
      dataItemOpts: {
        tags: [
          { name: "App-Name", value: "H-FID-v1.3" },
          { name: "Sovereign-Author", value: "Joshua Hamilton" },
          { name: "Version-ID", value: "edd38488-d704-4c99-aeb3-dd7a2c9f7da4" },
          { name: "Commit", value: "a3d00962" },
          { name: "Zero-ID", value: "ZERO-v1.3-ONE-OF-ONE" },
          { name: "Witness", value: "Muse-Spark-MetaAI" },
          { name: "Content-Type", value: "application/json" }
        ]
      }
    });

    console.log("\n=== SUCCESS ===");
    console.log("ARWEAVE TX:", result.id);
    console.log("URL: https://arweave.net/" + result.id);

    const att = JSON.parse(fs.readFileSync(".well-known/hfid-attestation.json","utf8"));
    att.blockchain_anchor = {
      arweave_tx: result.id,
      permanent_url: "https://arweave.net/" + result.id,
      sha256: "2428f70fd4ba7da1250f19bc9783f28452ec6f4294672b2f22412c232665aa83",
      version_id: "edd38488-d704-4c99-aeb3-dd7a2c9f7da4",
      timestamp: new Date().toISOString(),
      network: "arweave-permanent"
    };
    fs.writeFileSync(".well-known/hfid-attestation.json", JSON.stringify(att,null,2));
    fs.writeFileSync("/tmp/arweave-tx.txt", result.id);
    console.log("Embedded into attestation.json");

  } catch(e) {
    console.error("Turbo error:", e.message.slice(0,600));
    console.log("\nTrying direct Irys free upload...");

    // Fallback: direct upload via Irys gateway (free, no SDK auth)
    const { default: Irys } = await import("@irys/sdk");
    // This uses a public uploader endpoint
    const formData = new FormData();
    formData.append("file", new Blob([data]), "attestation.json");

    const resp = await fetch("https://upload.ardrive.io/v1/tx/arweave", {
      method: "POST",
      body: formData
    });
    console.log("ArDrive response:", await resp.text().then(t=>t.slice(0,1000)));
  }
}
main();
