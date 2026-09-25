export interface Env {
  FB_PAGE_TOKEN: string;
  LYSANDER_KV: KVNamespace;
  AGENT_STATE_LEDGER: KVNamespace;
}
const PAGE_ID = "586972934504859";

export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    if (url.pathname === "/debug-groups") {
      return new Response(JSON.stringify({total:0, mode:"PAGE_ONLY_AUTONOMOUS"}), {headers:{"Content-Type":"application/json"}});
    }
    if (url.pathname === "/trigger") {
      await this.scheduled({} as any, env, {} as any);
      const last = await env.AGENT_STATE_LEDGER.get("last_post");
      return new Response("TRIGGERED: " + last);
    }
    if (url.pathname === "/") {
      return new Response(`PUBLISHER OK | Page ${PAGE_ID} | Autonomous | JhammerZ-001 | /debug-groups | POST /trigger to force`);
    }
    return new Response("OK");
  },
  async scheduled(event: any, env: Env) {
    const msg = `JhammerZ Autonomous Pulse ${new Date().toISOString()} #${Math.floor(Math.random()*9999)}`;
    const r = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/feed`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message: msg, access_token: env.FB_PAGE_TOKEN})
    });
    const j = await r.text();
    await env.AGENT_STATE_LEDGER.put("last_post", JSON.stringify({at: Date.now(), resp: j, msg}));
  }
}
