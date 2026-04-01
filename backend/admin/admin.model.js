const mongoose = require('mongoose');

/**
 * Admin Model
 * One admin is created via seed script (node scripts/seedAdmin.js).
 * Admin manages faculty accounts — no email needed.
 */
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);