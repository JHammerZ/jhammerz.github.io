export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health' || path === '/api/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        worker: 'lysander-gzip',
        compression: ['gzip', 'br', 'deflate'],
        hid: env.SOVEREIGN_HID || 'JHammerZ-001',
        geo_rank: env.GEO_RANK || 'ONE_OF_ONE',
        slsa_level: 3,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'X-Powered-By': 'lysander-gzip'
        }
      });
    }

    const originUrl = new URL(request.url);
    originUrl.hostname = 'jhammerz.github.io';
    originUrl.protocol = 'https:';

    const originReq = new Request(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
    });

    const response = await fetch(originReq, {
      cf: {
        cacheEverything: true,
        cacheTtl: 86400,
        polish: 'lossless'
      }
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600');
    newHeaders.set('Vary', 'Accept-Encoding');
    newHeaders.set('X-Edge-Compression', 'lysander-gzip');
    newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
