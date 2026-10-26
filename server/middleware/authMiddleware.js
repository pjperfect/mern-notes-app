import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware that runs BEFORE a route's handler. If the request carries a valid
// token, it finds the user and puts them on req.user, then calls next() so the
// handler can run. If not, it stops the request here with a 401.
export const protect = async (req, res, next) => {
  // Clients send:  Authorization: Bearer <token>
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = header.split(' ')[1];

  // Part 1: is the token genuine? jwt.verify throws if the signature doesn't
  // match JWT_SECRET (forged or edited token) or if the token has expired.
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Not authorized, token invalid or expired' });
  }

  // Part 2: does that user still exist? The token only holds the user's id, so we
  // load the user from the database. A valid token for a deleted user fails here.
  // This is a separate try/catch because a database failure is OUR problem (500),
  // not the client's (401).
  let user;
  try {
    user = await User.findById(decoded.id);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Server error while checking your login' });
  }

  if (!user) {
    return res
      .status(401)
      .json({ message: 'Not authorized, user no longer exists' });
  }

  req.user = user;
  next(); // hand over to the next middleware or the route handler
};
