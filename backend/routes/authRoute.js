const express = require('express');
const router = express.Router();
const { login, signupManager } = require('../controllers/authController');

router.post('/', login)
      .post('/signup-manager', signupManager)
      .post('/logout', logout);

module.exports = router;