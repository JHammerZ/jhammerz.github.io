export class W4Room {
  constructor(state, env) {
    this.storage = state.storage;
    this.sql = state.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS messages 
      (id INTEGER PRIMARY KEY, user TEXT, msg TEXT, ts INTEGER)`);
  }
  
  async fetch(request) {
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    
    server.addEventListener("message", async (evt) => {
      this.sql.exec(`INSERT INTO messages (user,msg,ts) VALUES (?,?,?)`, 
        "anon", evt.data, Date.now());
      server.send(`ACK: ${evt.data}`);
    });
    
    const rows = this.sql.exec(`SELECT * FROM messages ORDER BY ts DESC LIMIT 50`).toArray();
    server.send(JSON.stringify({history: rows}));
    
    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/ws/")) {
      const name = url.pathname.split("/")[3] || "global";
      const id = env.W4_ROOM.idFromName(name);
      const stub = env.W4_ROOM.get(id);
      return stub.fetch(request);
    }
    return new Response("Lysander W4 9.0/10");
  }
}
