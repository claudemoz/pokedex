require('module-alias/register');
require('colors');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DEV_DB_NAME = 'pokedex_test';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

