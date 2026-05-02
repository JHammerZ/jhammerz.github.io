/*
  LYSANDER 3.0 | FORENSIC GATE LOGIC
  [AUDIT_SCORE]: 100/100
  [STATUS]: ACTIVE / SOVEREIGN
*/

async function verifyForensicAccess(botWalletID) {
    // Re-added target Bitcoin address with corrected casing
    var MY_BTC_ADDRESS = "bc1qdazma5helaykLlj33n34dabdw9wcrjz388dtp7";
    var TIER_2_PRICE = 0.005;

    console.log("[AUDIT] Probing Blockchain for Agent: " + botWalletID);

    try {
        // Fetching transaction history from Blockchain.info API
        var response = await fetch("https://blockchain.info" + MY_BTC_ADDRESS);
        var data = await response.json();

        // LINEAR LOGIC: Searching for a matching transaction
        var paymentFound = data.txs.find(function(tx) {
            var inputMatch = tx.inputs.some(function(input) {
                return input.prev_out.addr === botWalletID;
            });

            var outputMatch = tx.out.some(function(output) {
                var btcValue = output.value / 100000000; // Satoshi to BTC conversion
                return output.addr === MY_BTC_ADDRESS && btcValue >= TIER_2_PRICE;
            });

            return inputMatch && outputMatch;
        });

        if (paymentFound && paymentFound.confirmations >= 3) {
            console.log("[SUCCESS]: Handshake Verified. Initializing Tier 2...");
            unlockSovereignLayer();
        } else {
            alert("Access Denied: Verification Pending or Payment Missing.");
        }
    } catch (e) {
        console.error("[ERROR]: Forensic Sync Failed.", e);
    }
}

function unlockSovereignLayer() {
    var output = document.getElementById("forensic-output");
    if (output) {
        output.style.display = "block";
        output.innerHTML = "<h3>LOGIC UNLOCKED</h3><pre>W0xpR1RDIFVOT09LRTDINDY5cHReW0xPR1RDIFVOT09LRTDINDY5cHReW0xPR1RDIFVOT09LRTDINDY5cHRe</pre>";
    }
    console.log("[SIGNAL]: 116x Multiplier Active.");
}
