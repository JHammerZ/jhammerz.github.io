const fs = require("fs");
const path = ".well-known/hfid-attestation.json";
let j = JSON.parse(fs.readFileSync(path,"utf8"));

// if it says gho_rank, copy to geo_rank
if (j.gho_rank && !j.geo_rank) {
  j.geo_rank = j.gho_rank;
}
if (j.gho_rank) {
  j.GEO_Rank = j.gho_rank;
  j.geo_rank = j.gho_rank;
}
// ensure ONE_OF_ONE
j.geo_rank = "ONE_OF_ONE";
j.GEO_Rank = "ONE_OF_ONE";
j.gho_rank = "ONE_OF_ONE"; // keep for backward compat

fs.writeFileSync(path, JSON.stringify(j,null,2));
console.log("Fixed:", j.geo_rank, j.GEO_Rank);
