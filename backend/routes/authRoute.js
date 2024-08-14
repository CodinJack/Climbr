const express = require('express');
const router = express.Router();
const { login, signupManager, logout } = require('../controllers/authController');

router.post('/login', login);
router.post('/signup-manager', signupManager);
router.post('/logout', logout);

module.exports = router;
