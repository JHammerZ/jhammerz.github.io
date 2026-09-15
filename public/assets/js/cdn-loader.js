/* ==========================================================================
   LYSANDER DOM HYDRATION ENGINE // ASYNCHRONOUS PLAYLIST STREAMER // V4.2
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const mediaGrid = document.getElementById("dynamic-media-grid");
  if (!mediaGrid) return;

  console.log("Initializing dynamic media tree hydration loop...");

  // Fetch the programmatically generated structural manifest map over the network
  fetch("assets/playlist.json")
    .then(response => {
      if (!response.ok) throw new Error("Network response manifest lookup failed.");
      return response.json();
    })
    .then(data => {
      if (data.total_tracks_buffered === 0) {
        mediaGrid.innerHTML = '<p class="text-muted">▲ No active audio tracks discovered in edge cache hubs.</p>';
        return;
      }

      mediaGrid.innerHTML = ""; // Clear static layout placeholders securely

      // Intercept data rows and map them into the visual layout grid matrix
      data.playlist_registry.forEach(track => {
        const card = document.createElement("div");
        card.className = "track-card";
        card.innerHTML = `
          <div class="track-meta">
            <h3>${track.title}</h3>
            <p>ID: ${track.id} // Format Signature: ${track.codec_signature} (${track.file_size_formatted})</p>
          </div>
          <div class="player-controls">
            <button class="play-btn" id="btn-${track.id}" onclick="playAudio('${track.path}', '${track.id}')">▶</button>
            <div class="progress-container">
              <div class="progress-bar" id="bar-${track.id}"></div>
            </div>
          </div>
        `;
        mediaGrid.appendChild(card);
      });
      console.log(`✓ successfully hydrated ${data.total_tracks_buffered} audio nodes into the client frame.`);
    })
    .catch(error => {
      console.error("CRITICAL: Failed to mount media manifest data stream:", error);
    });
});
