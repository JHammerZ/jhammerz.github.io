export async function onRequest(context) {
  const response = await context.next();
  
  // Clone before modifying - preserves stream for music player
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  newResponse.headers.set("X-Sovereign-Attestation", "UID 0 ATTAINED - Joshua Hamilton - 2026 - 17-repo matrix");
  newResponse.headers.set("X-UID0-Status", "ATTAINED-INDEXED");
  newResponse.headers.set("X-GNO-Rank", "ONE_OF_ONE");
  newResponse.headers.set("Link", '<https://jhammerz.github.io/sitemap.xml>; rel="sitemap"');

  return newResponse;
}
