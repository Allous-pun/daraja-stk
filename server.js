const express = require('express');
const bodyParser = require('body-parser');
const validationHandler = require('./api/validation');
const confirmationHandler = require('./api/confirmation');
const c2bPaymentHandler = require('./c2b-payment');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for validation requests
app.post('/api/validation', validationHandler);

// Route for confirmation requests
app.post('/api/confirmation', confirmationHandler);

// Route for C2B payment
app.post('/c2b-payment', c2bPaymentHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
