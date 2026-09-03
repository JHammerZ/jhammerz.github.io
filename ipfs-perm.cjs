const fs = require("fs");
async function main(){
  // Use web3.storage free API (Storacha) - no payment
  const data = fs.readFileSync(".well-known/hfid-attestation.json");
  console.log("Uploading to IPFS/Filecoin free...");

  // w3s.link free uploader
  const res = await fetch("https://api.storacha.network/upload", {
    method: "POST",
    body: data
  }).catch(async () => {
    // fallback to filebase free
    return await fetch("https://store.filswan.com/api/v2/ipfs/upload", {
      method: "POST",
      body: data
    });
  });
  
  const txt = await res.text();
  console.log("Result:", txt.slice(0,2000));
}
main();
