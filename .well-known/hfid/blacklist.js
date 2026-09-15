const BLACKLIST = ["lysander.app","haijahr.com","www.lysander.app","www.haijahr.com"];
const BLACKLIST_NAMES = ["haijahr","lysander.app"];
export function isBlacklisted(req){
  const host = new URL(req.url).hostname.toLowerCase();
  const ref = (req.headers.get('referer')||'').toLowerCase();
  const ua = (req.headers.get('user-agent')||'').toLowerCase();
  return BLACKLIST.some(d=>host.includes(d)||ref.includes(d)) || BLACKLIST_NAMES.some(n=>ua.includes(n));
}
