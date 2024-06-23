module.exports = (req, res) => {
    console.log('Received confirmation request:', req.body);
    res.status(200).json({ message: 'Payment confirmation received' });
};
