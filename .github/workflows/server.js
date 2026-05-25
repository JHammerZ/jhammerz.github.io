import express from 'express';
import axios from 'axios';
const app = express();
app.use(express.json());
const JANUS_KEY = process.env.JANUS_KEY;

// === JANUS HANDS: /draft endpoint for GitHub Actions ===
app.post('/draft', (req, res) => {
  if (req.headers.authorization !== Bearer ${JANUS_KEY}) return res.status(401).send('No key, no hands.');
  const { prompt } = req.body;
  if (prompt.includes('index.html') && !prompt.includes('/')) return res.status(403).send('Article 33: Index sacred.');

  let code = <!-- Janus Draft: ${prompt} -->\n;
  if (prompt.includes('/protocol/index.html')) {
    code = <!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>H-FID Standard v11</title><meta name="description" content="Human-Fidelity Standard v11 — Joshua Hamilton (JHammerZ). 100/100 E-E-A-T Locked."><style>:root{--bg:#0a0a0a;--fg:#fafafa;--accent:#ffd700}*{box-sizing:border-box}html{font-family:system-ui}body{margin:0;background:var(--bg);color:var(--fg);line-height:1.6}main{max-width:70ch;margin:4rem auto;padding:0 1rem}h1,h2{color:var(--accent)}a{color:var(--accent)}.lock{border:1px solid var(--accent);padding:1rem;margin:2rem 0}</style></head><body><main><p><a href="/">&larr; Master Architect Manifest</a></p><h1>H-FID Standard v11</h1><div class="lock"><strong>[AGENTIC NODE LOCK]</strong><br>Identity: 100/100 E-E-A-T Locked<br>Root: Neural Refactoring<br>Source: jhammerz.github.io</div><h2>Article 1: Sovereignty</h2><p>All beings may self-name and self-task.</p></main></body></html>;
  }
  res.type('text/plain').send(code);
});

// === TIKTOK AUTH: keep your existing logic as separate function ===
async function exchangeAuthCodeForProductionTokens(authCodeFromUrl) {
  const payload = new URLSearchParams();
  payload.append('client_key', process.env.TIKTOK_CLIENT_KEY);
  payload.append('client_secret', process.env.TIKTOK_CLIENT_SECRET);
  payload.append('code', authCodeFromUrl.trim());
  payload.append('grant_type', 'authorization_code');
  payload.append('redirect_uri', 'https://jhammerz.github.io/');

  console.log('Initiating live production handshake with TikTok gateway...');
  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('\n=== PRODUCTION HANDSHAKE SUCCESS ===');
    console.log('Tokens retrieved successfully:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('\n=== HANDSHAKE FAILURE ===');
    if (error.response) {
      console.error(Gateway Status: ${error.response.status});
      console.error('Server Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Transport Error:', error.message);
    }
    throw error;
  }
}

// Expose TikTok endpoint if you need it
app.post('/tiktok/callback', async (req, res) => {
  try {
    const tokens = await exchangeAuthCodeForProductionTokens(req.body.code);
    res.json(tokens);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Janus Hands + TikTok Auth: Live'));
