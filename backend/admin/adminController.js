const Admin = require('../admin/admin.model');
const Faculty = require('../faculty/faculty.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ─── Email Transporter ───────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create Faculty (Admin sets password directly — no email needed)
// @route   POST /api/admin/faculty
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.createFaculty = async (req, res) => {
  try {
    const { name, email, department, designation, password } = req.body;

    if (!name || !email || !department || !password)
      return res.status(400).json({
        success: false,
        message: 'Name, email, department and password are required',
      });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    // Check duplicate
    const existing = await Faculty.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Faculty with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
      name,
      email,
      password: hashedPassword,
      department,
      designation: designation || 'Lecturer',
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      faculty, // password removed by toJSON
    });
  } catch (err) {
    console.error('Create faculty error:', err);
    res.status(500).json({ success: false, message: 'Error creating faculty' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get All Faculty
// @route   GET /api/admin/faculty
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching faculty' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update Faculty (name, department, designation, reset password)
// @route   PUT /api/admin/faculty/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.updateFaculty = async (req, res) => {
  try {
    const { name, department, designation, password } = req.body;
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty)
      return res.status(404).json({ success: false, message: 'Faculty not found' });

    if (name) faculty.name = name;
    if (department) faculty.department = department;
    if (designation) faculty.designation = designation;
    if (password && password.trim()) {
      if (password.length < 6)
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      faculty.password = await bcrypt.hash(password, 10);
    }

    await faculty.save();
    res.json({ success: true, message: 'Faculty updated successfully', faculty });
  } catch (err) {
    console.error('Update faculty error:', err);
    res.status(500).json({ success: false, message: 'Error updating faculty' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete Faculty
// @route   DELETE /api/admin/faculty/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty)
      return res.status(404).json({ success: false, message: 'Faculty not found' });

    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting faculty' });
  }
};
