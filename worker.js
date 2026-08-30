export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/music' || url.pathname === '/music/') {
      url.pathname = '/music.html';
    }
    return env.ASSETS.fetch(new Request(url, request));
  }
}
