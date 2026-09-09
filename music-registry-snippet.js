// SOVEREIGN MUSIC REGISTRY - AMENDED - UID 0 ATTAINED
// Fixes blank player on mobile + desktop - forces render
window.SOVEREIGN_MUSIC_REGISTRY = [
  {"hfid":"m001","title":"I'm Going To Be Somebody","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m002","title":"Where Did You Sleep Last Night","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m003","title":"That Smell","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m004","title":"The Crow And The Butterfly","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m005","title":"Iris","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m006","title":"The Heyoka","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m007","title":"Super Secret unnamed track 1","release_date":"2025-10","block":"CONFIRMED","verified":true},
  {"hfid":"m008","title":"Perception of Personification - Track 1","release_date":"2024-11-12","block":"CONFIRMED","verified":true},
  {"hfid":"m009","title":"Perception of Personification - Track 2","release_date":"2024-11-12","block":"CONFIRMED","verified":true},
  {"hfid":"m010","title":"The Resonance of Personification","release_date":"2024-11-12","block":"CONFIRMED","verified":true},
  {"hfid":"m011","title":"Mama take this badge from me","release_date":"2024-11-12","block":"CONFIRMED","verified":true},
  {"hfid":"m012","title":"Ain't Nothin' But A Day To Die","release_date":"2025","block":"CONFIRMED","verified":true},
  {"hfid":"m013","title":"Clear Skyes to Nevermore","release_date":"2026-01-TBD","block":"CONFIRMED","verified":true},
  {"hfid":"m014","title":"What It's Like","release_date":"2025-12-28","block":"CONFIRMED","verified":true}
];

// Loader that feels good on both mobile + desktop
(function(){
  const reg = window.SOVEREIGN_MUSIC_REGISTRY;
  const container = document.getElementById('spotify-embed') || document.getElementById('music-player') || document.querySelector('.music-player');
  if(!container) return;
  
  // If it's an iframe, force load Spotify artist
  if(container.tagName === 'IFRAME'){
    container.src = "https://open.spotify.com/embed/artist/7vRd2ECdeuEYYtyqW2Ba79?utm_source=generator&theme=0";
    container.style.minHeight = "420px";
    container.style.borderRadius = "12px";
    container.setAttribute('allow','autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    container.setAttribute('loading','eager'); // feel instant
    return;
  }
  
  // If it's a div, render track list + player
  container.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/7vRd2ECdeuEYYtyqW2Ba79?utm_source=generator&theme=0" width="100%" height="420" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"></iframe>`;
})();
