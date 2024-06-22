const express = require('express');
const unirest = require('unirest'); // Ensure 'unirest' is installed via npm

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint for initiating STK push
app.post('/stkpush', async (req, res) => {
  try {
    const response = await unirest.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
      .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_access_token_here' // Replace with actual token
      })
      .send({
        // STK Push request payload
        "BusinessShortCode": 174379,
        "Password": "your_generated_password_here",
        "Timestamp": "20240622232532",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": 1,
        "PartyA": 2547596389,
        "PartyB": 174379,
        "PhoneNumber": 2547596389,
        "CallBackURL": "https://yourdomain.com/callback",
        "AccountReference": "CompanyXLTD",
        "TransactionDesc": "Payment of X"
      });

    console.log(response.body);
    res.status(200).json(response.body);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
