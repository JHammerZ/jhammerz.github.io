export default {
  async fetch(request) {
    return new Response('jhammerz-router online', {
      headers: { 'content-type': 'text/plain' }
    });
  }
}
