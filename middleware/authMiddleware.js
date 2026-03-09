const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from request header
    const authHeader = req.header('Authorization');

    // Checking token existence
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verifing token
    try {
        const token = authHeader.split(' ')[1]; // Extracting  token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info from payload
        req.user = decoded.user;
        next(); // move express to actual route
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};