/**
 * Seed Script — Create Initial Admin Account
 * Run once: node scripts/seedAdmin.js
 *
 * Make sure .env is loaded (MONGO_URI must be set).
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../admin/admin.model');

/**
 * Run ONCE to create the admin account:
 *   node scripts/seedAdmin.js
 *
 * After running, login at: /login  (select Admin tab)
 * Email:    admin@smartpredict.com
 * Password: Admin@1234
 */

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const exists = await Admin.findOne({ email: 'admin@smartpredict.com' });
  if (exists) {
    console.log('⚠️  Admin already exists. Skipping.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('Admin@1234', 10);
  await Admin.create({ name: 'Super Admin', email: 'admin@smartpredict.com', password: hashed });

  console.log('✅ Admin created!');
  console.log('   Email   : admin@smartpredict.com');
  console.log('   Password: Admin@1234');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });