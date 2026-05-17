// Configuration parameters from your TikTok Developer Console
const CLIENT_KEY = 'ARCHITECT_ACCESS_KEY'; // Replace with your production Client Key
const REDIRECT_URI = 'https://jhammerz.github.io/'; // Must match developer dashboard exactly

// Explicit permission scopes required to manage videos outside of a sandbox
const scopes = [
  'user.info.basic',
  'video.list',
  'video.publish'
].join(',');

// Cryptographically secure random string to prevent Cross-Site Request Forgery (CSRF)
const secureState = Math.random().toString(36).substring(2, 15);

const productionAuthUrl = https://tiktok.com +
  ?client_key=${CLIENT_KEY} +
  &scope=${scopes} +
  &response_type=code +
  &redirect_uri=${encodeURIComponent(REDIRECT_URI)} +
  &state=${secureState};

console.log('=== PRODUCTION OAUTH 2.0 LINK GENERATED ===\n');
console.log('Direct your users to this URL to log in and authorize your app:\n');
console.log(productionAuthUrl);
console.log('\n=============================================');
