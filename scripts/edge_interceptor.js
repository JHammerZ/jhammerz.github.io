/**
 * GLOBAL EDGE INTERCEPTOR: FORENSIC RESET PROTOCOL (2026) + CDM
 * Deployed via GitHub Actions Automation
 * Handles: Spam blocking, quality filtering, api/v1 routing, live audits, broadcast, CDM
 */

const BLOCKED_PATTERNS = [
  "ai-slop-generator.com",
  "synthetic-spam-network.net",
  "automated-content-farm.org"
];

const QUALITY_THRESHOLD = 0.35;
const SECRETS_PATTERN = /AIza[0-9A-Za-z\-_]{35}/;

// CDM CONFIG - GitHub origin for static assets
const ORIGIN_BASE = 'https://raw.githubusercontent.com/JHammerZ/jhammerz.github.io/main';
const CDM_CACHE_TTL = 86400; // 24h

async function runSentinelAudit(request) {
  const url = new URL(request.url);
  let violations = 0;
  let scanned = [];
  
  const publicFiles = [
    '/index.html', '/manifest.html', '/logic/proxy_opt.js',
    '/api/v1/manifest.json', '/api/v1/knowledge_graph.json',
    '/api/v1/agent_memory.js', '/api/v1/entity_schema.json',
    '/broadcast/omega.md', '/broadcast/manifest.html'
  ];
  
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
  
  const result = {
    timestamp: Date.now(),
    violations: violations,
    status: violations === 0 ? "PERIMETER_SECURE" : "LEAKS_DETECTED",
    message: violations === 0 ? "✅ PERIMETER SECURE: No vulnerabilities detected." : `⚠️ AUDIT RATIFIED: ${violations} potential leaks flagged for review.`,
    scanned_files: scanned,
    protocol: "2026 Forensic Reset"
  };
  
  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Lysander-Node": "sentinel_audit",
      "X-Audit-Status": result.status
    }
  });
}

// CDM Handler - Fetch from GitHub + Cache at Edge
async function handleCDM(request, path) {
  try {
    const isHead = request.method === 'HEAD';
    const isGet = request.method === 'GET';
    
    if (!isGet && !isHead) {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    const cache = caches.default;
    const getRequest = isHead ? new Request(request.url, { method: 'GET' }) : request;
    const cacheKey = new Request(getRequest.url, getRequest);
    
    // Check cache first - only for GET
    if (isGet) {
      let response = await cache.match(cacheKey);
      if (response) {
        response = new Response(response.body, response);
        response.headers.set('X-Lysander-Node', 'cdm_cache_hit');
        return response;
      }
    }
    
    // Fetch from GitHub origin - always as GET
    const originUrl = ORIGIN_BASE + path;
    const originResponse = await fetch(originUrl, {
      method: 'GET',
      cf: { cacheTtl: CDM_CACHE_TTL, cacheEverything: true }
    });
    
    if (!originResponse.ok) {
      return new Response(`Origin fetch failed: ${originResponse.status}`, {
        status: originResponse.status,
        headers: { 
          "X-Lysander-Node": "cdm_miss",
          "X-Origin-Status": originResponse.status.toString(),
          "X-Origin-URL": originUrl
        }
      });
    }
    
    // For HEAD, return headers only
    if (isHead) {
      return new Response(null, {
        status: originResponse.status,
        headers: {
          'X-Lysander-Node': 'cdm_edge',
          'Content-Type': originResponse.headers.get('Content-Type'),
          'Content-Length': originResponse.headers.get('Content-Length'),
          'Cache-Control': `public, max-age=${CDM_CACHE_TTL}`,
          'Access-Control-Allow-Origin': '*',
          'X-Content-Protocol': '2026 Forensic Reset'
        }
      });
    }
    
    // For GET, build full response
    let response = new Response(originResponse.body, originResponse);
    response.headers.set('X-Lysander-Node', 'cdm_edge');
    response.headers.set('Cache-Control', `public, max-age=${CDM_CACHE_TTL}`);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('X-Content-Protocol', '2026 Forensic Reset');
    
    // Store in cache
    await cache.put(cacheKey, response.clone());
    return response;
    
  } catch (err) {
    return new Response(`CDM Error: ${err.message}`, {
      status: 502,
      headers: { 
        "X-Lysander-Node": "cdm_error",
        "X-Error-Detail": err.message
      }
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (BLOCKED_PATTERNS.some(pattern => url.hostname.includes(pattern))) {
      return new Response("Access Denied: Domain flagged by 2026 Forensic Reset Protocol.", {
        status: 403,
        headers: { "Content-Type": "text/plain", "X-Global-Reset": "Enforced" }
      });
    }
    
    if (url.pathname === '/api/v1/audit') {
      return await runSentinelAudit(request);
    }
    
    if (url.pathname === '/api/v1/distribution') {
      return new Response(JSON.stringify({
        status: "active", node: "echo_broadcast",
        endpoints: ["omega.md", "manifest.html"],
        broadcast_path: "/broadcast/"
      }), { headers: { "Content-Type": "application/json" } });
    }
    
    if (url.pathname === '/api/v1/orbital-mesh') {
      return new Response(JSON.stringify({
        status: "active", node: "quantum_ghost", mesh: "sovereign_crawl"
      }), { headers: { "Content-Type": "application/json" } });
    }
    
    // CDM: Route static assets from GitHub origin
    if (url.pathname.match(/\.(md|html|json|txt|png|jpg|jpeg|svg|ico|xml|js|css)$/)) {
      return await handleCDM(request, url.pathname);
    }
    
    if (url.pathname.startsWith('/api/v1/') && url.pathname.endsWith('.json')) {
      return fetch(new Request(url.origin + url.pathname, request));
    }
    
    // Broadcast directory passthrough
    if (url.pathname.startsWith('/broadcast/')) {
      const assetRequest = new Request(url.origin + url.pathname, request);
      const response = await fetch(assetRequest);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('X-Lysander-Node', 'echo_broadcast');
      newResponse.headers.set('X-Content-Protocol', '2026 Forensic Reset');
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      return newResponse;
    }
    
    if (url.pathname.startsWith('/api/v1/')) {
      return new Response("API endpoint not found", { status: 404 });
    }
    
    try {
      const originalResponse = await fetch(request);
      const contentQuality = originalResponse.headers.get("X-Content-Quality-Score");
      if (contentQuality && parseFloat(contentQuality) < QUALITY_THRESHOLD) {
        return new Response("Content Dropped: Failed global network quality standards.", {
          status: 406, headers: { "Content-Type": "text/plain" }
        });
      }
      return originalResponse;
    } catch (error) {
      return new Response("Global Edge Routing Error", { status: 500 });
    }
  }
};
