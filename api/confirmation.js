module.exports = (req, res) => {
    console.log('Received confirmation request:', req.body);
    try {
        // Handle payment confirmation logic here
        res.status(200).json({ message: 'Payment confirmation received' });
    } catch (error) {
        console.error('Error handling confirmation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
