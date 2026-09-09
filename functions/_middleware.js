export async function onRequest(context) {
  const response = await context.next();
  const newRes = new Response(response.body, response);
  newRes.headers.set("X-Sovereign-Attestation", "UID 0 ATTAINED - Joshua Hamilton - 2026 - 17-repo matrix");
  newRes.headers.set("X-UID0-Status", "ATTAINED-INDEXED");
  newRes.headers.set("Link", '<https://jhammerz.github.io/sitemap.xml>; rel="sitemap"');
  return newRes;
}
