const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  // Obtener el token del header "Authorization"
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }
  
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar estructura del token para mantener compatibilidad
    if (!decoded.user) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }
    
    // Agregar el usuario al request
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Error de verificación JWT:', err);
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = verifyJWT;
