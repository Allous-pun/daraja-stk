// confirmation.js

// Handler function for confirmation endpoint
module.exports = async (req, res) => {
    console.log('Received confirmation request:', req.body);
    // Handle payment confirmation logic here
    // Update your database or trigger necessary actions
    res.status(200).json({ message: 'Payment confirmation received' });
};

