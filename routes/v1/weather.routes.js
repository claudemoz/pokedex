const router = require('express').Router();
const pokemonController = require('@controllers/pokemon.controller');

/**
 * @swagger
 * /api/v1/weather:
 *   get:
 *     summary: Récupère les informations météo actuelles
 *     description: Retourne les conditions météo actuelles qui affectent les statistiques des Pokémons. La météo est récupérée via l'API OpenWeatherMap ou utilise des valeurs par défaut.
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Informations météo récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Weather'
 *             examples:
 *               sunny:
 *                 summary: Temps ensoleillé
 *                 value:
 *                   success: true
 *                   data:
 *                     main: "Clear"
 *                     description: "clear sky"
 *                     temp: 25.5
 *                     source: "OpenWeatherMap API"
 *               rainy:
 *                 summary: Temps pluvieux
 *                 value:
 *                   success: true
 *                   data:
 *                     main: "Rain"
 *                     description: "light rain"
 *                     temp: 15.2
 *                     source: "OpenWeatherMap API"
 *               default:
 *                 summary: Valeur par défaut (sans API key)
 *                 value:
 *                   success: true
 *                   data:
 *                     main: "Clear"
 *                     description: "clear sky"
 *                     temp: 20
 *                     source: "default"
 *       500:
 *         description: Erreur lors de la récupération de la météo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', pokemonController.getWeather);

module.exports = router;

