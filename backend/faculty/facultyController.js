const Faculty = require('../faculty/faculty.model');
const Student = require('../src/models/auth.model');
const Prediction = require('../src/models/studentPerformance.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Set Password (via email token)
// @route   POST /api/faculty/set-password
// @access  Public (token from email)
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// @desc    Faculty Login
// @route   POST /api/faculty/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────

const { exec } = require('child_process');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Run Python prediction model and return parsed result
// ─────────────────────────────────────────────────────────────────────────────
const runPrediction = (attendance, internalMarks, assignmentMarks, studyHours) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../ai_model/predict.py');
    // Use 'python' on Linux/Mac, 'py' on Windows — adjust if needed
    const command = `python "${scriptPath}" ${attendance} ${internalMarks} ${assignmentMarks} ${studyHours}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Python error:', error);
        console.error('Stderr:', stderr);
        return reject(new Error('AI prediction failed'));
      }
      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (e) {
        reject(new Error('Failed to parse AI output'));
      }
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Faculty Login
// @route   POST /api/faculty/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const faculty = await Faculty.findOne({ email }).select('+password');
    if (!faculty)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!faculty.isActive)
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: faculty._id, role: 'faculty', department: faculty.department },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        designation: faculty.designation,
      },
    });
  } catch (err) {
    console.error('Faculty login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Faculty Profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty)
// ─────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.faculty._id);
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Students (faculty department only, with filters)
// @route   GET /api/faculty/students?semester=3&search=john
// @access  Private (Faculty)
// ─────────────────────────────────────────────────────────────────────────────
exports.getStudents = async (req, res) => {
  try {
    const { semester, search } = req.query;
    const facultyDept = req.faculty.department;

    // Case-insensitive exact match — handles 'CE' vs 'ce' etc.
    const query = {
      department: { $regex: `^${facultyDept}$`, $options: 'i' },
    };

    if (semester && semester !== 'all') {
      query.semester = Number(semester);
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { enrollmentNo: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const students = await Student.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, students, department: facultyDept });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Single Student + All Predictions
// @route   GET /api/faculty/students/:id
// @access  Private (Faculty)
// ─────────────────────────────────────────────────────────────────────────────
exports.getStudentById = async (req, res) => {
  try {
    const facultyDept = req.faculty.department;

    const student = await Student.findOne({
      _id: req.params.id,
      department: { $regex: `^${facultyDept}$`, $options: 'i' },
    }).select('-password');

    if (!student)
      return res.status(404).json({ success: false, message: 'Student not found in your department' });

    const predictions = await Prediction.find({ studentId: student._id }).sort({ createdAt: -1 });
    res.json({ success: true, student, predictions });
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ success: false, message: 'Error fetching student' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update Prediction — saves new values AND re-runs AI model
// @route   PUT /api/faculty/predictions/:id
// @access  Private (Faculty)
// ─────────────────────────────────────────────────────────────────────────────
exports.updatePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction)
      return res.status(404).json({ success: false, message: 'Prediction not found' });

    // Make sure this student belongs to faculty's department
    const student = await Student.findOne({
      _id: prediction.studentId,
      department: { $regex: `^${req.faculty.department}$`, $options: 'i' },
    });
    if (!student)
      return res.status(403).json({ success: false, message: 'Access denied' });

    // Use new values if provided, else fall back to existing stored values
    const attendance    = req.body.attendance    !== undefined ? Number(req.body.attendance)    : prediction.attendance;
    const internalMarks = req.body.internalMarks !== undefined ? Number(req.body.internalMarks) : prediction.internalMarks;
    const assignmentMarks = req.body.assignmentMarks !== undefined ? Number(req.body.assignmentMarks) : prediction.assignmentMarks;
    const studyHours    = req.body.studyHours    !== undefined ? Number(req.body.studyHours)    : prediction.studyHours;
    const subject       = req.body.subject || prediction.subject;

    // ── Re-run AI model with the updated values ──────────────────────────────
    let aiResult;
    try {
      aiResult = await runPrediction(attendance, internalMarks, assignmentMarks, studyHours);
    } catch (aiErr) {
      console.error('AI re-run failed during update:', aiErr.message);
      // Fallback: update only the raw values without changing prediction text
      aiResult = {
        prediction: prediction.prediction,
        riskScore: prediction.riskScore,
        weakAreas: prediction.weakAreas,
        suggestions: prediction.suggestions,
      };
    }

    // Save everything
    prediction.subject        = subject;
    prediction.attendance     = attendance;
    prediction.internalMarks  = internalMarks;
    prediction.assignmentMarks = assignmentMarks;
    prediction.studyHours     = studyHours;
    prediction.prediction     = aiResult.prediction;
    prediction.riskScore      = aiResult.riskScore;
    prediction.weakAreas      = aiResult.weakAreas;
    prediction.suggestions    = aiResult.suggestions;

    await prediction.save();

    res.json({ success: true, message: 'Prediction updated with new AI result', prediction });
  } catch (err) {
    console.error('Update prediction error:', err);
    res.status(500).json({ success: false, message: 'Error updating prediction' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a Prediction record
// @route   DELETE /api/faculty/predictions/:id
// @access  Private (Faculty)
// ─────────────────────────────────────────────────────────────────────────────
exports.deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find first so we can check department access
    const prediction = await Prediction.findById(id);
    if (!prediction)
      return res.status(404).json({ success: false, message: 'Prediction not found' });

    // Verify student is from faculty's department
    const student = await Student.findOne({
      _id: prediction.studentId,
      department: { $regex: `^${req.faculty.department}$`, $options: 'i' },
    });
    if (!student)
      return res.status(403).json({ success: false, message: 'Access denied' });

    // Delete from DB
    await Prediction.deleteOne({ _id: id });

    res.json({ success: true, message: 'Prediction deleted successfully' });
  } catch (err) {
    console.error('Delete prediction error:', err);
    res.status(500).json({ success: false, message: 'Error deleting prediction' });
  }
};
