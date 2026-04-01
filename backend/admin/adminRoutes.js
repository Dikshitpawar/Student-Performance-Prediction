const express = require('express');
const router = express.Router();
const {
  adminLogin, createFaculty, getAllFaculty, updateFaculty, deleteFaculty
} = require('../admin/adminController');
const { protectAdmin } = require('../src/middleware/auth.middleware');

// Public


router.post('/login', adminLogin);                          // Public
router.get('/faculty', protectAdmin, getAllFaculty);        // Admin only
router.post('/faculty', protectAdmin, createFaculty);       // Admin only
router.put('/faculty/:id', protectAdmin, updateFaculty);    // Admin only
router.delete('/faculty/:id', protectAdmin, deleteFaculty); // Admin only

module.exports = router;