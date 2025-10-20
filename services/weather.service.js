const axios = require('axios');
const redisService = require('./redis.service');

const apiKey = process.env.WEATHER_API_KEY;
const apiUrl = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5/weather';
const cacheTTL = parseInt(process.env.REDIS_CACHE_TTL) || 3600;

// Weather conditions that affect Pokemon types
const weatherEffects = {
  Rain: {
    weakens: ['fire'],
    strengthens: ['water', 'grass', 'electric']
  },
  Drizzle: {
    weakens: ['fire'],
    strengthens: ['water', 'grass']
  },
  Thunderstorm: {
    weakens: ['fire', 'flying'],
    strengthens: ['electric', 'water']
  },
  Snow: {
    weakens: ['fire', 'grass', 'ground'],
    strengthens: ['ice', 'water']
  },
  Clear: {
    weakens: ['ice', 'water'],
    strengthens: ['fire', 'grass']
  },
  Clouds: {
    weakens: [],
    strengthens: []
  },
  Mist: {
    weakens: ['fire'],
    strengthens: ['water', 'ghost']
  },
  Fog: {
    weakens: ['fire'],
    strengthens: ['ghost', 'dark']
  }
};

exports.getWeather = async (latitude = null, longitude = null) => {
  // Use default coordinates if not provided
  const lat = latitude || process.env.DEFAULT_LATITUDE || 48.8566;
  const lon = longitude || process.env.DEFAULT_LONGITUDE || 2.3522;
  
  const cacheKey = `weather:${lat}:${lon}`;
  
  // Try to get from cache first
  const cachedWeather = await redisService.get(cacheKey);
  if (cachedWeather) {
    console.log('🎯 Weather data retrieved from cache'.cyan);
    return cachedWeather;
  }

  // If not in cache, fetch from API
  try {
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('⚠️  No valid weather API key, using default weather'.yellow);
      const defaultWeather = {
        main: 'Clear',
        description: 'clear sky',
        temp: 20,
        source: 'default'
      };
      return defaultWeather;
    }

    const response = await axios.get(apiUrl, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric'
      }
    });

    const weatherData = {
      main: response.data.weather[0].main,
      description: response.data.weather[0].description,
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      location: response.data.name,
      source: 'api'
    };

    // Store in cache
    await redisService.set(cacheKey, weatherData, cacheTTL);
    console.log('🌤️  Weather data fetched from API and cached'.green);

    return weatherData;
  } catch (error) {
    console.error('❌ Error fetching weather data:'.red, error.message);
    
    // Return default weather in case of error
    const defaultWeather = {
      main: 'Clear',
      description: 'clear sky',
      temp: 20,
      source: 'default',
      error: error.message
    };
    
    return defaultWeather;
  }
};

exports.calculatePokemonModifiers = (pokemonType, secondaryType, weather) => {
  const weatherMain = weather.main || 'Clear';
  const effects = weatherEffects[weatherMain] || weatherEffects.Clear;
  
  let attackModifier = 1.0;
  let defenseModifier = 1.0;
  
  // Check primary type
  if (effects.weakens.includes(pokemonType)) {
    attackModifier *= 0.7;
    defenseModifier *= 0.8;
  }
  if (effects.strengthens.includes(pokemonType)) {
    attackModifier *= 1.3;
    defenseModifier *= 1.2;
  }
  
  // Check secondary type if exists
  if (secondaryType) {
    if (effects.weakens.includes(secondaryType)) {
      attackModifier *= 0.85;
      defenseModifier *= 0.9;
    }
    if (effects.strengthens.includes(secondaryType)) {
      attackModifier *= 1.15;
      defenseModifier *= 1.1;
    }
  }
  
  return {
    attackModifier,
    defenseModifier,
    weatherCondition: weatherMain,
    weatherDescription: weather.description,
    affected: attackModifier !== 1.0 || defenseModifier !== 1.0
  };
};

exports.applyWeatherEffects = (pokemon, weather) => {
  const modifiers = exports.calculatePokemonModifiers(
    pokemon.type,
    pokemon.secondaryType,
    weather
  );
  
  return {
    ...pokemon,
    currentAttack: Math.round(pokemon.baseAttack * modifiers.attackModifier),
    currentDefense: Math.round(pokemon.baseDefense * modifiers.defenseModifier),
    weatherEffect: {
      ...modifiers,
      baseAttack: pokemon.baseAttack,
      baseDefense: pokemon.baseDefense
    }
  };
};

exports.getWeatherEffectDescription = (pokemonType, secondaryType, weather) => {
  const modifiers = exports.calculatePokemonModifiers(pokemonType, secondaryType, weather);
  
  if (!modifiers.affected) {
    return `Le temps actuel (${modifiers.weatherCondition}) n'affecte pas ce Pokémon.`;
  }
  
  let description = `Conditions météo: ${modifiers.weatherDescription}. `;
  
  if (modifiers.attackModifier < 1.0 || modifiers.defenseModifier < 1.0) {
    description += `Ce Pokémon est affaibli par ce temps! `;
    description += `Attaque: ${Math.round((modifiers.attackModifier - 1) * 100)}%, `;
    description += `Défense: ${Math.round((modifiers.defenseModifier - 1) * 100)}%`;
  } else if (modifiers.attackModifier > 1.0 || modifiers.defenseModifier > 1.0) {
    description += `Ce Pokémon est renforcé par ce temps! `;
    description += `Attaque: +${Math.round((modifiers.attackModifier - 1) * 100)}%, `;
    description += `Défense: +${Math.round((modifiers.defenseModifier - 1) * 100)}%`;
  }
  
  return description;
};
