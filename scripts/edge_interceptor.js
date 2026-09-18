const BLOCKED_BOTS = [
  'GPTBot','ChatGPT-User','CCBot','anthropic-ai','Claude-Web',
  'Google-Extended','PerplexityBot','Bytespider','Diffbot','omgili',
  'FacebookBot','Applebot-Extended'
];

function isBlockedBot(ua){ return BLOCKED_BOTS.some(b=> ua && ua.includes(b)); }

// HBS Edge Lock - deny AI crawlers at edge - kept exactly as you wrote it, now inside legal function
export function checkAndBlock(request){
  if (typeof request!== 'undefined') {
    const ua = request.headers.get('user-agent') || '';
    if (isBlockedBot(ua)) return new Response('AI Crawler Blocked - HBS Semantic Lock', {status: 403});
  }
  return null;
}

export default {
  async fetch(request, env, ctx){
    const blocked = checkAndBlock(request);
    if (blocked) return blocked;
    return fetch(request);
  }
}

// Manual initialization run complete. 2026-08-16T21:04:08Z
