const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message:   { type: String, required: true },
  type:      { type: String, enum: ['info', 'payment', 'event', 'alert'], default: 'info' },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
