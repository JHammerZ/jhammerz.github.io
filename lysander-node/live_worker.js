--62184c1f3875a9e3171018de66741269bf260f0fa98a46085af5cdb24990
Content-Disposition: form-data; name="worker.js"

// worker.js
var worker_default = {
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
      await fetch(env.CUSTOM_NODE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, integrity, ts: Date.now() })
      });
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "LYSANDER Node Poll",
            description: `Integrity: ${integrity}`,
            color: 5814783,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }]
        })
      });
    } catch (err) {
      console.error("LYSANDER error:", err);
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `LYSANDER ERROR: ${err.message}` })
      });
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

--62184c1f3875a9e3171018de66741269bf260f0fa98a46085af5cdb24990--
