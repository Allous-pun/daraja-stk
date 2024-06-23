const express = require('express');
const bodyParser = require('body-parser');
const mpesaRegisterUrls = require('./mpesaRegisterUrls'); // Import your function for registering M-Pesa URLs
const validationHandler = require('./validation'); // Import validation endpoint handler
const confirmationHandler = require('./confirmation'); // Import confirmation endpoint handler

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for handling validation requests
app.post('/validation', validationHandler);

// Route for handling confirmation requests
app.post('/confirmation', confirmationHandler);

// Function to register URLs with M-Pesa (defined elsewhere)
// Uncomment the following line to register URLs when server starts
// mpesaRegisterUrls();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
