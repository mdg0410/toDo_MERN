const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/AuthController');

// Endpoint para registro
router.post('/register', register);

// Endpoint para login
router.post('/login', login);

module.exports = router;
