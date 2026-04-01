const mongoose = require('mongoose');

/**
 * Faculty Model
 * - Admin creates faculty and sets password directly (no email flow).
 * - Department values match the student signup form exactly: CE, IT, ME, EE, Civil.
 */
const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // Admin sets this directly when creating faculty
    },
    department: {
      type: String,
      required: true,
      // IMPORTANT: These match exactly what students select in signup form
      enum: ['CE', 'IT', 'ME', 'EE', 'Civil'],
    },
    facultyId: {
  type: String,
  unique: true,
  default: () => 'FAC' + Date.now()
},
    designation: {
      type: String,
      enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'],
      default: 'Lecturer',
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

// Never expose password in JSON responses
facultySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Faculty', facultySchema);