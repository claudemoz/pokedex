const router = require('express').Router();
const pokemonController = require('@controllers/pokemon.controller');

// GET pokemons par type (doit être avant /:id pour éviter les conflits)
router.get('/type/:type', pokemonController.searchByType);

// GET tous les pokemons
router.get('/', pokemonController.getAll);

// GET pokemon par ID
router.get('/:id', pokemonController.getById);

// POST créer un nouveau pokemon
router.post('/', pokemonController.create);

// PUT mettre à jour un pokemon
router.put('/:id', pokemonController.update);

// DELETE supprimer un pokemon
router.delete('/:id', pokemonController.delete);

module.exports = router;

