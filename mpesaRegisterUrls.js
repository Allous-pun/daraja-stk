// mpesaRegisterUrls.js

const axios = require('axios');
const validationUrl = 'https://your-vercel-app.vercel.app/api/validation'; // Replace with your actual URL
const confirmationUrl = 'https://your-vercel-app.vercel.app/api/confirmation'; // Replace with your actual URL

async function mpesaRegisterUrls() {
    const payload = {
        ShortCode: '4317082', // Replace with your Paybill or Till number
        ResponseType: 'Complete', // Options: Completed, Cancelled
        ConfirmationURL: confirmationUrl,
        ValidationURL: validationUrl
    };

    try {
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl', payload, {
            auth: {
                username: process.env.MPESA_CONSUMER_KEY, // Use environment variables
                password: process.env.MPESA_CONSUMER_SECRET // Use environment variables
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

