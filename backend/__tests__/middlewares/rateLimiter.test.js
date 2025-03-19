// Define el mock en una variable fuera del bloque jest.mock
const mockRateLimitFn = jest.fn().mockImplementation(options => ({
  options,
  handle: jest.fn((req, res, next) => next())
}));

// Mock utilizando una función que devuelve el mock
jest.mock('express-rate-limit', () => {
  return mockRateLimitFn;
});

// Importa después de configurar el mock
const rateLimit = require('express-rate-limit');

describe('Rate Limiter Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      require('../../middlewares/rateLimiter');
    });
  });
  
  test('debería configurarse correctamente con opciones esperadas', () => {
    expect(mockRateLimitFn).toHaveBeenCalledWith(
      expect.objectContaining({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false
      })
    );
  });
  
  // El resto de tus tests usando mockRateLimitFn
  test('debería tener un mensaje de error personalizado', () => {
    const rateLimitOptions = mockRateLimitFn.mock.calls[0][0];
    expect(rateLimitOptions.message).toEqual({
      status: 429,
      message: 'Demasiadas peticiones realizadas, por favor intente de nuevo después de 15 minutos'
    });
  });
  
  test('debería tener la función skip configurada', () => {
    const rateLimitOptions = mockRateLimitFn.mock.calls[0][0];
    expect(typeof rateLimitOptions.skip).toBe('function');
   
    // La función skip debe retornar false por defecto
    const mockReq = {};
    expect(rateLimitOptions.skip(mockReq)).toBe(false);
  });
});