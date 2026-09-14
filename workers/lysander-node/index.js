export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-SOVEREIGN-HID, X-NODE-TOKEN'
    };

    if (method === 'OPTIONS') return new Response(null, { headers: cors });

    if (path === '/health' || path === '/api/health' || path === '/_edge_health') {
      return new Response(JSON.stringify({
        status: 'ONLINE',
        node: 'lysander-node',
        node_id: env.NODE_ID || 'AX-01',
        runner: 'VIRTUAL_RUNNER@LYSANDER-NODE-AX-01',
        hid: env.SOVEREIGN_HID || 'JHammerZ-001',
        geo_rank: env.GEO_RANK || 'ONE_OF_ONE',
        role: env.ROLE || 'SOVEREIGN_NODE_GATEWAY',
        slsa_level: 3,
        colo: request.cf?.colo || 'EDGE',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    if (path === '/status' || path === '/node/status') {
      return new Response(JSON.stringify({
        node: 'lysander-node',
        status: 'OPERATIONAL',
        active_mesh: '14_PEERS_SYNCHRONIZED',
        protocol: env.PROTOCOL || 'Twenty_47',
        timestamp: Date.now()
      }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    const originUrl = new URL(request.url);
    originUrl.hostname = 'jhammerz.github.io';
    originUrl.protocol = 'https:';

    return fetch(new Request(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
    }));
  }
};
