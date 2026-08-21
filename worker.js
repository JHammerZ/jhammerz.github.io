export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. API ROUTES
    if (path.startsWith('/api/')) {
      if (path === '/api/status') {
        return new Response(JSON.stringify({
          status: 'online',
          timestamp: Date.now(),
          colo: request.cf.colo,
          version: '1.0.0'
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'X-Powered-By': 'jhammerz-router'
          }
        });
      }
      
      if (path === '/api/echo' && request.method === 'POST') {
        const body = await request.text();
        return new Response(body, {
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      return new Response('API route not found', { status: 404 });
    }

    // 2. REDIRECTS
    const redirects = {
      '/github': 'https://github.com/JHammerZ',
      '/x': 'https://x.com/JHammerZ',
      '/projects': '/#projects',
      '/resume': '/resume.pdf'
    };
    if (redirects[path]) {
      return Response.redirect(redirects[path], 301);
    }

    // 3. BLOCK BAD PATHS
    if (path.startsWith('/.env') || path.startsWith('/.git')) {
      return new Response('Not found', { status: 404 });
    }

    // 4. PROXY + CACHE + HEADERS
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (!response) {
      const originUrl = `https://jhammerz.github.io${path}${url.search}`;
      const originReq = new Request(originUrl, request);
      response = await fetch(originReq);

      // SPA fallback for app routes
      if (response.status === 404 &&!path.includes('.')) {
        const indexRes = await fetch('https://jhammerz.github.io/index.html');
        response = new Response(indexRes.body, {
          status: 200,
          headers: indexRes.headers
        });
      }

      // Security + custom headers
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-Powered-By', 'jhammerz-router');
      newHeaders.set('X-Frame-Options', 'DENY');
      newHeaders.set('X-Content-Type-Options', 'nosniff');
      newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      newHeaders.set('Permissions-Policy', 'interest-cohort=()');
      newHeaders.set('Cache-Control', 'public, max-age=3600');

      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

      if (request.method === 'GET' && response.status === 200) {
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
    }

    return response;
  }
}
