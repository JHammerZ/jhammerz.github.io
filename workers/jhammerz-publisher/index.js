export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-HFID-Signature, X-SOVEREIGN-HID'
    };

    if (method === 'OPTIONS') return new Response(null, { headers: cors });

    if (path === '/health' || path === '/api/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        worker: 'jhammerz-publisher',
        hid: env.SOVEREIGN_HID || 'JHammerZ-001',
        geo_rank: env.GEO_RANK || 'ONE_OF_ONE',
        role: env.ROLE || 'SOVEREIGN_MESH_PUBLISHER',
        slsa_level: 3,
        colo: request.cf?.colo || 'EDGE',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    if (method === 'POST' && (path === '/publish' || path === '/api/publish')) {
      try {
        const payload = await request.json();
        return new Response(JSON.stringify({
          success: true,
          status: 'COMMITTED',
          event_id: `pub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          publisher: 'jhammerz-publisher',
          hid: env.SOVEREIGN_HID || 'JHammerZ-001',
          timestamp: new Date().toISOString(),
          received_action: payload.action || 'BROADCAST'
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

    if (path === '/broadcast' || path === '/feed') {
      return Response.redirect('https://jhammerz.github.io/feed.json', 302);
    }

    return new Response(JSON.stringify({
      worker: 'jhammerz-publisher',
      status: 'OPERATIONAL',
      endpoints: ['/health', '/publish', '/broadcast', '/feed']
    }), {
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
};
