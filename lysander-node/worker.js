export default {
  async scheduled(event, env, ctx) {
    try {
      const SOURCE_FEED_URL = env.SOURCE_FEED_URL || "https://jhammerzofficial.com";
      const SYNTACTIC_INTEGRITY_THRESHOLD = parseInt(env.SYNTACTIC_INTEGRITY_THRESHOLD || "50");
      const CUSTOM_NODE_ENDPOINT = env.CUSTOM_NODE_ENDPOINT || "https://lysander-node.jhammerzofficial.workers.dev/post";
      const DISCORD_WEBHOOK_URL = env.DISCORD_WEBHOOK_URL || "";

      const res = await fetch(SOURCE_FEED_URL);
      if (!res.ok) throw new Error(`Source fetch failed: ${res.status}`);
      const data = await res.text();
      const integrity = data.length > 0 ? 100 : 0;

      if (integrity < SYNTACTIC_INTEGRITY_THRESHOLD) {
        console.log(`Integrity check failed: ${integrity}`);
        return;
      }

      if (CUSTOM_NODE_ENDPOINT) {
        await fetch(CUSTOM_NODE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, integrity, ts: Date.now() })
        });
      }

      const pushResults = await Promise.allSettled([
        pushGitHub(data, env.GITHUB_TOKEN),
        pushLinkedIn(data, env.LINKEDIN_TOKEN),
        pushFacebook(data, env.FACEBOOK_TOKEN)
      ]);

      const failed = pushResults.filter(r => r.status === "rejected");
      const succeeded = pushResults.length - failed.length;

      if (DISCORD_WEBHOOK_URL) {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: "LYSANDER Node Poll",
              description: `Integrity: ${integrity}\nPushed: ${succeeded}/${pushResults.length}`,
              color: failed.length > 0 ? 15158332 : 5814783,
              fields: failed.map(f => ({ name: "Error", value: String(f.reason).substring(0, 1000) })),
              timestamp: new Date().toISOString()
            }]
          })
        });
      }
    } catch (err) {
      console.error("LYSANDER error:", err);
      const DISCORD_WEBHOOK_URL = env.DISCORD_WEBHOOK_URL || "";
      if (DISCORD_WEBHOOK_URL) {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `LYSANDER ERROR: ${err.message}` })
        });
      }
    }
  },
  async fetch(request, env, ctx) {
    return new Response("LYSANDER-NODE ONLINE", { status: 200 });
  }
}

async function pushGitHub(data, token) {
  if (!token) throw new Error("GITHUB_TOKEN missing");
  const repo = "jhammerz/jhammerz.github.io";
  const path = "lysander/latest.txt";
  const content = btoa(`LYSANDER UPDATE ${new Date().toISOString()}\n\n${data}`);
  
  let sha;
  const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: { "Authorization": `Bearer ${token}`, "User-Agent": "Lysander-node" }
  });
  if (getRes.status === 200) {
    const json = await getRes.json();
    sha = json.sha;
  } else if (getRes.status !== 404) {
    throw new Error(`GitHub GET ${getRes.status}: ${await getRes.text()}`);
  }
  
  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "User-Agent": "Lysander-node",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "LYSANDER automated push",
      content: content,
      branch: "main",
      ...(sha && { sha })
    })
  });
  if (!putRes.ok) throw new Error(`GitHub PUT ${putRes.status}: ${await putRes.text()}`);
}

async function pushLinkedIn(data, token) {
  if (!token) return;
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      author: "urn:li:person:PERSON_URN",
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: data.substring(0, 3000) },
          shareMediaCategory: "NONE"
        }
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    })
  });
  if (!res.ok) throw new Error(`LinkedIn ${res.status}: ${await res.text()}`);
}

async function pushFacebook(data, token) {
  if (!token) return;
  const res = await fetch("https://graph.facebook.com/v18.0/PAGE_ID/feed", {
    method: "POST",
    body: new URLSearchParams({
      message: data.substring(0, 5000),
      access_token: token
    })
  });
  if (!res.ok) throw new Error(`Facebook ${res.status}: ${await res.text()}`);
}
