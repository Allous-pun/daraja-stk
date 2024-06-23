const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('Received validation request:', req.body);
    res.status(200).json({ message: 'Validation successful' });
});

module.exports = router;
