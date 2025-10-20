'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pokemon = sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    type: {
      type: DataTypes.ENUM('fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'),
      allowNull: false
    },
    secondaryType: {
      type: DataTypes.ENUM('fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'),
      allowNull: true,
      field: 'secondary_type'
    },
    baseAttack: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      field: 'base_attack',
      validate: {
        min: 1,
        max: 200
      }
    },
    baseDefense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      field: 'base_defense',
      validate: {
        min: 1,
        max: 200
      }
    },
    baseHP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      field: 'base_hp',
      validate: {
        min: 1,
        max: 300
      }
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Taille en mètres'
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Poids en kilogrammes'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url'
    }
  }, {
    tableName: 'pokemon',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        fields: ['type']
      }
    ]
  });

  return Pokemon;
};

