module.exports = (req, res) => {
    console.log('Received confirmation request:', req.body);
    // Handle payment confirmation logic here
    res.status(200).json({ message: 'Payment confirmation received' });
};
