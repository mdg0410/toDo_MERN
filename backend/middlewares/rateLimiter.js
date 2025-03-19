const rateLimit = require('express-rate-limit');

// Configuración del limitador de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 100, // Límite de 100 peticiones por IP en cada ventana
  standardHeaders: true, // Devuelve info estándar en los headers
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
  message: {
    status: 429, 
    message: 'Demasiadas peticiones realizadas, por favor intente de nuevo después de 15 minutos'
  },
  skip: (req) => {
    // Opcionalmente, permite más peticiones para ciertas rutas o excluye IPs confiables
    return false; // No se salta la limitación para ninguna petición por defecto
  }
});

module.exports = limiter;
