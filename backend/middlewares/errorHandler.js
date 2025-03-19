const errorHandler = (err, req, res, next) => {
  // Registrar el error para debugging
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  // Determinar el código de estado adecuado
  const statusCode = err.statusCode || 500;
  
  // Estructura de respuesta de error
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

module.exports = errorHandler;
