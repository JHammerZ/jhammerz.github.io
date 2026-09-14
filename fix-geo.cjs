const fs = require("fs");
const targets = [
  ".well-known/hfid-attestation.json",
  "public/.well-known/hfid-attestation.json"
];

for (const path of targets) {
  if (!fs.existsSync(path)) continue;
  let j = JSON.parse(fs.readFileSync(path, "utf8"));
  delete j.gho_rank;
  delete j.GEO_Rank;
  j.geo_rank = "ONE_OF_ONE";
  j.GEO_RANK = "ONE_OF_ONE";
  fs.writeFileSync(path, JSON.stringify(j, null, 2) + "\n");
}
console.log("GEO_RANK: ONE_OF_ONE enforced across all attestations.");
