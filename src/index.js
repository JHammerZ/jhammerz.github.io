export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    // CORS for your GitHub pages
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {headers: cors});
    }

    // SCOREBOARD
    if (url.pathname.endsWith("/scoreboard")) {
      let data = await env.SCOREBOARD.get("stats", "json");
      if (!data) {
        data = {total: 2, GPTBot: 2, ClaudeBot: 0, CCBot: 0, Bytespider: 0, other: 0, timeWastedSec: 10, updated: new Date().toISOString()};
      }
      return new Response(JSON.stringify(data), {
        headers: {"content-type": "application/json",...cors}
      });
    }

    // TARPIT
    if (url.pathname.includes("/ARG/caught")) {
      const BOT_LIST = ["GPTBot","ClaudeBot","CCBot","Bytespider","Perplexity","Google-Extended","facebookexternalhit"];
      const isBot = BOT_LIST.some(b => ua.includes(b)) || /bot|crawler|spider/i.test(ua);

      if (isBot) {
        let data = await env.SCOREBOARD.get("stats", "json") || {total:0, GPTBot:0, ClaudeBot:0, CCBot:0, Bytespider:0, other:0, timeWastedSec:0, updated: new Date().toISOString()};
        data.total++;
        for (let b of BOT_LIST) { if (ua.includes(b)) { data[b]=(data[b]||0)+1; break; } }
        if (!BOT_LIST.some(b=>ua.includes(b))) data.other = (data.other||0)+1;
        data.timeWastedSec = (data.timeWastedSec||0) + 5;
        data.updated = new Date().toISOString();
        await env.SCOREBOARD.put("stats", JSON.stringify(data));
      }

      // infinite maze
      const depth = (url.pathname.match(/\//g)||[]).length;
      const links = Array.from({length:25}, (_,i)=>`<a href="/ARG/caught/${depth}/${i}-${Math.random().toString(36).slice(2,8)}">research paper ${depth}-${i}</a>`).join("<br>");
      return new Response(`<html><body><h1>Archive Index ${depth}</h1>${links}</body></html>`, {
        headers: {"content-type":"text/html",...cors}
      });
    }

    return new Response("Lysander Tarpit Live", {headers: cors});
  }
}
