const { connectDB } = require('../lib/db');
const User = require('../lib/user');
const Transaction = require('../lib/transaction');
const Notification = require('../lib/notification');
const { verifyToken } = require('../lib/auth');

const DUES_AMOUNT = 10000;
const FIRST_SET_YEAR = 1986;

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorised.' });

  try {
    await connectDB();

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 }).limit(10);

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 }).limit(20);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Build dues history: every year from join year to current year
    const currentYear = new Date().getFullYear();
    const joinYear = user.setYear
      ? Math.max(user.setYear + 1, FIRST_SET_YEAR)
      : currentYear;
    const duesHistory = [];
    for (let y = currentYear; y >= Math.min(joinYear, currentYear - 5); y--) {
      duesHistory.push({
        year: y,
        amount: DUES_AMOUNT,
        paid: user.duesPaidYears.includes(y)
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        setYear: user.setYear,
        location: user.location,
        memberId: user.memberId,
        role: user.role,
        walletBalance: user.walletBalance,
        totalDonated: user.totalDonated,
        eventsAttended: user.eventsAttended,
        duesPaidYears: user.duesPaidYears,
        emailVerified: user.emailVerified
      },
      duesHistory,
      transactions,
      notifications,
      unreadCount
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ error: err.message || 'Server error.' });
  }
};
