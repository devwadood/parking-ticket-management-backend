require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function authenticateMiddleware(req, res, next) {
  // Extract the token from the request headers or other sources
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  // Verify the token
  const tokenString=token.split(" ");

  jwt.verify(tokenString[1], process.env.JWT_SECRET, (err, decoded) => {
    console.log(tokenString[1], process.env.JWT_SECRET)
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  });
}

module.exports = authenticateMiddleware;
