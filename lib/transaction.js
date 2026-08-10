const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type:      { type: String, enum: ['dues', 'donation', 'topup', 'event'], required: true },
  amount:    { type: Number, required: true },
  direction: { type: String, enum: ['debit', 'credit'], required: true },
  label:     { type: String, required: true },
  note:      { type: String },
  status:    { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
