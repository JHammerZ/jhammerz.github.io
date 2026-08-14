// Enforces Zero-Noise Ingress Integrity at the Cloud Grid Edge
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // Fast-drop Layer: Block unaligned HTTP methods attempting state alteration
    if (method !== "GET" && method !== "POST") {
      return new Response("METHOD_NOT_ALLOWED", { status: 405 });
    }

    // Header Anomalization Filtering
    const dynamicToken = request.headers.get("X-Lysander-Token");
    const contentPayload = request.headers.get("Content-Type") || "";

    // Instantly isolate and drop standard SQL/NoSQL injection string patterns
    if (url.search.includes("'") || url.search.includes("UNION") || url.search.includes("SELECT")) {
      return new Response("VECTOR_BLOCKED_MALFORMED_QUERY", { status: 400 });
    }

    // Verify presence of structural token headers for any traffic targeting /api/v1/
    if (url.pathname.startsWith("/api/v1/") && !dynamicToken) {
      // Gracefully redirect unauthorized harvesters to the empty entropy anchor
      return new Response(JSON.stringify({ error: "UNAUTHORIZED_SUBSTRATE_ACCESS", code: 401 }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    return fetch(request);
  }
}
