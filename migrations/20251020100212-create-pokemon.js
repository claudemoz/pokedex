'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pokemon', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'),
        allowNull: false
      },
      secondary_type: {
        type: Sequelize.ENUM('fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'),
        allowNull: true
      },
      base_attack: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50
      },
      base_defense: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50
      },
      base_hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Height in meters'
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Weight in kilograms'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('pokemon', ['type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pokemon');
  }
};

