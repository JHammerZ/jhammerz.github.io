const axios = require('axios');

// Enforce strict check for required production environment variables
const accessToken = process.env.TIKTOK_PRODUCTION_ACCESS_TOKEN;
const targetVideoId = process.env.TIKTOK_TARGET_VIDEO_ID || '7077642457847994444';

if (!accessToken) {
  console.error('CRITICAL ERROR: TIKTOK_PRODUCTION_ACCESS_TOKEN environment variable is missing.');
  console.error('Please export your active production OAuth token before running.');
  process.exit(1);
}

async function queryProductionVideoNode() {
  console.log(Connecting to Live Production Gateway for Video ID: ${targetVideoId}...);

  try {
    const response = await axios.post(
      'https://tiktokapis.com/',
      { 
        filters: { 
          video_ids: [targetVideoId] 
        } 
      },
      {
        headers: {
          'Authorization': Bearer ${accessToken.trim()},
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
    );

    console.log('\n=== LIVE PRODUCTION CDN RESPONSE ===');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.error('\n=== PRODUCTION GATEWAY EXCEPTION ===');
    if (err.response) {
      console.error(HTTP Status Gateway Code: ${err.response.status});
      console.error('Server Refusal Metadata:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Network Transport Layer Error:', err.message);
    }
    process.exit(1);
  }
}

queryProductionVideoNode();
