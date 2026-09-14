const MEMORY_KV = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-SOVEREIGN-HID'
    };

    if (method === 'OPTIONS') return new Response(null, { headers: cors });

    if (path === '/health' || path === '/api/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        worker: 'kv',
        hid: env.SOVEREIGN_HID || 'JHammerZ-001',
        geo_rank: env.GEO_RANK || 'ONE_OF_ONE',
        role: env.ROLE || 'SOVEREIGN_KV_GATEWAY',
        has_binding: Boolean(env.SEC_MAN_EDGE || env.LYSANDER_KV || env.AGENT_STATE_LEDGER),
        timestamp: new Date().toISOString()
      }), {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const kvStore = env.SEC_MAN_EDGE || env.LYSANDER_KV || env.AGENT_STATE_LEDGER;

    if (method === 'GET') {
      let key = url.searchParams.get('key');
      if (!key && path.startsWith('/kv/')) key = path.slice(4);

      if (!key) {
        return new Response(JSON.stringify({ worker: 'kv', status: 'READY' }), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      let val = null;
      if (kvStore && typeof kvStore.get === 'function') {
        try { val = await kvStore.get(key); } catch (e) { val = MEMORY_KV.get(key) || null; }
      } else {
        val = MEMORY_KV.get(key) || null;
      }

      if (val === null) {
        return new Response(JSON.stringify({ error: 'Key not found', key }), {
          status: 404,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ key, value: val, status: 'FOUND' }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'POST' || method === 'PUT') {
      let key = url.searchParams.get('key');
      if (!key && path.startsWith('/kv/')) key = path.slice(4);

      try {
        const body = await request.json();
        const value = typeof body.value !== 'undefined' ? body.value : body;
        const targetKey = key || body.key || `state_${Date.now()}`;
        const strVal = typeof value === 'string' ? value : JSON.stringify(value);

        if (kvStore && typeof kvStore.put === 'function') {
          ctx.waitUntil(kvStore.put(targetKey, strVal));
        }
        MEMORY_KV.set(targetKey, strVal);

        return new Response(JSON.stringify({
          success: true,
          status: 'STORED',
          key: targetKey,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: cors });
  }
};
