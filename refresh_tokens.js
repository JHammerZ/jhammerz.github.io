const axios = require('axios');

/**
 
Automatically requests a fresh 24-hour access token from the production gateway,
@param {string} currentRefreshToken - The active 1-year refresh token currently in your storage*/,
async function rotateProductionTokens(currentRefreshToken) {

  // TikTok OAuth requires variables encoded as application/x-www-form-urlencoded
  const payload = new URLSearchParams();
  payload.append('client_key', 'your_client_key_here');       // Replace with production Client Key
  payload.append('client_secret', 'your_client_secret_here'); // Replace with production Client Secret
  payload.append('grant_type', 'refresh_token');
  payload.append('refresh_token', currentRefreshToken.trim());

  console.log('Sending token rotation payload to production gateway...');

  try {
    const response = await axios.post(
      'https://tiktokapis.com/',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('\n=== PRODUCTION TOKEN ROTATION SUCCESS ===');
    console.log(JSON.stringify(response.data, null, 2));

    /* 
      CRITICAL DEVELOPER LOGIC:
      The response.data object will contain:
      
access_token: Your brand-new 24-hour token for queries and posts.
refresh_token: A NEW 1-year refresh token.

You must IMMEDIATELY overwrite your old stored tokens with these new strings.*/,
,

  } catch (error) {
    console.error('\n=== TOKEN ROTATION FAILURE ===');
    if (error.response) {
      console.error(Gateway Status: ${error.response.status});
      console.error('Server Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Transport Error:', error.message);
    }
  }
}

// Example Execution: Pass your stored long-term refresh token here
// rotateProductionTokens('rft.example_refresh_token_string');
