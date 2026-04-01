const express = require('express');
const {authMiddleware} = require('../middleware/auth.middleware');
const { addStudentPerformance, getStudentPerformance, getAllStudentPerformance, deletePerformanceController } = require('../controllers/studentPerformance.controller');

const router = express.Router(); 

router.post('/add' ,  authMiddleware, addStudentPerformance);
router.get('/get' ,  authMiddleware, getStudentPerformance);
router.get('/get-all' , authMiddleware, getAllStudentPerformance);
router.delete('/delete/:id', authMiddleware, deletePerformanceController);



module.exports = router;