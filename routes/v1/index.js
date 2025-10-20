const router = require('express').Router();

// Routes Pokemon
router.use('/pokemons', require('@routes/v1/pokemon.routes'));

// Routes Météo
router.use('/weather', require('@routes/v1/weather.routes'));

// Vérification de santé
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API opérationnelle',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
