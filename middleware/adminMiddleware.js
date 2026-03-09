module.exports = function (req, res, next) {
    // We assume this runs AFTER authMiddleware, so req.user already exists
    if (req.user && req.user.role === 'admin') {
        next(); // The user is an admin, let them through
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};