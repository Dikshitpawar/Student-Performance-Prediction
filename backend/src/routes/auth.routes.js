const express = require('express');
const { registerController, loginController, logoutController, updateProfileController } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', registerController );
router.post('/login', loginController ); 
router.get('/logout', logoutController ); 
router.put('/update-profile', authMiddleware, updateProfileController );



module.exports= router;