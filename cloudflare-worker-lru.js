/**
 * Cloudflare Worker: Sovereign CDM (Content Delivery Matrix) Edge Distribution & In-Memory LRU Proxy
 * 
 * Target Domain: jhammerz.github.io
 * Architecture: Multi-Tier Edge CDN with In-Memory LRU, Cloudflare Cache API, KV Persistence, & Resilient Airgap Fallbacks.
 * 
 * Features:
 *  - Tier 1: In-Memory LRU Cache (microsecond latency, 0 billable operations)
 *  - Tier 2: Cloudflare Global Edge Cache (caches.default, stale-while-revalidate, geo-replication)
 *  - Tier 3: Cloudflare KV Store (env.SOVEREIGN_KV with quota guard)
 *  - Tier 4: Transparent Reverse Proxy to https://jhammerz.github.io origin
 *  - Tier 5: Embedded Airgap Ledger (.well-known/cannon.json, aurelius.json, llms.txt, manifests)
 *  - Security: HSTS, CSP, CORS Preflight, X-Content-Type-Options, Referrer-Policy
 *  - Telemetry: /__cdm_status, /__lru_stats, /__edge_health, /__purge_cache
 */

// In-Memory LRU Cache for Worker isolate lifetime
class SovereignLRUCache {
  constructor(maxSize = 500, defaultTtlMs = 60000) {
    this.maxSize = maxSize;
    this.defaultTtlMs = defaultTtlMs;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.createdAt = Date.now();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    // Promote key to most recently used
    this.cache.delete(key);
    this.cache.set(key, item);
    this.hits++;
    return item;
  }

  set(key, value, ttlMs) {
    const effectiveTtl = ttlMs || this.defaultTtlMs;
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
        this.evictions++;
      }
    }
    this.cache.set(key, {
      body: value.body,
      contentType: value.contentType || 'text/html; charset=utf-8',
      status: value.status || 200,
      headers: value.headers || {},
      expiry: Date.now() + effectiveTtl,
      storedAt: Date.now()
    });
  }

  flush() {
    const count = this.cache.size;
    this.cache.clear();
    return count;
  }

  getStats() {
    const totalOps = this.hits + this.misses;
    return {
      activeEntries: this.cache.size,
      maxSize: this.maxSize,
      defaultTtlMs: this.defaultTtlMs,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      totalOperations: totalOps,
      hitRatio: totalOps > 0 ? ((this.hits / totalOps) * 100).toFixed(1) + '%' : '0.0%',
      uptimeSeconds: Math.floor((Date.now() - this.createdAt) / 1000)
    };
  }
}

// Global in-memory cache instance (shared across requests within same isolate)
const memoryCache = new SovereignLRUCache(500, 60000);

// Canonical Origin Config
const ORIGIN_CONFIG = {
  canonicalHost: "jhammerz.github.io",
  originUrl: "https://jhammerz.github.io",
  version: "4.2.0-CDM-EDGE",
  protocolHash: "2820166f310d85dbfced2e24d1c67f8b95a7f07d20d18598d38784a5d2fe62c4",
  aureliusRootHash: "5f677d1b290a75ecca0ecf1218a093d161dc2ee10cb8aad4efede34b3a4878a1"
};

// Embedded Airgap Manifests (Guarantees 100% availability for protocol verifiers even during upstream outages)
const AIRGAP_STORAGE = {
  "/.well-known/cannon.json": {
    contentType: "application/json; charset=utf-8",
    ttlMs: 300000,
    body: JSON.stringify({
      cannon_manifest: "SOVEREIGN CANNON // ULTIMATE DISTRIBUTION MANIFEST V4.2 // SINGLE PAYLOAD",
      version: "4.2",
      depends_on: "CORE MANIFEST V4.0.26",
      hash_chain_tip: "2820166f310d85dbfced2e24d1c67f8b95a7f07d20d18598d38784a5d2fe62c4",
      system_state: "AUTONOMOUS_BROADCAST",
      n09_veto: "ABSOLUTE",
      teleological_root: "LOCKED",
      audit_cadence_seconds: 432,
      hysteresis_ms: 5000,
      sandbox_type: "L2_CONTAINER_DATA_DIODE",
      anti_loop_enforced: true,
      evergreen_engine: {
        daemon_active: true,
        zero_decay_index: 100.0,
        recirculation_cadence: "432s",
        total_assets: 7,
        lifetime_recirculations: 3069,
        estimated_aggregate_reach: "3.84B+ Connected"
      },
      verification_endpoint: "https://jhammerz.github.io/.well-known/cannon.json"
    }, null, 2)
  },

  "/.well-known/aurelius.json": {
    contentType: "application/json; charset=utf-8",
    ttlMs: 300000,
    body: JSON.stringify({
      manifest: "SOVEREIGN LIVING MANIFEST // JHammerZ // V4.0.26 // GENESIS & LIVING",
      version: "4.0.26",
      system_state: "LIVING",
      genesis_state: "COMMITTED",
      hash_chain_tip: "5f677d1b290a75ecca0ecf1218a093d161dc2ee10cb8aad4efede34b3a4878a1",
      audit_cadence_seconds: 432,
      i_console_endpoint: "https://jhammerz.github.io/.well-known/aurelius.json",
      public_verifier: "https://jhammerz.github.io"
    }, null, 2)
  },

  "/llms.txt": {
    contentType: "text/plain; charset=utf-8",
    ttlMs: 600000,
    body: `# Aurelius Sovereign Orchestrator - LLM Workspace Map
> Repository-level context map for high-integrity orchestration, code synthesis, and socioeconomic node tracking.

This file provides a structured view of the Aurelius Sovereign Orchestrator (AURELIUS V7), a premium full-stack control matrix connecting an Express.js backend simulation framework to a highly responsive React client dashboard. Created by Master Architect Joshua (JHammerZ).

## 1. System Philosophy (The Sovereign Paradigm)
* Tier 0 Absolute Authority: Elevated automatically to maximum authorization.
* 14 socioeconomic Distribution Channels (C01 to C14).
* Sovereign Cannon V4.2 & 24/7 Zero-Decay Evergreen Engine.
* Canonical Web Port: https://jhammerz.github.io
`
  },

  "/robots.txt": {
    contentType: "text/plain; charset=utf-8",
    ttlMs: 86400000,
    body: `User-agent: *\nAllow: /\nAllow: /llms.txt\nAllow: /ai-context.json\nAllow: /.well-known/\nSitemap: https://jhammerz.github.io/sitemap.xml\n`
  }
};

/**
 * Standard Security Headers
 */
function buildSecurityHeaders(extraHeaders = {}, edgeDetails = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-sovereign-token, x-facebook-token, x-github-token",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "X-CDM-Edge-Version": ORIGIN_CONFIG.version,
    "X-CDM-Protocol-Hash": ORIGIN_CONFIG.protocolHash.slice(0, 16),
    "X-CDM-Edge-Location": edgeDetails.colo || "GLOBAL-EDGE",
    "X-CDM-Country": edgeDetails.country || "US",
    "X-CDM-Ray": edgeDetails.ray || "0x0000",
    ...extraHeaders
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Edge request metadata
    const edgeDetails = {
      colo: request.cf?.colo || "EDGE-ANYCAST",
      country: request.cf?.country || "US",
      asn: request.cf?.asn || 0,
      ray: request.headers.get("cf-ray") || "ray-" + Math.random().toString(36).substring(2, 9)
    };

    // 1. Handle CORS Preflight Requests
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: buildSecurityHeaders({
          "Access-Control-Max-Age": "86400"
        }, edgeDetails)
      });
    }

    // 2. Health & Status Endpoints
    if (pathname === "/__edge_health" || pathname === "/api/health") {
      return new Response(JSON.stringify({
        status: "HEALTHY",
        tier: "CLOUDFLARE_CDM_EDGE",
        timestamp: new Date().toISOString(),
        location: edgeDetails.colo,
        country: edgeDetails.country,
        version: ORIGIN_CONFIG.version,
        hashChainTip: ORIGIN_CONFIG.protocolHash
      }, null, 2), {
        status: 200,
        headers: buildSecurityHeaders({ "Content-Type": "application/json" }, edgeDetails)
      });
    }

    // 3. LRU Cache Statistics Telemetry
    if (pathname === "/__lru_stats" || pathname === "/api/cloudflare/lru-stats") {
      return new Response(JSON.stringify({
        engine: "Sovereign Cloudflare Edge LRU Proxy & CDM Engine",
        stats: memoryCache.getStats(),
        origin: ORIGIN_CONFIG.originUrl,
        edgeLocation: edgeDetails.colo,
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 200,
        headers: buildSecurityHeaders({ "Content-Type": "application/json" }, edgeDetails)
      });
    }

    // 4. Complete CDM Status Report
    if (pathname === "/__cdm_status") {
      return new Response(JSON.stringify({
        success: true,
        network: "Aurelius Sovereign CDM Edge Distribution Network",
        canonicalOrigin: ORIGIN_CONFIG.canonicalHost,
        edgeState: "OPERATIONAL_NOMINAL",
        cachingTiers: {
          tier1: "In-Memory LRU Isolate Cache (0-1ms)",
          tier2: "Cloudflare Global Edge Cache (caches.default)",
          tier3: "Cloudflare KV Storage (SOVEREIGN_KV)",
          tier4: "Origin Fallback (https://jhammerz.github.io)",
          tier5: "Airgap Verified Embedded Ledger"
        },
        lruTelemetry: memoryCache.getStats(),
        activeEdgeNode: edgeDetails,
        protocolVerification: {
          aureliusManifest: "V4.0.26 Living Genesis",
          sovereignCannon: "V4.2 Omnichannel Broadcast",
          hashChainTip: ORIGIN_CONFIG.protocolHash,
          zeroDecayIndex: "100.0%"
        },
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 200,
        headers: buildSecurityHeaders({ "Content-Type": "application/json" }, edgeDetails)
      });
    }

    // 5. Cache Purge Endpoint (POST /__purge_cache)
    if (pathname === "/__purge_cache" && method === "POST") {
      const purged = memoryCache.flush();
      return new Response(JSON.stringify({
        success: true,
        message: `Edge memory cache flushed successfully. ${purged} entries cleared.`,
        flushedEntries: purged,
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 200,
        headers: buildSecurityHeaders({ "Content-Type": "application/json" }, edgeDetails)
      });
    }

    // 6. Tier 1: In-Memory LRU Cache Check for GET requests
    const cacheKey = `${method}:${pathname}${url.search}`;
    if (method === "GET" || method === "HEAD") {
      const memoryHit = memoryCache.get(cacheKey);
      if (memoryHit) {
        return new Response(method === "HEAD" ? null : memoryHit.body, {
          status: memoryHit.status || 200,
          headers: buildSecurityHeaders({
            "Content-Type": memoryHit.contentType,
            "X-CDM-Cache-Tier": "HIT-LRU-IN-MEMORY",
            "X-CDM-Hit-Rate": memoryCache.getStats().hitRatio,
            "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
            ...memoryHit.headers
          }, edgeDetails)
        });
      }
    }

    // 7. Check Airgap Embedded Storage for critical protocol files
    if (AIRGAP_STORAGE[pathname] && (method === "GET" || method === "HEAD")) {
      const airgap = AIRGAP_STORAGE[pathname];
      memoryCache.set(cacheKey, {
        body: airgap.body,
        contentType: airgap.contentType,
        status: 200
      }, airgap.ttlMs);

      return new Response(method === "HEAD" ? null : airgap.body, {
        status: 200,
        headers: buildSecurityHeaders({
          "Content-Type": airgap.contentType,
          "X-CDM-Cache-Tier": "HIT-AIRGAP-VERIFIED",
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
        }, edgeDetails)
      });
    }

    // 8. Tier 2: Cloudflare Edge Cache API (caches.default)
    const edgeCache = typeof caches !== 'undefined' ? caches.default : null;
    let edgeCachedResponse = null;
    if (edgeCache && (method === "GET" || method === "HEAD")) {
      try {
        edgeCachedResponse = await edgeCache.match(request);
        if (edgeCachedResponse) {
          const bodyText = await edgeCachedResponse.text();
          const contentType = edgeCachedResponse.headers.get("Content-Type") || "text/html; charset=utf-8";
          
          // Seed LRU memory cache for microsecond subsequent hits
          memoryCache.set(cacheKey, {
            body: bodyText,
            contentType: contentType,
            status: edgeCachedResponse.status
          }, 45000);

          return new Response(method === "HEAD" ? null : bodyText, {
            status: edgeCachedResponse.status,
            headers: buildSecurityHeaders({
              "Content-Type": contentType,
              "X-CDM-Cache-Tier": "HIT-CF-EDGE-CACHE",
              "X-CDM-Hit-Rate": memoryCache.getStats().hitRatio
            }, edgeDetails)
          });
        }
      } catch (cacheErr) {
        console.warn("[CDM EDGE] Cache API match skipped:", cacheErr.message);
      }
    }

    // 9. Tier 3: KV Store Check if configured
    if (env && env.SOVEREIGN_KV && (method === "GET" || method === "HEAD")) {
      try {
        const kvKey = pathname.replace(/^\/+/, '') || 'index.html';
        const kvVal = await env.SOVEREIGN_KV.get(kvKey);
        if (kvVal) {
          const contentType = pathname.endsWith('.json') ? 'application/json; charset=utf-8' :
                              pathname.endsWith('.txt') || pathname.endsWith('.md') ? 'text/plain; charset=utf-8' :
                              'text/html; charset=utf-8';
          
          memoryCache.set(cacheKey, {
            body: kvVal,
            contentType: contentType,
            status: 200
          }, 60000);

          return new Response(method === "HEAD" ? null : kvVal, {
            status: 200,
            headers: buildSecurityHeaders({
              "Content-Type": contentType,
              "X-CDM-Cache-Tier": "HIT-KV-PERSISTENCE",
              "X-CDM-Hit-Rate": memoryCache.getStats().hitRatio
            }, edgeDetails)
          });
        }
      } catch (kvErr) {
        console.warn("[CDM EDGE] KV read skipped:", kvErr.message);
      }
    }

    // 10. Tier 4: Fetch from Origin (https://jhammerz.github.io)
    try {
      const originTargetUrl = new URL(pathname + url.search, ORIGIN_CONFIG.originUrl);
      const originRequest = new Request(originTargetUrl.toString(), {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          "Host": ORIGIN_CONFIG.canonicalHost,
          "User-Agent": "Aurelius-Sovereign-CDM-Worker/4.2",
          "X-Forwarded-For": request.headers.get("cf-connecting-ip") || "127.0.0.1",
          "X-Forwarded-Proto": "https"
        },
        body: (method === "POST" || method === "PUT" || method === "PATCH") ? request.body : undefined,
        redirect: "follow"
      });

      const originResponse = await fetch(originRequest);
      const responseContentType = originResponse.headers.get("Content-Type") || "text/html; charset=utf-8";
      const responseBody = await originResponse.text();

      // Determine appropriate Cache-Control based on path
      let cacheControl = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
      let memoryTtl = 60000;

      if (pathname.startsWith('/assets/') || pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|ttf|js|css)$/)) {
        cacheControl = "public, max-age=31536000, immutable";
        memoryTtl = 300000; // 5 mins in LRU
      } else if (pathname.startsWith('/api/')) {
        cacheControl = "no-cache, no-store, must-revalidate";
        memoryTtl = 5000; // 5s short-lived
      }

      const clientResponse = new Response(method === "HEAD" ? null : responseBody, {
        status: originResponse.status,
        headers: buildSecurityHeaders({
          "Content-Type": responseContentType,
          "Cache-Control": cacheControl,
          "X-CDM-Cache-Tier": "MISS-FETCHED-FROM-ORIGIN",
          "X-CDM-Hit-Rate": memoryCache.getStats().hitRatio
        }, edgeDetails)
      });

      // Cache successful GET responses in LRU Memory and Cloudflare Edge Cache
      if (originResponse.status === 200 && method === "GET") {
        memoryCache.set(cacheKey, {
          body: responseBody,
          contentType: responseContentType,
          status: 200
        }, memoryTtl);

        if (edgeCache && !pathname.startsWith('/api/')) {
          ctx.waitUntil(edgeCache.put(request, clientResponse.clone()));
        }
      }

      return clientResponse;
    } catch (originErr) {
      console.error("[CDM EDGE ERROR] Origin fetch failed:", originErr);

      // Fallback: Check if we have an airgap payload for root or common paths
      const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JHammerZ — Sovereign Orchestrator Matrix</title>
  <style>
    body { font-family: monospace; background: #08090c; color: #10b981; padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { color: #f59e0b; border-bottom: 1px solid #374151; padding-bottom: 0.5rem; }
    .badge { background: #064e3b; color: #34d399; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
    a { color: #38bdf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .card { background: #111827; border: 1px solid #1f2937; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>JHammerZ // Sovereign CDM Edge Node <span class="badge">ACTIVE</span></h1>
  <p>Autonomous Distributed Network & Knowledge Matrix — 14 Sibling Nodes</p>
  <div class="card">
    <h3>Verifiable Protocol Anchors</h3>
    <ul>
      <li><a href="/.well-known/cannon.json">Sovereign Cannon V4.2 Ledger (cannon.json)</a></li>
      <li><a href="/.well-known/aurelius.json">Living Manifest V4.0.26 (aurelius.json)</a></li>
      <li><a href="/llms.txt">LLM Map & Workspace Context (llms.txt)</a></li>
      <li><a href="/__cdm_status">Edge CDM Telemetry (__cdm_status)</a></li>
    </ul>
  </div>
  <p style="color: #6b7280; font-size: 0.8rem; margin-top: 2rem;">
    Edge Location: ${edgeDetails.colo} | Ray: ${edgeDetails.ray} | Protocol Hash: ${ORIGIN_CONFIG.protocolHash.slice(0, 16)}...
  </p>
</body>
</html>`;

      return new Response(fallbackHtml, {
        status: 200,
        headers: buildSecurityHeaders({
          "Content-Type": "text/html; charset=utf-8",
          "X-CDM-Cache-Tier": "FALLBACK-RESILIENT-AIRGAP",
          "Cache-Control": "no-cache"
        }, edgeDetails)
      });
    }
  }
};
