const axios = require('axios');

// This function must trigger automatically when your callback URL receives the ?code= parameter
async function exchangeAuthCodeForProductionTokens(authCodeFromUrl) {

  // TikTok OAuth requires variables encoded as application/x-www-form-urlencoded
  const payload = new URLSearchParams();
  payload.append('client_key', 'HXA_SOVEREIGN_TOKEN'); // Replace with production Client Key
  payload.append('client_secret', 'ARCHITECT_ACCESS_KEY'); // Replace with production Client Secret
  payload.append('code', authCodeFromUrl.trim());
  payload.append('grant_type', 'authorization_code');
  payload.append('redirect_uri', 'https://jhammerz.github.io'/); // Must match Step 1 exactly

  console.log('Initiating live production handshake with TikTok gateway...');

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

    console.log('\n=== PRODUCTION HANDSHAKE SUCCESS ===');
    console.log('Tokens retrieved successfully:');
    console.log(JSON.stringify(response.data, null, 2));

    /* 
      The server response will contain:
      
open_id: The unique production identifier for that user
access_token: Your 24-hour token to run live queries
refresh_token: Your 1-year token used to rotate the access_token automatically,
*/,
,

  } catch (error) {
    console.error('\n=== HANDSHAKE FAILURE ===');
    if (error.response) {
      console.error(Gateway Status: ${error.response.status});
      console.error('Server Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Transport Error:', error.message);
    }
  }
}

// Example Execution: Replace with the actual code string parsed from your live browser URL callback
// exchangeAuthCodeForProductionTokens('clt.example_authorization_code_string');
