const REDIRECT_MAP = {
  '/site': 'https://jhammerz.github.io',
  '/tiktok': 'https://www.tiktok.com/@jhammerzz',
  '/linkedin': 'https://www.linkedin.com/in/JHammerZ',
  '/youtube': 'https://www.youtube.com/JHammerZ',
  '/yt': 'https://www.youtube.com/JHammerZ',
  '/ig': 'https://www.instagram.com/jhammerzz',
  '/fb': 'https://facebook.com/profile.php?id=61574652435664',
  '/carrd': 'https://jhammerz.carrd.co',
  '/amazon-music': 'https://music.amazon.com/artists/B0SGL7W/jhammerz',
  '/apple-music': 'https://music.apple.com/us/artist/jhammerz/1845798346',
  '/bandlab': 'https://music.bandlab.com/artist/781334284',
  '/xhs': 'https://www.xiaohongshu.com/user/profile/JHammerZ',
  '/github': 'https://github.com/JHammerZ/jhammerz.github.io',
  '/impact': 'https://app.impact.com/secure/mediapartner/home/pview.ihtml#/',
  '/spotify': 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const path = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
      : pathname;

    if (REDIRECT_MAP[path]) {
      return Response.redirect(REDIRECT_MAP[path], 302);
    }

    if (path === '/' || path === '') {
      return Response.redirect(REDIRECT_MAP['/site'], 302);
    }

    return new Response(
      `404: Path "${pathname}" not found.\n\nAvailable shortcuts:\n${Object.keys(REDIRECT_MAP).sort().join('\n')}`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Debug-Path': pathname
        }
      }
    );
  }
}