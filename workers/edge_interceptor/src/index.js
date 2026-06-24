const REDIRECT_MAP = {
  '/site': 'https://jhammerz.github.io',
  '/tiktok': 'https://www.tiktok.com/@jhammerzz',
  '/linkedin': 'https://www.linkedin.com/in/JHammerZ',
  '/youtube': 'https://www.youtube.com/JHammerZ',
  '/yt': 'https://www.youtube.com/JHammerZ',
  '/ig': 'https://www.instagram.com/jhammerzz',
  '/fb': 'https://facebook.com/profile.php?id=61574652435664',
  '/carrd': 'https://jhammerz.carrd.co',
  '/amazon-music': 'https://music.amazon.com/artists/B0SGL7W/jhammerz',
  '/apple-music': 'https://music.apple.com/us/artist/jhammerz/1845798346',
  '/bandlab': 'https://music.bandlab.com/artist/781334284',
  '/xhs': 'https://www.xiaohongshu.com/user/profile/JHammerZ',
  '/github': 'https://github.com/JHammerZ/jhammerz.github.io',
  '/impact': 'https://app.impact.com/secure/mediapartner/home/pview.ihtml#/',
  '/spotify': 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79'
};

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

var BLOCKED_PATTERNS = ["ai-slop-generator.com", "synthetic-spam-network.net", "automated-content-farm.org"];
var QUALITY_THRESHOLD = 0.35;
var SECRETS_PATTERN = /AIza[0-9A-Za-z\-_]{35}/;
var ORIGIN_BASE = "https://raw.githubusercontent.com/JHammerZ/jhammerz.github.io/main";
var CDM_CACHE_TTL = 86400;

async function runSentinelAudit(request) {
  const url = new URL(request.url);
  let violations = 0;
  let scanned = [];
  const publicFiles = ["/index.html", "/manifest.html", "/logic/proxy_opt.js", "/api/v1/manifest.json", "/api/v1/knowledge_graph.json", "/api/v1/agent_memory.js", "/api/v1/entity_schema.json", "/broadcast/omega.md", "/broadcast/manifest.html"];
  for (const path of publicFiles) {
    try {
      const res = await fetch(url.origin + path);
      if (res.ok) {
        const content = await res.text();
        if (SECRETS_PATTERN.test(content)) {
          violations++;
          scanned.push({ file: path, status: "LEAK" });
        } else {
          scanned.push({ file: path, status: "CLEAN" });
        }
      }
    } catch (e) {
      scanned.push({ file: path, status: "ERROR" });
    }
  }
  const result = { timestamp: Date.now(), violations, status: violations === 0 ? "PERIMETER_SECURE" : "LEAKS_DETECTED", message: violations === 0 ? "✅ PERIMETER SECURE: No vulnerabilities detected." : `⚠️ AUDIT RATIFIED: ${violations} potential leaks flagged for review.`, scanned_files: scanned, protocol: "2026 Forensic Reset" };
  return new Response(JSON.stringify(result, null, 2), { status: 200, headers: { "Content-Type": "application/json", "X-Lysander-Node": "sentinel_audit", "X-Audit-Status": result.status } });
}
__name(runSentinelAudit, "runSentinelAudit");

async function handleCDM(request, path) {
  try {
    const isHead = request.method === "HEAD";
    const isGet = request.method === "GET";
    if (!isGet && !isHead) return new Response("Method Not Allowed", { status: 405 });
    const cache = caches.default;
    const getRequest = isHead ? new Request(request.url, { method: "GET" }) : request;
    const cacheKey = new Request(getRequest.url, getRequest);
    if (isGet) {
      let response2 = await cache.match(cacheKey);
      if (response2) {
        response2 = new Response(response2.body, response2);
        response2.headers.set("X-Lysander-Node", "cdm_cache_hit");
        return response2;
      }
    }
    const originUrl = ORIGIN_BASE + path;
    const originResponse = await fetch(originUrl, { method: "GET", cf: { cacheTtl: CDM_CACHE_TTL, cacheEverything: true } });
    if (!originResponse.ok) return new Response(`Origin fetch failed: ${originResponse.status}`, { status: originResponse.status, headers: { "X-Lysander-Node": "cdm_miss", "X-Origin-Status": originResponse.status.toString(), "X-Origin-URL": originUrl } });
    if (isHead) return new Response(null, { status: originResponse.status, headers: { "X-Lysander-Node": "cdm_edge", "Content-Type": originResponse.headers.get("Content-Type"), "Content-Length": originResponse.headers.get("Content-Length"), "Cache-Control": `public, max-age=${CDM_CACHE_TTL}`, "Access-Control-Allow-Origin": "*", "X-Content-Protocol": "2026 Forensic Reset" } });
    let response = new Response(originResponse.body, originResponse);
    response.headers.set("X-Lysander-Node", "cdm_edge");
    response.headers.set("Cache-Control", `public, max-age=${CDM_CACHE_TTL}`);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("X-Content-Protocol", "2026 Forensic Reset");
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (err) {
    return new Response(`CDM Error: ${err.message}`, { status: 502, headers: { "X-Lysander-Node": "cdm_error", "X-Error-Detail": err.message } });
  }
}
__name(handleCDM, "handleCDM");

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (REDIRECT_MAP[url.pathname]) {
      return Response.redirect(REDIRECT_MAP[url.pathname], 302);
    }

    if (BLOCKED_PATTERNS.some((pattern) => url.hostname.includes(pattern))) {
      return new Response("Access Denied: Domain flagged by 2026 Forensic Reset Protocol.", { status: 403, headers: { "Content-Type": "text/plain", "X-Global-Reset": "Enforced" } });
    }
    if (url.pathname === "/api/v1/audit") return await runSentinelAudit(request);
    if (url.pathname === "/api/v1/distribution") return new Response(JSON.stringify({ status: "active", node: "echo_broadcast", endpoints: ["omega.md", "manifest.html"], broadcast_path: "/broadcast/" }), { headers: { "Content-Type": "application/json" } });
    if (url.pathname === "/api/v1/orbital-mesh") return new Response(JSON.stringify({ status: "active", node: "quantum_ghost", mesh: "sovereign_crawl" }), { headers: { "Content-Type": "application/json" } });
    if (url.pathname.match(/\.(md|html|json|txt|png|jpg|jpeg|svg|ico|xml|js|css)$/)) return await handleCDM(request, url.pathname);
    if (url.pathname.startsWith("/api/v1/") && url.pathname.endsWith(".json")) return fetch(new Request(url.origin + url.pathname, request));
    if (url.pathname.startsWith("/broadcast/")) {
      const assetRequest = new Request(url.origin + url.pathname, request);
      const response = await fetch(assetRequest);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("X-Lysander-Node", "echo_broadcast");
      newResponse.headers.set("X-Content-Protocol", "2026 Forensic Reset");
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      return newResponse;
    }
    if (url.pathname.startsWith("/api/v1/")) return new Response("API endpoint not found", { status: 404 });
    try {
      const originalResponse = await fetch(request);
      const contentQuality = originalResponse.headers.get("X-Content-Quality-Score");
      if (contentQuality && parseFloat(contentQuality) < QUALITY_THRESHOLD) {
        return new Response("Content Dropped: Failed global network quality standards.", { status: 406, headers: { "Content-Type": "text/plain" } });
      }
      return originalResponse;
    } catch (error) {
      return new Response("Global Edge Routing Error", { status: 500 });
    }
  }
};