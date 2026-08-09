import jwt from 'jsonwebtoken';
import { connectDB } from '../../lib/db.js';
import User from '../../lib/user.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
