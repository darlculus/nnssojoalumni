const { connectDB } = require('../lib/db');
const Notification = require('../lib/notification');
const { verifyToken } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorised.' });

  try {
    await connectDB();

    if (req.method === 'POST') {
      await Notification.updateMany({ userId: decoded.userId, read: false }, { read: true });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error.' });
  }
};
