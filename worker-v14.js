export default {
  async fetch(req, env) {
    if (req.method !== 'POST') return new Response('Method Not Allowed', {status: 405});
    if (req.headers.get('Authorization') !== `Bearer ${env.PUBLISH_KEY}`) return new Response('Unauthorized', {status: 401});
    
    const {title, body, image_url} = await req.json();
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();
    
    // Get current feed.json from GitHub
    const gh_get = await fetch(`https://api.github.com/repos/JHammerZ/jhammerz.github.io/contents/feed.json`, {
      headers: {
        'Authorization': `Bearer ${env.GH_TOKEN}`,
        'User-Agent': 'Lysander-Worker',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const gh_data = await gh_get.json();
    const sha = gh_data.sha;
    const content = JSON.parse(atob(gh_data.content));
    
    // Append new post
    content.posts = content.posts || [];
    content.posts.unshift({
      id: uuid,
      title, body, image_url,
      timestamp,
      kernel: 'KERNEL_ROOT_ACTIVE',
      hfid: 'H-FID-100-FORENSIC-AUDIT'
    });
    
    // PUT back to GitHub
    const updated = btoa(JSON.stringify(content, null, 2));
    const github_res = await fetch(`https://api.github.com/repos/JHammerZ/jhammerz.github.io/contents/feed.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GH_TOKEN}`,
        'User-Agent': 'Lysander-Worker',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `H-FID-PUBLISH: ${title}`,
        content: updated,
        sha: sha
      })
    });
    
    // v14 SCALE: Multi-target propagation
    const targets = JSON.parse(env.TARGETS_JSON || '{}');
    let propagation = { github: github_res.status };
    
    if (targets.discord && github_res.ok) {
      const discordPayload = {
        embeds: [{
          title: title,
          description: body.slice(0, 4096),
          color: 0x00ff00,
          footer: { text: `KERNEL_ROOT_ACTIVE | H-FID-100-FORENSIC-AUDIT` },
          timestamp: timestamp
        }]
      };
      
      const discord_res = await fetch(targets.discord, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      });
      propagation.discord = discord_res.status;
    }
    
    return Response.json({
      status: 'propagated',
      posts: content.posts.length,
      kernel: 'KERNEL_ROOT_ACTIVE',
      propagation,
      github_status: github_res.status
    });
  }
}
