const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get the token from the request header
    const authHeader = req.header('Authorization');

    // 2. Check if no token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. Verify the token
    try {
        const token = authHeader.split(' ')[1]; // Extracts the token after 'Bearer '
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user info from the token payload to the request
        req.user = decoded.user;
        next(); // This tells Express to move on to the actual route
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};