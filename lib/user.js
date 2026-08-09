const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, trim: true },
  setYear:      { type: Number },
  location:     { type: String },
  passwordHash: { type: String, required: true },
  memberId:     { type: String, unique: true, sparse: true },
  role:         { type: String, enum: ['member', 'admin'], default: 'member' },
  createdAt:    { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  if (!this.memberId && this.setYear) {
    const count = await mongoose.model('User').countDocuments({ setYear: this.setYear });
    const pad = String(count + 1).padStart(4, '0');
    this.memberId = `NNSS-OJO-${String(this.setYear).slice(2)}-${pad}`;
  }
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
