export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ 
        ok: true, 
        sovereign: env.SOVEREIGN_HID || "JhammerZ-001",
        hfid_chain: env.HFID_CHAIN_URL,
        kv: !!env.AGENT_STATE_LEDGER
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (url.pathname === "/live-social") {
      try {
        const token = env.FB_PAGE_TOKEN;
        if (!token) {
          return new Response(JSON.stringify({ error: "No FB_PAGE_TOKEN set" }), { headers: corsHeaders, status: 500 });
        }

        // 1. MAIN CREATOR USER - ONLY id,name - NO followers_count
        const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`);
        const main_account = await meRes.json();

        // 2. PAGES + IG - fan_count IS valid here
        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,fan_count,access_token,instagram_business_account{id,username}&access_token=${token}`);
        const pages_and_ig = await pagesRes.json();

        return new Response(JSON.stringify({
          sovereign: env.SOVEREIGN_HID || "JhammerZ-001",
          token_type: "USER_TOKEN - MAIN CREATOR",
          main_account: main_account,
          pages_and_ig: pages_and_ig,
          live_at: new Date().toISOString()
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { headers: corsHeaders, status: 500 });
      }
    }

    return new Response("JhammerZ Router Live - " + url.pathname, { headers: corsHeaders });
  }
}
