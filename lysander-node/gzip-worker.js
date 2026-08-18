export default {
  async fetch(request, env, ctx) {
    // Simulate package.json content or fetch from KV/Assets
    const data = JSON.stringify({
      "name": "lysander-node",
      "version": "1.0.0",
      "type": "module"
    });
    
    // Compress using Web Streams API
    const stream = new Response(data).body
      .pipeThrough(new CompressionStream('gzip'));
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip'
      }
    });
  }
}
