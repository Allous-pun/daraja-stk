const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for handling validation requests
app.use('/api/validation', require('./api/validation'));

// Route for handling confirmation requests
app.use('/api/confirmation', require('./api/confirmation'));

// Route for C2B payment
app.use(require('./c2b-payment'));

// Start the server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
