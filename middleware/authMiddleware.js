const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    try {
        // 1. Retrieve the Authorization header
        const authHeader = req.headers['authorization'];

        // 2. Check if the Authorization header exists and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Access Denied. No token provided or invalid format.');
        }

        // 3. Extract the token
        const token = authHeader.split(' ')[1];

        // 4. Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send('Invalid or expired token.');
            }

            // 5. Attach decoded token payload to request object
            req.user = decoded;

            // 6. Proceed to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.error('Error in authenticateToken middleware:', error);
        res.status(500).send('Internal Server Error.');
    }
};

module.exports = authenticateToken;
