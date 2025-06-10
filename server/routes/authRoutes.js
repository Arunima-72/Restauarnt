// const express = require('express');
// const router = express.Router();
// const { login, signup, getProfile } = require('../controllers/authController');
// const User = require('../model/userData');
// const verifyToken = require('./jwt');
    
// router.post('/login', login);     // /user/login
// router.post('/signup', signup);   // /user/signup
// // router.get('/profile', verifyToken, getProfile);

// module.exports = router;
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Correct path to controller
const { forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/login', authController.login); // Handles POST requests to /auth/login
router.post('/signup', authController.signup); // Handles POST requests to /auth/signup

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports = router; 