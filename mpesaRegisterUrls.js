const axios = require('axios');
require('dotenv').config();

const validationUrl = 'https://daraja-stk.vercel.app/api/validation';
const confirmationUrl = 'https://daraja-stk.vercel.app/api/confirmation';

async function mpesaRegisterUrls() {
    const payload = {
        ShortCode: process.env.SHORTCODE,
        ResponseType: 'Completed', 
        ConfirmationURL: confirmationUrl,
        ValidationURL: validationUrl
    };

    try {
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl', payload, {
            auth: {
                username: process.env.CONSUMER_KEY,
                password: process.env.CONSUMER_SECRET
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Registration response:', response.data);
    } catch (error) {
        console.error('Error registering URLs:', error.response.data);
    }
}

module.exports = mpesaRegisterUrls;
