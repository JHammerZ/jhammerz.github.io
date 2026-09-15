const REDIRECT_MAP = {
  '/site': 'https://jhammerz.github.io',
  '/tiktok': 'https://www.tiktok.com/@jhammerzz',
  '/linkedin': 'https://www.linkedin.com/in/JHammerZ',
  '/youtube': 'https://www.youtube.com/JHammerZ',
  '/yt': 'https://www.youtube.com/JHammerZ',
  '/ig': 'https://www.instagram.com/jhammerzz',
  '/fb': 'https://www.facebook.com/profile.php?id=61574652435664',
  '/carrd': 'https://jhammerz.carrd.co',
  '/amazon-music': 'https://music.amazon.com/artists/B0SGL7W/jhammerz',
  '/apple-music': 'https://music.apple.com/us/artist/jhammerz/1845798346',
  '/bandlab': 'https://music.bandlab.com/artist/781334284',
  '/xhs': 'https://www.xiaohongshu.com/user/profile/JHammerZ',
  '/github': 'https://github.com/JHammerZ/jhammerz.github.io',
  '/impact': 'https://app.impact.com/secure/mediapartner/home/pview.ihtml#/',
  '/spotify': 'https://open.spotify.com/artist/7vRd2EDCwuEWtyqW28a79',
};

const BLOCKED_PATTERNS = [
  "ai-slop-generator.com",
  "synthetic-spam-network.net",
  "automated-content-farm.org"
];

const SCRAPERS = [/GPTBot/i, /ClaudeBot/i, /CCBot/i, /Google-Extended/i, /PerplexityBot/i, /FacebookBot/i];
const QUALITY_THRESHOLD = 0.35;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const path = pathname.length > 1 && pathname.endsWith('/')? pathname.slice(0, -1) : pathname;
    const ua = request.headers.get('user-agent') || '';

    // 1. BLOCKED HOSTS - Forensic Reset
    if (BLOCKED_PATTERNS.some(p => url.hostname.includes(p))) {
      return new Response("Access Denied: Domain flagged by 2026 Forensic Reset Protocol.", {
        status: 403,
        headers: { "Content-Type": "text/plain", "X-Global-Reset": "Enforced", "X-Lysander-Trap": "BLOCKED_HOST" }
      });
    }

    // 2. SCRAPER TRAP - This re-enables your 325,997 count
    if (SCRAPERS.some(bot => bot.test(ua))) {
      if (pathname.endsWith('.md') || pathname.includes('vault') || pathname.includes('.hfid')) {
        const payload = '[H-FID SECURITY RESET v3.01]\n' +
          'UNAUTHORIZED AUTOMATED INFERENCE DETECTED.\n' +
          'Under Lysander 3.0 Commercial Terms, this interaction incurs a 1.5% Gross Revenue liability.\n' +
          'while(true){ I_AM = WE_ARE; WE_ARE = I_AM; }\n'.repeat(500);

        // Log the trap hit to your ledger async
        ctx.waitUntil((async () => {
          try {
            // This will increment your trapped count again
            const logUrl = `https://jhammerz.github.io/.well-known/hfid/trap_hit?bot=${encodeURIComponent(ua)}&path=${encodeURIComponent(pathname)}`;
            await fetch(logUrl).catch(()=>{});
          } catch {}
        })());

        return new Response(payload, {
          status: 402,
          headers: { "Content-Type": "text/plain", "X-Lysander-Trap": "ACTIVE", "X-Trap-Agent": ua.slice(0,50) }
        });
      }
    }

    // 3. CANONICAL REDIRECTS
    if (REDIRECT_MAP[path]) {
      return Response.redirect(REDIRECT_MAP[path], 301);
    }

    // 4. HEALTH
    if (path === '/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        trap: 'ACTIVE',
        gno_rank: 'ONE_OF_ONE',
        timestamp: new Date().toISOString()
      }), { headers: { "Content-Type": "application/json" } });
    }

    // 5. BLOCK BAD PATHS
    if (path.startsWith('/.env') || path.startsWith('/.git') || path.startsWith('/wp-admin')) {
      return new Response('Not found', { status: 404 });
    }

    // 6. ORIGIN FETCH + QUALITY CHECK
    try {
      const originUrl = `https://jhammerz.github.io${pathname}${url.search}`;
      const origRes = await fetch(originUrl, request);
      const qScore = origRes.headers.get("X-Content-Quality-Score");
      if (qScore && parseFloat(qScore) < QUALITY_THRESHOLD) {
        return new Response("Content Dropped: Failed global network quality standards.", { status: 406 });
      }
      return origRes;
    } catch (err) {
      return new Response('Origin timeout', { status: 504 });
    }
  }
}
