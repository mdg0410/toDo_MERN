const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si existe token en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar que el token existe
    if (!token) {
      return res.status(401).json({ message: 'No autorizado, no hay token' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario por id del token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido', error: error.message });
  }
};

module.exports = { protect };
