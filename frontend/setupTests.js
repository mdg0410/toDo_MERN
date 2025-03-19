// Añade coincidencias personalizadas de Jest
import '@testing-library/jest-dom';

// Silencia los warnings específicos durante las pruebas
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};
