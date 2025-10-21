const router = require('express').Router();
const pokemonController = require('@controllers/pokemon.controller');

/**
 * @swagger
 * /api/v1/pokemons/type/{type}:
 *   get:
 *     summary: Recherche des Pokémons par type
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type du Pokémon à rechercher
 *         example: fire
 *       - in: query
 *         name: weather
 *         schema:
 *           type: boolean
 *         description: Inclure les effets météo
 *         example: true
 *     responses:
 *       200:
 *         description: Liste des Pokémons du type spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 type:
 *                   type: string
 *                   example: fire
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/type/:type', pokemonController.searchByType);

/**
 * @swagger
 * /api/v1/pokemons:
 *   get:
 *     summary: Récupère tous les Pokémons
 *     tags: [Pokemons]
 *     parameters:
 *       - in: query
 *         name: weather
 *         schema:
 *           type: boolean
 *         description: Inclure les effets météo sur les statistiques
 *         example: true
 *     responses:
 *       200:
 *         description: Liste de tous les Pokémons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', pokemonController.getAll);

/**
 * @swagger
 * /api/v1/pokemons/{id}:
 *   get:
 *     summary: Récupère un Pokémon par son ID
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon
 *         example: 1
 *       - in: query
 *         name: weather
 *         schema:
 *           type: boolean
 *         description: Inclure les effets météo sur les statistiques
 *         example: true
 *     responses:
 *       200:
 *         description: Détails du Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', pokemonController.getById);

/**
 * @swagger
 * /api/v1/pokemons:
 *   post:
 *     summary: Crée un nouveau Pokémon
 *     tags: [Pokemons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - baseAttack
 *               - baseDefense
 *               - baseHP
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pikachu
 *               type:
 *                 type: string
 *                 example: electric
 *               secondaryType:
 *                 type: string
 *                 example: flying
 *               baseAttack:
 *                 type: integer
 *                 example: 55
 *               baseDefense:
 *                 type: integer
 *                 example: 40
 *               baseHP:
 *                 type: integer
 *                 example: 35
 *               height:
 *                 type: number
 *                 example: 0.4
 *               weight:
 *                 type: number
 *                 example: 6.0
 *               description:
 *                 type: string
 *                 example: Un Pokémon souris électrique
 *     responses:
 *       201:
 *         description: Pokémon créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pokémon créé avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Un Pokémon avec ce nom existe déjà
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', pokemonController.create);

/**
 * @swagger
 * /api/v1/pokemons/{id}:
 *   put:
 *     summary: Met à jour un Pokémon existant
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon à mettre à jour
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pikachu Évolution
 *               type:
 *                 type: string
 *                 example: electric
 *               secondaryType:
 *                 type: string
 *                 example: fighting
 *               baseAttack:
 *                 type: integer
 *                 example: 60
 *               baseDefense:
 *                 type: integer
 *                 example: 45
 *               baseHP:
 *                 type: integer
 *                 example: 40
 *               height:
 *                 type: number
 *                 example: 0.5
 *               weight:
 *                 type: number
 *                 example: 7.0
 *               description:
 *                 type: string
 *                 example: Description mise à jour
 *     responses:
 *       200:
 *         description: Pokémon mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pokémon mis à jour avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', pokemonController.update);

/**
 * @swagger
 * /api/v1/pokemons/{id}:
 *   delete:
 *     summary: Supprime un Pokémon
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Pokémon supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pokémon supprimé avec succès
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', pokemonController.delete);

module.exports = router;

