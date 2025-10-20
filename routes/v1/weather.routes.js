const router = require('express').Router();
const pokemonController = require('@controllers/pokemon.controller');

// GET weather information
router.get('/', pokemonController.getWeather);

module.exports = router;

