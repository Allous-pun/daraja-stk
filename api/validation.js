module.exports = (req, res) => {
    console.log('Received validation request:', req.body);
    res.status(200).json({ message: 'Validation successful' });
};
