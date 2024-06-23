// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mpesaRegisterUrls = require('./mpesaRegisterUrls');
const validationHandler = require('./api/validation');
const confirmationHandler = require('./api/confirmation');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for handling validation requests
app.post('/api/validation', validationHandler);

// Route for handling confirmation requests
app.post('/api/confirmation', confirmationHandler);

// Uncomment the following line to register URLs when server starts
// mpesaRegisterUrls();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

