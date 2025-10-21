const redisService = require('@services/redis.service');

describe('Redis Service', () => {
  beforeAll(async () => {
    redisService.connect();
    // Attendre que la connexion soit établie
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await redisService.disconnect();
  });

  afterEach(async () => {
    await redisService.flushAll();
  });

  describe('SET and GET operations', () => {
    test('Should set and get a value', async () => {
      const key = 'test:key';
      const value = { name: 'Pikachu', type: 'electric' };

      const setResult = await redisService.set(key, value);
      expect(setResult).toBe(true);

      const retrieved = await redisService.get(key);

      expect(retrieved).toEqual(value);
    });

    test('Should return null for non-existent key', async () => {
      const retrieved = await redisService.get('non:existent:key');
      expect(retrieved).toBeNull();
    });

    test('Should set value with TTL', async () => {
      const key = 'test:ttl';
      const value = { test: 'data' };
      const ttl = 2;

      const setResult = await redisService.set(key, value, ttl);
      expect(setResult).toBe(true);

      const retrieved = await redisService.get(key);
      expect(retrieved).toEqual(value);

      // Attendre l'expiration du TTL
      await new Promise(resolve => setTimeout(resolve, 2100));
      const expired = await redisService.get(key);
      expect(expired).toBeNull();
    });
  });

  describe('DELETE operation', () => {
    test('Should delete a key', async () => {
      const key = 'test:delete';
      const value = { test: 'data' };

      await redisService.set(key, value);
      await redisService.del(key);

      const retrieved = await redisService.get(key);
      expect(retrieved).toBeNull();
    });
  });

  describe('FLUSH operation', () => {
    test('Should flush all keys', async () => {
      await redisService.set('key1', { data: 1 });
      await redisService.set('key2', { data: 2 });
      await redisService.set('key3', { data: 3 });

      await redisService.flushAll();

      const key1 = await redisService.get('key1');
      const key2 = await redisService.get('key2');
      const key3 = await redisService.get('key3');

      expect(key1).toBeNull();
      expect(key2).toBeNull();
      expect(key3).toBeNull();
    });
  });
});

