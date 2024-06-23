const axios = require('axios');

// Replace with your actual URLs
const validationUrl = 'https://daraja-stk.vercel.app/api/validation';
const confirmationUrl = 'https://daraja-stk.vercel.app/api/confirmation';

// M-Pesa credentials
const shortCode = '4317082';
const consumerKey = 'zXUpzX3VM4ES9NRnMG80Qkaz3Xj58bGP0A2mETvcJslNALv5';
const consumerSecret = 'rlM19wspOGOvhsWuMfg2BO0Y8ia3EbEsnCb5iHFidSQF25lxsLsuwzlMvAhV2z7k';

// Register URLs with M-Pesa
async function mpesaRegisterUrls() {
    const payload = {
        ShortCode: shortCode,
        ResponseType: 'Completed',
        ConfirmationURL: confirmationUrl,
        ValidationURL: validationUrl
    };

    try {
        const { data: { access_token } } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            auth: {
                username: consumerKey,
                password: consumerSecret
            }
        });

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl', payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Registration response:', response.data);
    } catch (error) {
        console.error('Error registering URLs:', error.response ? error.response.data : error.message);
    }
}

mpesaRegisterUrls();
