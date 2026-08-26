export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: "ONLINE",
        hid: "JHammerZ-001",
        global_root: true,
        protocol: "A2A-2026-v1",
        geo_rank: "ONE_OF_ONE",
        slsa_level: 3,
        colo: "ATL",
        timestamp: new Date().toISOString(),
        version: "1.3.1",
        kv_binding: "HEO_CACHE"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/set' && request.method === 'POST') {
      const { key, value } = await request.json();
      await env.HEO_CACHE.put(key, value);
      return new Response(JSON.stringify({ ok: true, key, value }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/get' && request.method === 'GET') {
      const key = url.searchParams.get('key');
      const value = await env.HEO_CACHE.get(key);
      return new Response(JSON.stringify({ key, value }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('LYSANDER v13 ONLINE. HEO_CACHE bound.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
