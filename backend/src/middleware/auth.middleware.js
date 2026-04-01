// const jwt = require('jsonwebtoken');
// const Student = require('../models/auth.model');

// const authMiddleware = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token missing"
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const student = await Student.findById(decoded.id);

//     if (!student) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token"
//       });
//     }

//     req.student = student;

//     next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized"
//     });
//   }
// };

// module.exports = authMiddleware;




const jwt = require('jsonwebtoken');
const Student = require('../models/auth.model');
const Faculty = require('../../faculty/faculty.model');
const Admin = require('../../admin/admin.model');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Token missing' });
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(401).json({ success: false, message: 'Invalid token' });
 
    req.student = student;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
 
/**
 * ─── Faculty Auth Middleware ─────────────────────────────────────────────────
 * Expects JWT payload: { id, role: 'faculty' }
 * req.faculty is attached on success.
 */
const protectFaculty = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Token missing' });
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied: faculty only' });
    }
 
    const faculty = await Faculty.findById(decoded.id);
    if (!faculty || !faculty.isActive) {
      return res.status(401).json({ success: false, message: 'Faculty not found or inactive' });
    }
 
    req.faculty = faculty;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
 
/**
 * ─── Admin Auth Middleware ───────────────────────────────────────────────────
 * Expects JWT payload: { id, role: 'admin' }
 * req.admin is attached on success.
 */
const protectAdmin = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Token missing' });
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: admin only' });
    }
 
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
 
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};
 
// Default export keeps existing code working (auth.routes.js, studentPerformance.route.js)
module.exports = authMiddleware;
 
// Named exports for new admin/faculty routes

module.exports = { authMiddleware, protectFaculty, protectAdmin };