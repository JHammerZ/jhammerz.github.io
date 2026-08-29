const BLOCKED_BOTS = [
  'GPTBot','ChatGPT-User','CCBot','anthropic-ai','Claude-Web',
  'Google-Extended','PerplexityBot','Bytespider','Diffbot','omgili',
  'FacebookBot','Applebot-Extended'
];
function isBlockedBot(ua){ return BLOCKED_BOTS.some(b=> ua && ua.includes(b)); }
// HBS Edge Lock - deny AI crawlers at edge
if (typeof request !== 'undefined') {
  const ua = request.headers.get('user-agent') || '';
  if (isBlockedBot(ua)) return new Response('AI Crawler Blocked - HBS Semantic Lock', {status: 403});
}

// Manual initialization run complete. 2026-08-16T21:04:08Z
