/**
 * JHammerZ Sovereign Edge Router & CDN Proxy
 * Master Architect: Joshua Hamilton [JHammerZ-001]
 * Protocols: H-FID v1.0.3 | HEO | Ag-FI | Twenty 47
 * Target: https://jhammerz.github.io
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 1. BLOCK BAD / MALICIOUS PATHS
    if (
      path.startsWith('/.env') ||
      path.startsWith('/.git') ||
      path.startsWith('/.aws') ||
      path.includes('.DS_Store') ||
      path.includes('wp-admin') ||
      path.includes('wp-login')
    ) {
      return new Response('Not found', { status: 404 });
    }

    // 2. HEALTH & TELEMETRY API ROUTES
    if (path === '/health' || path === '/api/health' || path === '/__edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        hid: 'JHammerZ-001',
        global_root: true,
        protocol: 'A2A-2026-v1',
        geo_rank: 'ONE_OF_ONE',
        slsa_level: 3,
        colo: request.cf?.colo || 'EDGE',
        timestamp: new Date().toISOString(),
        version: '1.3.0'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Powered-By': 'jhammerz-router [RING_-3]'
        }
      });
    }

    if (path === '/api/status') {
      return new Response(JSON.stringify({
        status: 'online',
        timestamp: Date.now(),
        colo: request.cf?.colo || 'UNKNOWN',
        version: '1.0.0',
        author: 'Joshua Hamilton [JHammerZ]'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Powered-By': 'jhammerz-router'
        }
      });
    }

    if (path === '/api/echo' && method === 'POST') {
      const body = await request.text();
      return new Response(body, {
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 3. SOVEREIGN KV STATE PERSISTENCE (AGENT_STATE_LEDGER)
    if (path.startsWith('/api/state/') && env?.AGENT_STATE_LEDGER) {
      const key = path.replace('/api/state/', '');
      if (method === 'GET') {
        const value = await env.AGENT_STATE_LEDGER.get(key);
        return new Response(value || JSON.stringify({ error: 'not_found' }), {
          status: value ? 200 : 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      if (method === 'POST' || method === 'PUT') {
        const data = await request.text();
        await env.AGENT_STATE_LEDGER.put(key, data);
        return new Response(JSON.stringify({ status: 'persisted', key }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 4. CANONICAL SOCIAL & AUTHORITY REDIRECT MATRIX
    const redirects = {
      '/github': 'https://github.com/JHammerZ/jhammerz.github.io',
      '/x': 'https://x.com/JHammerZ',
      '/twitter': 'https://x.com/JHammerZ',
      '/spotify': 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79',
      '/apple': 'https://music.apple.com/us/artist/jhammerz/1845705346',
      '/amazon': 'https://music.amazon.com/artists/B0D5GLL7NV/jhammerz',
      '/bandlab': 'https://www.bandlab.com/band/band8670133842983447',
      '/youtube': 'https://www.youtube.com/@JHammerZ',
      '/instagram': 'https://www.instagram.com/jhammerzz',
      '/tiktok': 'https://tiktok.com/@jhammerzz',
      '/facebook': 'https://www.facebook.com/JHammerZz',
      '/linkedin': 'https://www.linkedin.com/in/JHammerZ',
      '/carrd': 'https://jhammerz.carrd.co/',
      '/zenodo': 'https://doi.org/10.5281/zenodo.18635876',
      '/orcid': 'https://orcid.org/0009-0004-5273-7028',
      '/projects': '/#projects',
      '/resume': '/resume.pdf'
    };

    if (redirects[path]) {
      return Response.redirect(redirects[path], 301);
    }

    // 5. CACHE PROXY + ORIGIN SHIELD
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (!response) {
      const originUrl = `https://jhammerz.github.io${path}${url.search}`;
      const originReq = new Request(originUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow'
      });

      try {
        response = await fetch(originReq);
      } catch (err) {
        return new Response(`Origin gateway timeout: ${err.message}`, { status: 504 });
      }

      // 6. SPA FALLBACK FOR DIRECT APPLICATION ROUTES
      if (response.status === 404 && !path.includes('.')) {
        try {
          const indexRes = await fetch('https://jhammerz.github.io/index.html');
          if (indexRes.ok) {
            response = new Response(indexRes.body, {
              status: 200,
              headers: indexRes.headers
            });
          }
        } catch (_) {}
      }

      // 7. SECURITY & PERFORMANCE HEADERS
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-Powered-By', 'jhammerz-router [RING_-3]');
      newHeaders.set('X-Frame-Options', 'DENY');
      newHeaders.set('X-Content-Type-Options', 'nosniff');
      newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      newHeaders.set('Permissions-Policy', 'interest-cohort=()');
      newHeaders.set('Access-Control-Allow-Origin', '*');

      if (!newHeaders.has('Cache-Control')) {
        newHeaders.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      }

      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

      // 8. ASYNC CACHE WARMING
      if (request.method === 'GET' && response.status === 200 && ctx) {
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
    }

    return response;
  }
};
