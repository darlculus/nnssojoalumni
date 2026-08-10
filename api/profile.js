const { connectDB } = require('../lib/db');
const User = require('../lib/user');
const { verifyToken } = require('../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorised.' });

  try {
    await connectDB();

    if (req.method === 'GET') {
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found.' });
      return res.status(200).json({ user });
    }

    if (req.method === 'POST') {
      const allowed = ['firstName', 'lastName', 'otherNames', 'title', 'dob', 'gender',
        'bio', 'phone', 'whatsapp', 'city', 'stateCountry', 'linkedin',
        'setYear', 'house', 'profession', 'employer', 'skills',
        'showInDirectory', 'allowContact', 'hideWallet', 'location'];

      const updates = {};
      allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

      const user = await User.findByIdAndUpdate(
        decoded.userId, { $set: updates }, { new: true, runValidators: true }
      ).select('-passwordHash');

      return res.status(200).json({ user });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ error: err.message || 'Server error.' });
  }
};
