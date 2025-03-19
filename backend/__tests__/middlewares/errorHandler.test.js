const errorHandler = require('../../middlewares/errorHandler');

describe('Error Handler Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;
  
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });
  
  test('debería responder con código 500 para un error sin statusCode', () => {
    const error = new Error('Error de prueba');
   
    errorHandler(error, mockRequest, mockResponse, nextFunction);
   
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error de prueba'
      })
    );
  });
  
  test('debería responder con el código de error personalizado', () => {
    const error = new Error('Error de prueba');
    error.statusCode = 400;
   
    errorHandler(error, mockRequest, mockResponse, nextFunction);
   
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error de prueba'
      })
    );
  });
  
  test('debería ocultar el stack en producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
   
    const error = new Error('Error de prueba');
   
    errorHandler(error, mockRequest, mockResponse, nextFunction);
   
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: '🥞',
        error: {}
      })
    );
   
    process.env.NODE_ENV = originalEnv;
  });
});