const path = require('path');

// Determinar si estamos ejecutando pruebas de frontend o backend
const testEnv = process.env.TEST_ENV || 'both';

// Configuración base compartida
const baseConfig = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000
};

// Configuración específica para backend
const backendConfig = {
  ...baseConfig,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/backend/**/__tests__/**/*.js?(x)', '<rootDir>/backend/**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/frontend/'],
  displayName: 'backend'
};

// Configuración específica para frontend
const frontendConfig = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/frontend/'],
  testMatch: ['<rootDir>/frontend/**/__tests__/**/*.js?(x)', '<rootDir>/frontend/**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/backend/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/frontend/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/frontend/__mocks__/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/frontend/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  displayName: 'frontend'
};

// Configuración combinada para ejecutar ambos conjuntos de pruebas
const projects = [backendConfig, frontendConfig];

// Exportar la configuración adecuada según el entorno
module.exports = testEnv === 'backend' ? backendConfig 
               : testEnv === 'frontend' ? frontendConfig 
               : { projects };
