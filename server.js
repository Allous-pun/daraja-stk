const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a default route handler for GET requests to "/"
app.get('/', (req, res) => {
  res.send('Welcome to the C2B payment system'); // Example response
});

// Endpoint for initiating C2B payment
app.post('/c2b-payment', async (req, res) => {
  try {
    const access_token = await getAccessToken();

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
      {
        ShortCode: process.env.SHORTCODE,
        CommandID: 'CustomerPayBillOnline',
        Amount: req.body.amount,
        Msisdn: req.body.phone_number,
        BillRefNumber: 'account_number'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to get access token from Safaricom
async function getAccessToken() {
  try {
    const { data } = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: process.env.CONSUMER_KEY,
          password: process.env.CONSUMER_SECRET
        }
      }
    );

    return data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token');
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
