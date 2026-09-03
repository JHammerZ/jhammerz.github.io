const fs = require("fs");
const att = JSON.parse(fs.readFileSync(".well-known/hfid-attestation.json","utf8"));
att.blockchain_anchor = {
  bitcoin_opentimestamp: true,
  calendars: [
    "https://a.pool.opentimestamps.org",
    "https://b.pool.opentimestamps.org",
    "https://a.pool.eternitywall.com",
    "https://ots.btc.catallaxy.com"
  ],
  sha256: "cf2433cd7ccd34dc96acaa7370b65af5e530ecaaf6482cef0a76aeaef4133c7c",
  ots_file: ".well-known/hfid-attestation.json.ots",
  version_id: "edd38488-d704-4c99-aeb3-dd7a2c9f7da4",
  commit: "a3d00962",
  timestamp: new Date().toISOString(),
  network: "bitcoin-mainnet-via-ots",
  permanent_verify: "https://opentimestamps.org"
};
fs.writeFileSync(".well-known/hfid-attestation.json", JSON.stringify(att,null,2));
console.log("Embedded BTC anchor");
console.log(JSON.stringify(att.blockchain_anchor,null,2));
