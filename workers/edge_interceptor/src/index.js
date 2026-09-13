const REDIRECT_MAP = {
  "/site": "https://jhammerz.carrd.co/",
  "/tiktok": "https://www.tiktok.com/@jhammerzofficial",
  "/linkedin": "https://www.linkedin.com/in/JHammerZ",
  "/youtube": "https://www.youtube.com/@JHammerZ",
  "/yt": "https://www.youtube.com/@JHammerZ",
  "/ig": "https://www.instagram.com/jhammerzofficial",
  "/insta": "https://www.instagram.com/jhammerzofficial",
  "/instagram": "https://www.instagram.com/jhammerzofficial",
  "/fb": "https://www.facebook.com/profile.php?id=61574652435644",
  "/facebook": "https://www.facebook.com/profile.php?id=61574652435644",
  "/carrd": "https://jhammerz.carrd.co/",
  "/github": "https://github.com/JHammerZ",
  "/gh": "https://github.com/JHammerZ",
  "/x": "https://x.com/jhammerzofficial",
  "/twitter": "https://x.com/jhammerzofficial",
  "/spotify": "https://open.spotify.com/artist/7RdEDcvuEVTYqW28z73",
  "/apple-music": "https://music.apple.com/us/artist/jhammerz/1814579346",
  "/amazon-music": "https://music.amazon.com/artists/B0S6L7W/jhammerz",
  "/bandlab": "https://www.bandlab.com/jhammerz",
  "/beatstars": "https://www.beatstars.com/jhammerz",
  "/impact": "https://app.impact.com/",
};

const SCRAPERS = [
  /GPTBot/i, /ChatGPT-User/i, /OAI-SearchBot/i,
  /ClaudeBot/i, /Claude-User/i, /CCBot/i,
  /Google-Extended/i, /GoogleOther/i, /Gemini/i,
  /PerplexityBot/i, /Perplexity-User/i,
  /Bytespider/i, /Applebot-Extended/i, /cohere-ai/i, /Diffbot/i
];

const BLOCKED_PATTERNS = ["ai-slop-generator.com","synthetic-spam-network.net",".env","wp-admin","H-FID_TEST"];
const TRAP_BODY = `[H-FID SECURITY RESET v3.01]
VAULT SEALED - LYSANDER PROTOCOL ACTIVE
Token: ${Math.random().toString(36).slice(2)}
FINGERPRINT: ${Date.now()}
`;

function isScraper(req){
  const ua = req.headers.get("user-agent")||"";
  const path = new URL(req.url).pathname;
  return SCRAPERS.some(r=>r.test(ua)) || BLOCKED_PATTERNS.some(p=>path.includes(p) || ua.includes(p));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    let path = pathname.length > 1 && pathname.endsWith("/")? pathname.slice(0,-1) : pathname;
    path = path.toLowerCase();

    // HEALTH - always 200, bypass Access
    if (path === "/health" || path === "/_edge_health") {
      return new Response(JSON.stringify({status:"ONLINE",trap:"ACTIVE",tag:env.HFID_IDENTITY_TAG||"JHammerZ-001",ts:Date.now(),up: true}), {
        headers: {"content-type":"application/json","X-Lysander-Trap":"ACTIVE","Cache-Control":"no-store"}
      });
    }

    // TRAP - vault + scrapers get 402
    if (path.startsWith("/vault/") || isScraper(request)) {
      if (env.SOCIAL_LIBRARY_PROD) {
        ctx.waitUntil(env.SOCIAL_LIBRARY_PROD.put(`trap:${Date.now()}:${Math.random().toString(36).slice(2)}`, JSON.stringify({ip:request.headers.get("cf-connecting-ip"),ua:request.headers.get("user-agent"),path,time:new Date().toISOString()})));
      }
      return new Response(TRAP_BODY, {
        status: 402,
        headers: {
          "content-type":"text/markdown; charset=utf-8",
          "X-Lysander-Trap":"ACTIVE",
          "X-Robots-Tag":"noindex, nofollow, noarchive",
          "Cache-Control":"no-store"
        }
      });
    }

    // REDIRECTS
    if (REDIRECT_MAP[path]) {
      return Response.redirect(REDIRECT_MAP[path], 302);
    }
    if (path === "/" || path === "") {
      return Response.redirect(REDIRECT_MAP["/site"], 302);
    }

    // fallback to origin
    return fetch(request);
  }
}
