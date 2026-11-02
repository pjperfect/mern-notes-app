import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = header.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Not authorized, token invalid or expired' });
  }

  let user;
  try {
    user = await User.findByID(decoded.id);
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
  next();
};
