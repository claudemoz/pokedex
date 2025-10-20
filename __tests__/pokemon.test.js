const request = require('supertest');
const app = require('@app');
const { sequelize, Pokemon } = require('@models');
const redisService = require('@services/redis.service');

describe('Pokemon CRUD Operations', () => {
  let createdPokemonId;

  beforeAll(async () => {
    // Initialiser Redis
    redisService.connect();
    
    // Synchroniser la base de données
    await sequelize.sync({ force: true });
    
    // Créer les données de test initiales
    await Pokemon.create({
      name: 'Charizard',
      type: 'fire',
      secondaryType: 'flying',
      baseAttack: 84,
      baseDefense: 78,
      baseHP: 78,
      height: 1.7,
      weight: 90.5,
      description: 'A powerful fire Pokemon'
    });
  });

  afterAll(async () => {
    // Nettoyer
    await sequelize.close();
    await redisService.disconnect();
  });

  afterEach(async () => {
    // Vider le cache après chaque test
    await redisService.flushAll();
  });

  describe('POST /api/v1/pokemons - CREATE', () => {
    test('Should create a new pokemon with valid data', async () => {
      const newPokemon = {
        name: 'Pikachu',
        type: 'electric',
        baseAttack: 55,
        baseDefense: 40,
        baseHP: 35,
        height: 0.4,
        weight: 6.0,
        description: 'An electric mouse Pokemon'
      };

      const response = await request(app)
        .post('/api/v1/pokemons')
        .send(newPokemon)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newPokemon.name);
      expect(response.body.data.type).toBe(newPokemon.type);
      expect(response.body.data.baseAttack).toBe(newPokemon.baseAttack);

      createdPokemonId = response.body.data.id;
    });

    test('Should fail to create pokemon without required fields', async () => {
      const invalidPokemon = {
        baseAttack: 50
      };

      const response = await request(app)
        .post('/api/v1/pokemons')
        .send(invalidPokemon)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requis');
    });

    test('Should fail to create pokemon with duplicate name', async () => {
      const duplicatePokemon = {
        name: 'Charizard', // Existe déjà
        type: 'fire',
        baseAttack: 84,
        baseDefense: 78,
        baseHP: 78
      };

      const response = await request(app)
        .post('/api/v1/pokemons')
        .send(duplicatePokemon)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('existe déjà');
    });
  });

  describe('GET /api/v1/pokemons - READ ALL', () => {
    test('Should retrieve all pokemons', async () => {
      const response = await request(app)
        .get('/api/v1/pokemons')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('type');
    });

    test('Should retrieve pokemons with weather effects', async () => {
      const response = await request(app)
        .get('/api/v1/pokemons?weather=true')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0]).toHaveProperty('currentAttack');
      expect(response.body.data[0]).toHaveProperty('weatherEffect');
    });
  });

  describe('GET /api/v1/pokemons/:id - READ ONE', () => {
    test('Should retrieve a pokemon by ID', async () => {
      const response = await request(app)
        .get('/api/v1/pokemons/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data.id).toBe(1);
    });

    test('Should retrieve pokemon with weather effects', async () => {
      const response = await request(app)
        .get('/api/v1/pokemons/1?weather=true')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('currentAttack');
      expect(response.body.data).toHaveProperty('weatherEffect');
      expect(response.body.data).toHaveProperty('weatherEffectDescription');
    });

    test('Should return 404 for non-existent pokemon', async () => {
      const response = await request(app)
        .get('/api/v1/pokemons/99999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvé');
    });
  });

  describe('PUT /api/v1/pokemons/:id - UPDATE', () => {
    test('Should update a pokemon with valid data', async () => {
      const updatedData = {
        name: 'Pikachu Updated',
        baseAttack: 60
      };

      const response = await request(app)
        .put(`/api/v1/pokemons/${createdPokemonId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.baseAttack).toBe(updatedData.baseAttack);
    });

    test('Should return 404 when updating non-existent pokemon', async () => {
      const response = await request(app)
        .put('/api/v1/pokemons/99999')
        .send({ name: 'Test' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvé');
    });
  });

  describe('DELETE /api/v1/pokemons/:id - DELETE', () => {
    test('Should return 404 when deleting non-existent pokemon', async () => {
      const response = await request(app)
        .delete('/api/v1/pokemons/99999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvé');
    });

    test('Should delete a pokemon successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/pokemons/${createdPokemonId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('supprimé');

      // Vérifier qu'il est bien supprimé
      const getResponse = await request(app)
        .get(`/api/v1/pokemons/${createdPokemonId}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/pokemons/type/:type - SEARCH BY TYPE', () => {
    test('Should retrieve pokemons by type', async () => {
      const response = await request(app)
        .get('/api/v1/pokemons/type/fire')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.type).toBe('fire');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0].type).toBe('fire');
      }
    });
  });
});

