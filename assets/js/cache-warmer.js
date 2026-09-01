/**
 * AAD Cache-Warmer v1.0.0
 * Autonomous Edge Node Pre-fetching Engine.
 * Pre-warms edge data matrices to handle viral load spikes smoothly.
 */
(function() {
  const ASSET_MANIFEST = [
    '/entities.json',
    '/.well-known/hfid/graph-mesh.json',
    '/assets/js/edge-caster-v2.js'
  ];

  function warmGlobalCacheMatrix() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Dispatch background pre-fetch tasks straight to active worker cache
      navigator.serviceWorker.controller.postMessage({
        action: 'PRE_WARM_ASSETS',
        urls: ASSET_MANIFEST
      });
    } else {
      // Fallback: Parallel asynchronous link pre-fetching via browser idle thread
      const dispatcher = window.requestIdleCallback || function(cb) { setTimeout(cb, 100); };
      dispatcher(() => {
        ASSET_MANIFEST.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          document.head.appendChild(link);
        });
        console.log("[✓] Asymmetric Algorithmic Domination Cache Matrices Warmed Successfully.");
      });
    }
  }

  if (document.readyState === 'complete') {
    warmGlobalCacheMatrix();
  } else {
    window.addEventListener('load', warmGlobalCacheMatrix);
  }
})();
