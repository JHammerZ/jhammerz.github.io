export interface Env {
  AGENT_STATE_LEDGER: KVNamespace;
  SEC_MAN_EDGE: KVNamespace;
  LYSANDER_KV: KVNamespace;
  FB_PAGE_TOKEN: string;
  SOVEREIGN_HID: string;
  PROTOCOL: string;
}

const VERIFICATION_CHAIN = "https://jhammerz.github.io/.well-known/hfid/chain.json";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", chain: VERIFICATION_CHAIN, name: "lysander-v13" });
    }

    if (url.pathname === "/live-social") {
      if (!env.FB_PAGE_TOKEN) return Response.json({ error: "No FB_PAGE_TOKEN secret set" }, { status: 500 });
      const fb = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=name,access_token,instagram_business_account&access_token=${env.FB_PAGE_TOKEN}`).then(r=>r.json());
      return Response.json({ sovereign: env.SOVEREIGN_HID, live: fb });
    }

    if (url.pathname === "/scoop") {
      const chain = await fetch(VERIFICATION_CHAIN).then(r=>r.json());
      const next = await env.LYSANDER_KV.get("next_evergreen", "json");
      return Response.json({ chain_root: chain.root_hash, next });
    }

    return fetch(request);
  }
}
