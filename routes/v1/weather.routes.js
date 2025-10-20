const router = require('express').Router();
const pokemonController = require('@controllers/pokemon.controller');

// GET informations météo
router.get('/', pokemonController.getWeather);

module.exports = router;

