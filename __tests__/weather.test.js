const weatherService = require('../services/weather.service');

describe('Weather Service', () => {
  describe('Weather API calls', () => {
    test('Should return weather data (may use default if no API key)', async () => {
      const weather = await weatherService.getWeather();

      expect(weather).toHaveProperty('main');
      expect(weather).toHaveProperty('description');
      expect(weather).toHaveProperty('temp');
      expect(weather).toHaveProperty('source');
    });
  });

  describe('Pokemon modifier calculations', () => {
    test('Should weaken fire type in rain', () => {
      const weather = { main: 'Rain', description: 'light rain', temp: 15 };
      const modifiers = weatherService.calculatePokemonModifiers('fire', null, weather);

      expect(modifiers.attackModifier).toBeLessThan(1.0);
      expect(modifiers.defenseModifier).toBeLessThan(1.0);
      expect(modifiers.affected).toBe(true);
      expect(modifiers.weatherCondition).toBe('Rain');
    });

    test('Should strengthen water type in rain', () => {
      const weather = { main: 'Rain', description: 'heavy rain', temp: 15 };
      const modifiers = weatherService.calculatePokemonModifiers('water', null, weather);

      expect(modifiers.attackModifier).toBeGreaterThan(1.0);
      expect(modifiers.defenseModifier).toBeGreaterThan(1.0);
      expect(modifiers.affected).toBe(true);
    });

    test('Should strengthen fire type in clear weather', () => {
      const weather = { main: 'Clear', description: 'clear sky', temp: 25 };
      const modifiers = weatherService.calculatePokemonModifiers('fire', null, weather);

      expect(modifiers.attackModifier).toBeGreaterThan(1.0);
      expect(modifiers.defenseModifier).toBeGreaterThan(1.0);
      expect(modifiers.affected).toBe(true);
    });

    test('Should weaken fire type in snow', () => {
      const weather = { main: 'Snow', description: 'light snow', temp: -5 };
      const modifiers = weatherService.calculatePokemonModifiers('fire', null, weather);

      expect(modifiers.attackModifier).toBeLessThan(1.0);
      expect(modifiers.defenseModifier).toBeLessThan(1.0);
      expect(modifiers.affected).toBe(true);
    });

    test('Should handle dual type pokemon', () => {
      const weather = { main: 'Rain', description: 'rain', temp: 15 };
      const modifiers = weatherService.calculatePokemonModifiers('fire', 'flying', weather);

      expect(modifiers.affected).toBe(true);
      // Les deux types sont affectés par la pluie (feu affaibli, vol peut être affaibli en cas d'orage)
    });

    test('Should not affect pokemon in neutral weather', () => {
      const weather = { main: 'Clouds', description: 'cloudy', temp: 18 };
      const modifiers = weatherService.calculatePokemonModifiers('normal', null, weather);

      expect(modifiers.attackModifier).toBe(1.0);
      expect(modifiers.defenseModifier).toBe(1.0);
      expect(modifiers.affected).toBe(false);
    });
  });

  describe('Apply weather effects to pokemon', () => {
    test('Should apply weather effects to pokemon stats', () => {
      const pokemon = {
        id: 1,
        name: 'Charizard',
        type: 'fire',
        secondaryType: 'flying',
        baseAttack: 84,
        baseDefense: 78,
        baseHP: 78
      };

      const weather = { main: 'Rain', description: 'heavy rain', temp: 15 };
      const affected = weatherService.applyWeatherEffects(pokemon, weather);

      expect(affected).toHaveProperty('currentAttack');
      expect(affected).toHaveProperty('currentDefense');
      expect(affected).toHaveProperty('weatherEffect');
      expect(affected.currentAttack).toBeLessThan(pokemon.baseAttack);
      expect(affected.currentDefense).toBeLessThan(pokemon.baseDefense);
    });

    test('Should generate weather effect description', () => {
      const weather = { main: 'Rain', description: 'rain', temp: 15 };
      const description = weatherService.getWeatherEffectDescription('fire', null, weather);

      expect(description).toContain('affaibli');
      expect(description).toContain('Conditions météo');
    });
  });
});

