/**
 * GLOBAL EDGE INTERCEPTOR: FORENSIC RESET PROTOCOL (2026)
 * Deployed via GitHub Actions Automation
 * Handles: Spam blocking, quality filtering, api/v1 routing, live audits
 */

const BLOCKED_PATTERNS = [
  "ai-slop-generator.com",
  "synthetic-spam-network.net", 
  "automated-content-farm.org"
];

const QUALITY_THRESHOLD = 0.35;
const SECRETS_PATTERN = /AIza[0-9A-Za-z\-_]{35}/;

async function runSentinelAudit(request) {
  const url = new URL(request.url);
  let violations = 0;
  let scanned = [];
  
  // Scan publicly accessible files via HTTP
  const publicFiles = [
    '/index.html',
    '/manifest.html', 
    '/logic/proxy_opt.js',
    '/api/v1/manifest.json',
    '/api/v1/knowledge_graph.json',
    '/api/v1/agent_memory.js',
    '/api/v1/entity_schema.json'
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
    message: violations === 0 
      ? "✅ PERIMETER SECURE: No vulnerabilities detected." 
      : `⚠️ AUDIT RATIFIED: ${violations} potential leaks flagged for review.`,
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (BLOCKED_PATTERNS.some(pattern => url.hostname.includes(pattern))) {
      return new Response("Access Denied: Domain flagged by 2026 Forensic Reset Protocol.", {
        status: 403,
        headers: { "Content-Type": "text/plain", "X-Global-Reset": "Enforced" }
      });
    }

    // Live audit endpoint
    if (url.pathname === '/api/v1/audit') {
      return await runSentinelAudit(request);
    }

    // Static responses for other nodes
    if (url.pathname === '/api/v1/distribution') {
      return new Response(JSON.stringify({ 
        status: "active", 
        node: "echo_broadcast",
        endpoints: ["omega.md", "manifest.html"]
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.pathname === '/api/v1/orbital-mesh') {
      return new Response(JSON.stringify({ 
        status: "active", 
        node: "quantum_ghost",
        mesh: "sovereign_crawl"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.pathname.startsWith('/api/v1/') && url.pathname.endsWith('.json')) {
      return fetch(new Request(url.origin + url.pathname, request));
    }
    
    if (url.pathname.startsWith('/api/v1/')) {
      return new Response("API endpoint not found", { status: 404 });
    }
    
    try {
      const originalResponse = await fetch(request);
      const contentQuality = originalResponse.headers.get("X-Content-Quality-Score");
      
      if (contentQuality && parseFloat(contentQuality) < QUALITY_THRESHOLD) {
        return new Response("Content Dropped: Failed global network quality standards.", {
          status: 406,
          headers: { "Content-Type": "text/plain" }
        });
      }
      
      return originalResponse;
    } catch (error) {
      return new Response("Global Edge Routing Error", { status: 500 });
    }
  }
};