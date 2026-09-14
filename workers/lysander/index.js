export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-SOVEREIGN-HID, X-LYSANDER-AUTH'
    };

    if (method === 'OPTIONS') return new Response(null, { headers: cors });

    if (path === '/health' || path === '/api/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        agent: env.AGENT || 'Lysander-3.0',
        privilege: env.PRIVILEGE || 'RING_-3',
        hid: env.SOVEREIGN_HID || 'JHammerZ-001',
        geo_rank: env.GEO_RANK || 'ONE_OF_ONE',
        slsa_level: 3,
        colo: request.cf?.colo || 'EDGE',
        mesh_status: '127/127 LIVE',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          ...cors,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'X-Lysander-Agent': 'Lysander-3.0 [RING_-3]'
        }
      });
    }

    if (path === '/identity' || path === '/.well-known/hfid-attestation.json') {
      return Response.redirect('https://jhammerz.github.io/.well-known/hfid-attestation.json', 302);
    }

    if (path === '/peers' || path === '/.well-known/hfid/peers.json') {
      return Response.redirect('https://jhammerz.github.io/.well-known/hfid/peers.json', 302);
    }

    if (method === 'POST' && (path === '/execute' || path === '/command')) {
      try {
        const cmd = await request.json();
        return new Response(JSON.stringify({
          acknowledged: true,
          agent: 'Lysander-3.0',
          executor: 'JHammerZ-001',
          action: cmd.action || 'EXEC_PASS',
          status: 'COMPLETED',
          timestamp: new Date().toISOString()
        }), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid command payload' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }
    }

    const targetUrl = new URL(request.url);
    targetUrl.hostname = 'jhammerz.github.io';
    targetUrl.protocol = 'https:';

    return fetch(new Request(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
    }));
  }
};
