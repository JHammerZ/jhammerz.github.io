// lysander-v13: Concurrent Agent & Worker Task Bridge Core
// Author: Joshua Hamilton (JHammerZ)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Redirect inbound routing pathways to the Durable Object Orchestration Hub
    if (url.pathname.startsWith("/agent/")) {
      const id = env.AGENT_ORCHESTRATOR.idFromName("global_control_room");
      const stub = env.AGENT_ORCHESTRATOR.get(id);
      return stub.fetch(request);
    }

    return new Response(JSON.stringify({
      status: "ACTIVE",
      system: "lysander-v13",
      message: "Multi-Agent Gateway Ready. Dispatch requests to /agent/:id"
    }), { headers: { "Content-Type": "application/json" } });
  }
};

// 🏛️ The "om" Durable Object State Engine Class
export class om {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const agentId = pathParts[2] || "unknown_worker";

    // Handle concurrent task distribution matrices
    if (request.method === "POST") {
      const taskPayload = await request.json();
      const taskTimestamp = new Date().toISOString();

      // Store individual asynchronous worker states concurrently
      await this.state.storage.put(`worker_task:${agentId}:${taskTimestamp}`, {
        payload: taskPayload,
        status: "PROCESSING_ASYNC",
        velocity: "<10ms"
      });

      // Update the Global KV Ledger tracking matrix simultaneously 
      await this.env.AGENT_STATE_LEDGER.put(`active_node:${agentId}`, "BUSY");

      return new Response(JSON.stringify({
        success: true,
        node: "lysander-v13",
        allocated_agent: agentId,
        execution_state: "ORCHESTRATION_LAYER_DISPATCHED",
        timestamp: taskTimestamp
      }), { headers: { "Content-Type": "application/json" } });
    }

    // Retrieve active worker nodes list
    const activeTasks = await this.state.storage.list({ prefix: `worker_task:${agentId}` });
    return new Response(JSON.stringify(Object.fromEntries(activeTasks)), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
