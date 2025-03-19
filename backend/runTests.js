/**
 * Script para ejecutar manualmente las pruebas de Jest
 * Útil si hay problemas con npm test
 * 
 * Para usar: node runTests.js
 */
const { spawnSync } = require('child_process');

console.log('🧪 Ejecutando pruebas del backend...');

// Determinar la ruta de Jest (en node_modules o global)
const jestPath = './node_modules/.bin/jest';
const jestArgs = ['--runInBand', '--colors'];

// Ejecutar Jest como un proceso hijo
const result = spawnSync('node', [jestPath, ...jestArgs], { 
  stdio: 'inherit',
  shell: true
});

if (result.error) {
  console.error('❌ Error al ejecutar Jest:', result.error);
  process.exit(1);
}

process.exit(result.status);
