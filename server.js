const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for handling validation requests
app.use('/api/validation', require('./api/validation'));

// Route for handling confirmation requests
app.use('/api/confirmation', require('./api/confirmation'));

// Route for C2B payment
app.post('/api/c2b-payment', async (req, res) => {
    const { phone_number, amount } = req.body;
    const shortCode = '4317082';
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const consumerKey = 'zXUpzX3VM4ES9NRnMG80Qkaz3Xj58bGP0A2mETvcJslNALv5';
    const consumerSecret = 'rlM19wspOGOvhsWuMfg2BO0Y8ia3EbEsnCb5iHFidSQF25lxsLsuwzlMvAhV2z7k';
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

// Start the server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
