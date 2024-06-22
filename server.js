require('dotenv').config();
const express = require('express');
const unirest = require('unirest');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to authenticate and obtain access token
app.get('/authenticate', async (req, res) => {
    const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await unirest.post('https://sandbox.safaricom.co.ke/oauth/v1/generate')
            .headers({
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            })
            .send();

        res.json(response.body);
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send(error.message);
    }
});

// Endpoint to initiate STK push
app.post('/stkpush', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    const { SHORTCODE, PASSKEY, CALLBACK_URL } = process.env;

    try {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

        const response = await unirest.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
            .headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}` // Replace with your actual access token
            })
            .send({
                "BusinessShortCode": SHORTCODE,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phoneNumber,
                "PartyB": SHORTCODE,
                "PhoneNumber": phoneNumber,
                "CallBackURL": CALLBACK_URL,
                "AccountReference": "CompanyXLTD", // Replace with your actual account reference
                "TransactionDesc": "Payment of X" // Replace with your actual transaction description
            });

        res.json(response.body);
    } catch (error) {
        console.error('Error during STK push:', error);
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
