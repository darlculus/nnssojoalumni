const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName:      { type: String, required: true, trim: true },
  lastName:       { type: String, required: true, trim: true },
  otherNames:     { type: String, trim: true },
  title:          { type: String, trim: true },
  dob:            { type: String },
  gender:         { type: String },
  bio:            { type: String },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:          { type: String, trim: true },
  whatsapp:       { type: String, trim: true },
  city:           { type: String },
  stateCountry:   { type: String },
  linkedin:       { type: String },
  setYear:        { type: Number },
  house:          { type: String },
  profession:     { type: String },
  employer:       { type: String },
  skills:         { type: [String], default: [] },
  location:       { type: String },
  showInDirectory:{ type: Boolean, default: true },
  allowContact:   { type: Boolean, default: true },
  hideWallet:     { type: Boolean, default: false },
  passwordHash:   { type: String, required: true },
  memberId:       { type: String, unique: true, sparse: true },
  role:           { type: String, enum: ['member', 'admin'], default: 'member' },
  walletBalance:  { type: Number, default: 0 },
  totalDonated:   { type: Number, default: 0 },
  eventsAttended: { type: Number, default: 0 },
  duesPaidYears:  { type: [Number], default: [] },
  emailVerified:  { type: Boolean, default: false },
  createdAt:      { type: Date, default: Date.now }
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
