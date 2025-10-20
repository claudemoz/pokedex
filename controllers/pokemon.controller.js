const pokemonService = require('@services/pokemon.service');
const weatherService = require('@services/weather.service');

exports.getAll = async (req, res) => {
  try {
    const includeWeather = req.query.weather === 'true';
    const latitude = req.query.lat ? parseFloat(req.query.lat) : null;
    const longitude = req.query.lon ? parseFloat(req.query.lon) : null;

    const pokemons = await pokemonService.getAll(includeWeather, latitude, longitude);

    return res.status(200).json({
      success: true,
      count: pokemons.length,
      data: pokemons
    });
  } catch (error) {
    console.error('Error in getAll controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des Pokémons',
      error: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeWeather = req.query.weather === 'true';
    const latitude = req.query.lat ? parseFloat(req.query.lat) : null;
    const longitude = req.query.lon ? parseFloat(req.query.lon) : null;

    const pokemon = await pokemonService.getById(id, includeWeather, latitude, longitude);

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        message: `Pokémon avec l'ID ${id} non trouvé`
      });
    }

    return res.status(200).json({
      success: true,
      data: pokemon
    });
  } catch (error) {
    console.error('Error in getById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du Pokémon',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const pokemonData = req.body;

    // Validation basique
    if (!pokemonData.name || !pokemonData.type) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et le type sont requis'
      });
    }

    const pokemon = await pokemonService.create(pokemonData);

    return res.status(201).json({
      success: true,
      message: 'Pokémon créé avec succès',
      data: pokemon
    });
  } catch (error) {
    console.error('Error in create controller:', error);
    
    // Gérer l'erreur de contrainte unique
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Un Pokémon avec ce nom existe déjà',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du Pokémon',
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const pokemonData = req.body;

    const pokemon = await pokemonService.update(id, pokemonData);

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        message: `Pokémon avec l'ID ${id} non trouvé`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pokémon mis à jour avec succès',
      data: pokemon
    });
  } catch (error) {
    console.error('Error in update controller:', error);

    // Gérer l'erreur de contrainte unique
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Un Pokémon avec ce nom existe déjà',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du Pokémon',
      error: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pokemonService.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Pokémon avec l'ID ${id} non trouvé`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pokémon supprimé avec succès'
    });
  } catch (error) {
    console.error('Error in delete controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du Pokémon',
      error: error.message
    });
  }
};

exports.searchByType = async (req, res) => {
  try {
    const { type } = req.params;
    const includeWeather = req.query.weather === 'true';
    const latitude = req.query.lat ? parseFloat(req.query.lat) : null;
    const longitude = req.query.lon ? parseFloat(req.query.lon) : null;

    const pokemons = await pokemonService.searchByType(type, includeWeather, latitude, longitude);

    return res.status(200).json({
      success: true,
      count: pokemons.length,
      type: type,
      data: pokemons
    });
  } catch (error) {
    console.error('Error in searchByType controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des Pokémons par type',
      error: error.message
    });
  }
};

exports.getWeather = async (req, res) => {
  try {
    const latitude = req.query.lat ? parseFloat(req.query.lat) : null;
    const longitude = req.query.lon ? parseFloat(req.query.lon) : null;

    const weather = await weatherService.getWeather(latitude, longitude);

    return res.status(200).json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('Error in getWeather controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la météo',
      error: error.message
    });
  }
};
