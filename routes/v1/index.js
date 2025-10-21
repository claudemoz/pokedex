const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('@configs/swagger');


// Documentation Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pokédex API Documentation'
}));

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
