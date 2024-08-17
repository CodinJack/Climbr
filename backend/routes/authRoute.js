const express = require('express');
const router = express.Router();
const { login, signupManager } = require('../controllers/authController');

router.post('/login', login);
router.post('/signup-manager', signupManager);

module.exports = router;
