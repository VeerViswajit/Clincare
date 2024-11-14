const jwt = require('jsonwebtoken');

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Extract the token part from "Bearer <token>"

//     if (!token) {
//         return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: true, message: "Unauthorized: Invalid token" });
//         }
//         req.user = user; // Store the decoded user info in the request
//         next();
//     });
// }



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Token missing");
        return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
    }

    

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            
            return res.status(403).json({ error: true, message: "Unauthorized: Invalid token" });
        }
        req.user = user;
        next();
    });
}
module.exports = { authenticateToken };