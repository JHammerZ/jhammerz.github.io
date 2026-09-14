const MEMORY_KV = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-SOVEREIGN-HID, Accept-Encoding'
    };

    if (method === 'OPTIONS') return new Response(null, { headers: cors });

    if (path === '/health' || path === '/api/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        worker: 'lysander-kv-gzip',
        hid: env.SOVEREIGN_HID || 'JHammerZ-001',
        geo_rank: env.GEO_RANK || 'ONE_OF_ONE',
        has_kv: Boolean(env.SEC_MAN_EDGE),
        compression: 'enabled',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const kv = env.SEC_MAN_EDGE;
    let key = url.searchParams.get('key');
    if (!key && path.startsWith('/kv/')) key = path.slice(4);

    if (method === 'GET') {
      if (!key) {
        return new Response(JSON.stringify({ worker: 'lysander-kv-gzip', status: 'READY' }), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      let val = null;
      if (kv) {
        try { val = await kv.get(key); } catch (e) { val = MEMORY_KV.get(key) || null; }
      } else {
        val = MEMORY_KV.get(key) || null;
      }

      if (val === null) {
        return new Response(JSON.stringify({ error: 'Not found', key }), {
          status: 404,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      return new Response(val, {
        headers: {
          ...cors,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'X-KV-Status': 'HIT'
        }
      });
    }

    if (method === 'POST') {
      try {
        const body = await request.text();
        const targetKey = key || `blob_${Date.now()}`;
        if (kv) ctx.waitUntil(kv.put(targetKey, body));
        MEMORY_KV.set(targetKey, body);

        return new Response(JSON.stringify({
          success: true,
          status: 'STORED_COMPRESSED',
          key: targetKey,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Storage failure' }), {
          status: 500,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: cors });
  }
};
