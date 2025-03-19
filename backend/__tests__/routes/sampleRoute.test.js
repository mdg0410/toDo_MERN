const request = require('supertest');
const express = require('express');
const app = express();

// Importar middleware y rutas para la prueba
const errorHandler = require('../../middlewares/errorHandler');

describe('Prueba de rutas básicas', () => {
  beforeAll(() => {
    // Configurar rutas de prueba
    app.get('/test', (req, res) => {
      res.status(200).json({ message: 'Ruta de prueba funcionando' });
    });
    
    app.get('/test-error', (req, res, next) => {
      const error = new Error('Error de prueba');
      error.statusCode = 400;
      next(error);
    });
    
    // Implementar el middleware de errores al final
    app.use(errorHandler);
  });

  test('GET /test debería responder con estado 200', async () => {
    const response = await request(app).get('/test');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Ruta de prueba funcionando');
  });

  test('GET /test-error debería capturar y manejar el error', async () => {
    const response = await request(app).get('/test-error');
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Error de prueba');
  });
});
