const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Token missing");
        return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Invalid token");
            return res.status(403).json({ error: true, message: "Unauthorized: Invalid token" });
        }
        
        // Log the decoded user data to see its structure
        console.log("Decoded user data:", user);

        // Check if the user object is wrapped inside another 'user' property
        req.user = user.user ? user.user : user;

        next();
    });
}

module.exports = { authenticateToken };
