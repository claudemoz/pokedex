const { Pokemon } = require('@models');
const redisService = require('./redis.service');
const weatherService = require('./weather.service');

const cacheTTL = parseInt(process.env.REDIS_CACHE_TTL) || 3600;

exports.getAll = async (includeWeather = false, latitude = null, longitude = null) => {
  try {
    const cacheKey = 'pokemons:all';
    
    // Try cache first
    let pokemons = await redisService.get(cacheKey);
    
    if (!pokemons) {
      pokemons = await Pokemon.findAll({
        order: [['id', 'ASC']]
      });
      
      // Convert Sequelize instances to plain objects
      pokemons = pokemons.map(p => p.toJSON());
      
      // Cache the result
      await redisService.set(cacheKey, pokemons, cacheTTL);
      console.log('📦 Pokemons fetched from database and cached'.green);
    } else {
      console.log('🎯 Pokemons retrieved from cache'.cyan);
    }

    // Apply weather effects if requested
    if (includeWeather) {
      const weather = await weatherService.getWeather(latitude, longitude);
      pokemons = pokemons.map(pokemon => 
        weatherService.applyWeatherEffects(pokemon, weather)
      );
    }

    return pokemons;
  } catch (error) {
    console.error('❌ Error in getAll:'.red, error);
    throw error;
  }
};

exports.getById = async (id, includeWeather = false, latitude = null, longitude = null) => {
  try {
    const cacheKey = `pokemon:${id}`;
    
    // Try cache first
    let pokemon = await redisService.get(cacheKey);
    
    if (!pokemon) {
      const pokemonInstance = await Pokemon.findByPk(id);
      
      if (!pokemonInstance) {
        return null;
      }
      
      pokemon = pokemonInstance.toJSON();
      
      // Cache the result
      await redisService.set(cacheKey, pokemon, cacheTTL);
      console.log(`📦 Pokemon ${id} fetched from database and cached`.green);
    } else {
      console.log(`🎯 Pokemon ${id} retrieved from cache`.cyan);
    }

    // Apply weather effects if requested
    if (includeWeather) {
      const weather = await weatherService.getWeather(latitude, longitude);
      pokemon = weatherService.applyWeatherEffects(pokemon, weather);
      pokemon.weatherEffectDescription = weatherService.getWeatherEffectDescription(
        pokemon.type,
        pokemon.secondaryType,
        weather
      );
    }

    return pokemon;
  } catch (error) {
    console.error(`❌ Error in getById(${id}):`.red, error);
    throw error;
  }
};

exports.create = async (pokemonData) => {
  try {
    const pokemon = await Pokemon.create(pokemonData);
    
    // Invalidate cache
    await redisService.del('pokemons:all');
    
    console.log(`✅ Pokemon ${pokemon.id} created`.green);
    return pokemon.toJSON();
  } catch (error) {
    console.error('❌ Error in create:'.red, error);
    throw error;
  }
};

exports.update = async (id, pokemonData) => {
  try {
    const pokemon = await Pokemon.findByPk(id);
    
    if (!pokemon) {
      return null;
    }

    await pokemon.update(pokemonData);
    
    // Invalidate cache
    await redisService.del(`pokemon:${id}`);
    await redisService.del('pokemons:all');
    
    console.log(`✅ Pokemon ${id} updated`.green);
    return pokemon.toJSON();
  } catch (error) {
    console.error(`❌ Error in update(${id}):`.red, error);
    throw error;
  }
};

exports.delete = async (id) => {
  try {
    const pokemon = await Pokemon.findByPk(id);
    
    if (!pokemon) {
      return false;
    }

    await pokemon.destroy();
    
    // Invalidate cache
    await redisService.del(`pokemon:${id}`);
    await redisService.del('pokemons:all');
    
    console.log(`✅ Pokemon ${id} deleted`.green);
    return true;
  } catch (error) {
    console.error(`❌ Error in delete(${id}):`.red, error);
    throw error;
  }
};

exports.searchByType = async (type, includeWeather = false, latitude = null, longitude = null) => {
  try {
    const cacheKey = `pokemons:type:${type}`;
    
    // Try cache first
    let pokemons = await redisService.get(cacheKey);
    
    if (!pokemons) {
      const pokemonInstances = await Pokemon.findAll({
        where: {
          type: type
        },
        order: [['id', 'ASC']]
      });
      
      pokemons = pokemonInstances.map(p => p.toJSON());
      
      // Cache the result
      await redisService.set(cacheKey, pokemons, cacheTTL);
      console.log(`📦 Pokemons of type ${type} fetched from database and cached`.green);
    } else {
      console.log(`🎯 Pokemons of type ${type} retrieved from cache`.cyan);
    }

    // Apply weather effects if requested
    if (includeWeather) {
      const weather = await weatherService.getWeather(latitude, longitude);
      pokemons = pokemons.map(pokemon => 
        weatherService.applyWeatherEffects(pokemon, weather)
      );
    }

    return pokemons;
  } catch (error) {
    console.error(`❌ Error in searchByType(${type}):`.red, error);
    throw error;
  }
};
