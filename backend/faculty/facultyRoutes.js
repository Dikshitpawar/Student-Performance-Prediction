const express = require('express');
const router = express.Router();
const {
  login, getProfile, getStudents, getStudentById, updatePrediction, deletePrediction 
} = require('../faculty/facultyController');
const { protectFaculty } = require('../src/middleware/auth.middleware');

// Public routes


router.post('/login', login);                                             // Public
router.get('/profile', protectFaculty, getProfile);                       // Faculty
router.get('/students', protectFaculty, getStudents);                     // Faculty
router.get('/students/:id', protectFaculty, getStudentById);              // Faculty
router.put('/predictions/:id', protectFaculty, updatePrediction);         // Faculty
router.delete('/predictions/:id', protectFaculty, deletePrediction);      // Faculty

module.exports = router;