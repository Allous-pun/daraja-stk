require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Daraja STK Push API');
});

app.get('/authenticate', async (req, res) => {
    const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send(error.message);
    }
});

app.post('/stkpush', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    const { SHORTCODE, PASSKEY, CALLBACK_URL } = process.env;

    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    try {
        console.log('Starting STK push request');
        const { data: { access_token } } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        console.log('Access token received:', access_token);

        const stkPushPayload = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: CALLBACK_URL,
            AccountReference: 'Test123',
            TransactionDesc: 'Payment for XYZ'
        };

        console.log('Sending STK push request with payload:', stkPushPayload);

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkPushPayload, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        console.log('STK push response received:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error during STK push:', error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            res.status(500).send(error.request);
        } else {
            res.status(500).send(error.message);
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
