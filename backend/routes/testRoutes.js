const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Ruta protegida de prueba
router.get('/protected', protect, (req, res) => {
  res.json({ 
    message: 'Esta es una ruta protegida',
    user: req.user // Información del usuario desde el middleware
  });
});

module.exports = router;
