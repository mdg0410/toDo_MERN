const express = require('express');
const router = express.Router();
const { register, loginUser, verifyUser } = require('../controllers/AuthController');
const verifyJWT = require('../middlewares/verifyJWT');

// Ruta para registro (no protegida)
router.post('/register', register);

// Ruta para login (no protegida)
router.post('/login', loginUser);

// Ruta para verificar usuario (protegida)
router.get('/user', verifyJWT, verifyUser);

module.exports = router;
