const jwt = require('jsonwebtoken');
const verifyJWT = require('../../middlewares/verifyJWT');

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

describe('verifyJWT Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn()
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();

    // Silenciar console.error durante las pruebas
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('debería rechazar peticiones sin token', () => {
    mockRequest.header.mockReturnValue(undefined);
    
    verifyJWT(mockRequest, mockResponse, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('token')
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('debería rechazar peticiones con token inválido', () => {
    mockRequest.header.mockReturnValue('Bearer invalidToken');
    jwt.verify.mockImplementation(() => {
      throw new Error('Token inválido');
    });
    
    verifyJWT(mockRequest, mockResponse, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Token no válido'
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('debería rechazar tokens con formato incorrecto', () => {
    mockRequest.header.mockReturnValue('Bearer validTokenWithInvalidFormat');
    jwt.verify.mockReturnValue({ foo: 'bar' }); // Sin propiedad user
    
    verifyJWT(mockRequest, mockResponse, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Formato de token inválido'
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('debería permitir acceso con token válido', () => {
    mockRequest.header.mockReturnValue('Bearer validToken');
    jwt.verify.mockReturnValue({ user: { id: '123', name: 'Test User' } });
    
    verifyJWT(mockRequest, mockResponse, nextFunction);
    
    expect(mockRequest.user).toEqual({ id: '123', name: 'Test User' });
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});
