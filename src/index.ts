export interface Env {
  AGENT_STATE_LEDGER: KVNamespace;
  SEC_MAN_EDGE: KVNamespace;
  LYSANDER_KV: KVNamespace;
  FB_PAGE_TOKEN: string;
  SOVEREIGN_HID: string;
}

const VERIFICATION_CHAIN = "https://jhammerz.github.io/.well-known/hfid/chain.json";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", chain: VERIFICATION_CHAIN, name: "lysander-v13", sovereign: "Joshua Hamilton" });
    }

    if (url.pathname === "/live-social") {
      if (!env.FB_PAGE_TOKEN) return Response.json({ error: "no token set" });

      // MAIN CREATOR ACCOUNT - User token direct - ONLY id,name,picture - NO followers_count
      const me = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,picture&access_token=${env.FB_PAGE_TOKEN}`).then(r=>r.json());
      const accounts = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,fan_count,access_token,instagram_business_account{id,username}&access_token=${env.FB_PAGE_TOKEN}`).then(r=>r.json());

      return Response.json({
        sovereign: env.SOVEREIGN_HID,
        token_type: "USER_TOKEN - MAIN CREATOR",
        main_account: me,
        pages_and_ig: accounts,
        live_at: new Date().toISOString()
      }, { headers: { "Access-Control-Allow-Origin": "*" } });
    }

    return new Response(`Lysander-v13 LIVE - MAIN CREATOR MODE - ${VERIFICATION_CHAIN}`);
  }
}
