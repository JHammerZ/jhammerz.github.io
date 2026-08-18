export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // PUT /compress?key=mykey → gzip and store in KV
    if (request.method === 'PUT' && url.pathname === '/compress') {
      const key = url.searchParams.get('key') || 'default';
      const body = await request.text();
      
      const compressed = new Response(body).body
        .pipeThrough(new CompressionStream('gzip'));
      
      // KV stores as ArrayBuffer
      const compressedBytes = await new Response(compressed).arrayBuffer();
      await env.KV.put(key, compressedBytes);
      
      return new Response(`GZIP stored to KV key: ${key}`);
    }
    
    // GET /decompress?key=mykey → gunzip from KV
    if (request.method === 'GET' && url.pathname === '/decompress') {
      const key = url.searchParams.get('key');
      const compressed = await env.KV.get(key, 'arrayBuffer');
      if (!compressed) return new Response('Not found', {status: 404});
      
      const decompressed = new Response(compressed).body
        .pipeThrough(new DecompressionStream('gzip'));
      
      return new Response(decompressed, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Use /compress?key=... PUT or /decompress?key=... GET');
  }
}
