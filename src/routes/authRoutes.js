const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')

// Public routes for user onboarding
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
