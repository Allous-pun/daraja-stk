const axios = require('axios');
require('dotenv').config();

const validationUrl = 'https://daraja-stk.vercel.app/api/validation';
const confirmationUrl = 'https://daraja-stk.vercel.app/api/confirmation';

// Function to get access token
async function getAccessToken() {
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response.data);
        throw new Error('Failed to obtain access token');
    }
}

// Function to register URLs
async function mpesaRegisterUrls() {
    const accessToken = await getAccessToken();

    const payload = {
        ShortCode: process.env.SHORTCODE,
        ResponseType: 'Completed',
        ConfirmationURL: confirmationUrl,
        ValidationURL: validationUrl
    };

    try {
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl', payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Registration response:', response.data);
    } catch (error) {
        console.error('Error registering URLs:', error.response.data);
    }
}

module.exports = mpesaRegisterUrls;
