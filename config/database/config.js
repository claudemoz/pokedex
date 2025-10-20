const fs = require('fs');
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME || 'postgres',
    password: process.env.DEV_DB_PASSWORD || 'postgres',
    database: process.env.DEV_DB_NAME || 'pokedex',
    host: process.env.DEV_DB_HOSTNAME || '127.0.0.1',
    port: process.env.DEV_DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    },
    logging: false
  },
  test: {
    username: process.env.CI_DB_USERNAME || 'postgres',
    password: process.env.CI_DB_PASSWORD || 'postgres',
    database: process.env.CI_DB_NAME || 'pokedex_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    },
    logging: false
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
