

// Définir l'environnement de test
process.env.NODE_ENV = 'test';
process.env.DEV_DB_NAME = 'pokedex_test';

// Simuler les méthodes console pour réduire le bruit pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

