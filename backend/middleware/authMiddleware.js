const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Bearer token

  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(500).send('Invalid token');
    req.user = decoded;
    next();
  });
};

module.exports = {
  authenticateJWT
};
