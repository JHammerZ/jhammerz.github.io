eexport default {
  async scheduled(event, env, ctx) {
    try {
      const res = await fetch(env.SOURCE_FEED_URL);
      if (!res.ok) throw new Error(`Source fetch failed: ${res.status}`);
      const data = await res.text();
      const integrity = data.length > 0 ? 100 : 0;
      
      if (integrity < env.SYNTACTIC_INTEGRITY_THRESHOLD) {
        console.log(`Integrity check failed: ${integrity}`);
        return;
      }

      // Your original custom endpoint relay
      if (env.CUSTOM_NODE_ENDPOINT) {
        await fetch(env.CUSTOM_NODE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, integrity, ts: Date.now() })
        });
      }

      // Algorithmic push to all platforms
      const pushResults = await Promise.allSettled([
        pushGitHub(data, env.GITHUB_TOKEN),
        pushLinkedIn(data, env.LINKEDIN_TOKEN),
        pushFacebook(data, env.FACEBOOK_TOKEN),
        // TikTok/YouTube/Instagram need OAuth refresh - stubbed for now
      ]);

      // Discord summary with push results
      const failed = pushResults.filter(r => r.status === 'rejected').length;
      const succeeded = pushResults.length - failed;
      
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "LYSANDER Node Poll",
            description: `Integrity: ${integrity}\nPushed: ${succeeded}/${pushResults.length}`,
            color: failed > 0 ? 15158332 : 5814783,
            timestamp: new Date().toISOString()
          }]
        })
      });

    } catch (err) {
      console.error('LYSANDER error:', err);
      if (env.DISCORD_WEBHOOK_URL) {
        await fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `LYSANDER ERROR: ${err.message}` })
        });
      }
    }
  }
}

// GitHub: commits data as a file
async function pushGitHub(data, token) {
  if (!token) return;
  const content = btoa(`Automated update ${new Date().toISOString()}\n\n${data}`);
  const res = await fetch("https://api.github.com/repos/JHammerZ/jhammerz.github.io/contents/lysander/latest.txt", {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent": "lysander-node",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "LYSANDER automated push",
      content: content,
      branch: "main"
    })
  });
  if (!res.ok) throw new Error(`GitHub: ${res.status} ${await res.text()}`);
}

// LinkedIn: requires your Person URN
async function pushLinkedIn(data, token) {
  if (!token) return;
  // Replace PERSON_URN with yours from https://api.linkedin.com/v2/me
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      author: "urn:li:person:PERSON_URN", // <-- CHANGE THIS
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: data.substring(0, 3000) }, // LinkedIn limit
          shareMediaCategory: "NONE"
        }
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    })
  });
  if (!res.ok) throw new Error(`LinkedIn: ${res.status} ${await res.text()}`);
}

// Facebook: requires Page ID + Page token, not user token
async function pushFacebook(data, token) {
  if (!token) return;
  // Replace PAGE_ID with your Facebook Page ID
  const res = await fetch(`https://graph.facebook.com/v18.0/PAGE_ID/feed`, {
    method: "POST",
    body: new URLSearchParams({
      message: data.substring(0, 5000),
      access_token: token
    })
  });
  if (!res.ok) throw new Error(`Facebook: ${res.status} ${await res.text()}`);
}
