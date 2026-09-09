export interface Env {
  HFID_CHAIN_URL?: string;
}

const VERIFICATION_CHAIN = "https://jhammerz.github.io/.well-known/hfid/chain.json";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const allowOrigin = origin.includes("jhammerz.github.io") ? origin : "https://jhammerz.github.io";
    
    // CORS + verification chain - preserve original intent
    const url = new URL(request.url);
    
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", chain: VERIFICATION_CHAIN, name: "lysander-v13" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (url.pathname === "/.well-known/hfid/chain.json" || url.pathname === "/chain.json") {
      const chain = await fetch(VERIFICATION_CHAIN).then(r => r.text());
      return new Response(chain, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Cache-Control": "public, max-age=60"
        }
      });
    }

    return new Response("Lysander-v13 Sovereign - H-FID Chain: " + VERIFICATION_CHAIN, {
      headers: { "Access-Control-Allow-Origin": allowOrigin }
    });
  }
}
