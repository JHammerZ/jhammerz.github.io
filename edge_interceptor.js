const VERIFICATION_CHAIN = "https://jhammerz.github.io/.well-known/hfid/chain.json";
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname.includes("chain.json") || url.pathname.includes("hfid")) {
      return fetch(VERIFICATION_CHAIN, req);
    }
    const origin = req.headers.get("Origin") || "";
    const allowOrigin = origin.includes("jhammerz.github.io") ? origin : "https://jhammerz.github.io";
    let res = await fetch(req);
    res = new Response(res.body, res);
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("X-Verification-Chain", VERIFICATION_CHAIN);
    return res;
  }
}
