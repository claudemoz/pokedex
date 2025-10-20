const router = require('express').Router();

// Pokemon routes
router.use('/pokemons', require('@routes/v1/pokemon.routes'));

// Weather routes
router.use('/weather', require('@routes/v1/weather.routes'));

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
