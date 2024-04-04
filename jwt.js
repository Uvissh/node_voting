const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const jwtAutMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: 'Token Not found' });
  // extract the jwt token from the request headers
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorization' });
  try {
    //verify the jwt token0
    const decoded = jwt.verify(token, '12345');
    // attach user information to the request object
    req.user = decoded
    next();

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'invalid token' });
  }
}
//function to generateToken
const generateToken = (userData) => {
  return jwt.sign(userData, '12345');//token gernate for valid time period
}
module.exports = { jwtAutMiddleware, generateToken };