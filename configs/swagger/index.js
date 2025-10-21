const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokédex API',
      version: '1.0.0',
      description: 'API REST pour gérer un Pokédex avec intégration météo et système de cache Redis',
      contact: {
        name: 'API Support',
        email: 'support@pokedex-api.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:9000',
        description: 'Serveur de développement'
      },
      {
        url: 'http://localhost:9000/api/v1',
        description: 'API V1'
      }
    ],
    tags: [
      {
        name: 'Pokemons',
        description: 'Opérations CRUD sur les Pokémons'
      },
      {
        name: 'Weather',
        description: 'Informations météo et effets sur les Pokémons'
      }
    ],
    components: {
      schemas: {
        Pokemon: {
          type: 'object',
          required: ['name', 'type', 'baseAttack', 'baseDefense', 'baseHP'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique du Pokémon',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nom du Pokémon (unique)',
              example: 'Pikachu'
            },
            type: {
              type: 'string',
              description: 'Type principal du Pokémon',
              example: 'electric',
              enum: ['fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal']
            },
            secondaryType: {
              type: 'string',
              description: 'Type secondaire du Pokémon (optionnel)',
              example: 'flying',
              nullable: true
            },
            baseAttack: {
              type: 'integer',
              description: 'Statistique d\'attaque de base',
              example: 55,
              minimum: 1
            },
            baseDefense: {
              type: 'integer',
              description: 'Statistique de défense de base',
              example: 40,
              minimum: 1
            },
            baseHP: {
              type: 'integer',
              description: 'Points de vie de base',
              example: 35,
              minimum: 1
            },
            height: {
              type: 'number',
              format: 'float',
              description: 'Taille en mètres',
              example: 0.4,
              nullable: true
            },
            weight: {
              type: 'number',
              format: 'float',
              description: 'Poids en kilogrammes',
              example: 6.0,
              nullable: true
            },
            description: {
              type: 'string',
              description: 'Description du Pokémon',
              example: 'Un Pokémon souris électrique',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification'
            }
          }
        },
        PokemonWithWeather: {
          allOf: [
            { $ref: '#/components/schemas/Pokemon' },
            {
              type: 'object',
              properties: {
                currentAttack: {
                  type: 'integer',
                  description: 'Attaque modifiée par la météo',
                  example: 60
                },
                currentDefense: {
                  type: 'integer',
                  description: 'Défense modifiée par la météo',
                  example: 45
                },
                weatherEffect: {
                  type: 'string',
                  description: 'Type d\'effet météo',
                  example: 'boosted'
                },
                weatherEffectDescription: {
                  type: 'string',
                  description: 'Description détaillée de l\'effet météo',
                  example: 'Conditions météo: Clear - Attaque et défense augmentées de 20%'
                }
              }
            }
          ]
        },
        Weather: {
          type: 'object',
          properties: {
            main: {
              type: 'string',
              description: 'Condition météo principale',
              example: 'Clear'
            },
            description: {
              type: 'string',
              description: 'Description détaillée',
              example: 'clear sky'
            },
            temp: {
              type: 'number',
              description: 'Température en Celsius',
              example: 20.5
            },
            source: {
              type: 'string',
              description: 'Source des données météo',
              example: 'OpenWeatherMap API'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Données de la réponse'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Message d\'erreur',
              example: 'Une erreur est survenue'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/**/*.js', './controllers/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

