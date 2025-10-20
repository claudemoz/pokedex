const router = require('express').Router();
const pokemonController = require('@controllers/pokemon.controller');

// GET pokemons by type (must be before /:id to avoid conflict)
router.get('/type/:type', pokemonController.searchByType);

// GET all pokemons
router.get('/', pokemonController.getAll);

// GET pokemon by ID
router.get('/:id', pokemonController.getById);

// POST create new pokemon
router.post('/', pokemonController.create);

// PUT update pokemon
router.put('/:id', pokemonController.update);

// DELETE pokemon
router.delete('/:id', pokemonController.delete);

module.exports = router;

