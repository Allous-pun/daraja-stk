const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for C2B payment initiation
app.post('/api/c2b-payment', async (req, res) => {
    const { phone_number, amount } = req.body;
    const shortCode = '4317082'; // Replace with your Paybill or Till number
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Replace with your passkey
    const consumerKey = 'zXUpzX3VM4ES9NRnMG80Qkaz3Xj58bGP0A2mETvcJslNALv5'; // Replace with your M-Pesa Consumer Key
    const consumerSecret = 'rlM19wspOGOvhsWuMfg2BO0Y8ia3EbEsnCb5iHFidSQF25lxsLsuwzlMvAhV2z7k'; // Replace with your M-Pesa Consumer Secret
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, -3);
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

    try {
        // Get OAuth token
        const { data: { access_token } } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            auth: {
                username: consumerKey,
                password: consumerSecret
            }
        });

        // Initiate payment
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phone_number,
            PartyB: shortCode,
            PhoneNumber: phone_number,
            CallBackURL: 'https://daraja-stk.vercel.app/api/confirmation',
            AccountReference: 'Test123',
            TransactionDesc: 'Payment for testing'
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error initiating payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to initiate payment', error: error.response ? error.response.data : error.message });
    }
});

module.exports = app;

