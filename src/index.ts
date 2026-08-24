import { DurableObject } from "cloudflare:workers";

export interface Env {
  AGENT_STATE_LEDGER: KVNamespace;
  AGENT_ORCHESTRATOR: DurableObjectNamespace<om>;
}

// ⚡ SQLite Durable Object class 'om'
export class om extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/do-health") {
      return new Response(JSON.stringify({ status: "ORCHESTRATOR_ONLINE" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Lysander Agent Orchestrator Running", { status: 200 });
  }
}

// 🧠 Main Worker Fetch Entrypoint
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "ROOT_AUTHORITY_ACTIVE",
          worker: "lysander-v13",
          agent: "Lysander-3.0-Sovereign",
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // DO Orchestrator test route
    if (url.pathname.startsWith("/orchestrator")) {
      const id = env.AGENT_ORCHESTRATOR.idFromName("primary");
      const stub = env.AGENT_ORCHESTRATOR.get(id);
      return stub.fetch(request);
    }

    // KV State Ledger route
    if (url.pathname === "/ledger") {
      const state = (await env.AGENT_STATE_LEDGER.get("last_sync")) || "UNSET";
      return new Response(JSON.stringify({ last_sync: state }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
