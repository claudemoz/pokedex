# 🔥 Pokedex API

Une API REST moderne pour gérer un Pokédex avec intégration de cache Redis et service météo.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Tests](#tests)
- [Docker](#docker)
- [Scripts disponibles](#scripts-disponibles)

## ✨ Fonctionnalités

- ✅ CRUD complet pour les Pokémons
- ✅ Recherche par type de Pokémon
- ✅ Cache Redis pour optimiser les performances
- ✅ Intégration d'API météo (OpenWeatherMap)
- ✅ ORM Sequelize avec PostgreSQL
- ✅ Rate limiting pour protéger l'API
- ✅ Sécurité avec Helmet
- ✅ CORS configuré
- ✅ Tests unitaires et d'intégration avec Jest
- ✅ Dockerisé avec Docker Compose
- ✅ Migrations et seeders de base de données

## 🛠 Technologies

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Base de données**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Sequelize
- **Tests**: Jest + Supertest
- **Containerisation**: Docker & Docker Compose
- **Autres**: Axios, Morgan, Helmet, CORS, Rate Limit

## 📦 Prérequis

- Node.js >= 18.x
- npm ou yarn
- Docker et Docker Compose (pour l'environnement conteneurisé)
- PostgreSQL (si exécution en local sans Docker)
- Redis (si exécution en local sans Docker)

## 🚀 Installation

### Option 1 : Avec Docker (recommandé)

1. **Cloner le repository**
```bash
git clone <repository-url>
cd pokedex
```

2. **Créer un fichier .env**
```bash
# Créer le fichier .env à la racine du projet
cp .env.example .env
```

Ajouter votre clé API OpenWeatherMap :
```env
WEATHER_API_KEY=votre_clé_api_ici
```

3. **Lancer avec Docker Compose**
```bash
docker-compose up --build
```

L'application sera accessible sur `http://localhost:9000`

### Option 2 : Installation locale

1. **Cloner le repository**
```bash
git clone <repository-url>
cd pokedex
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine :
```env
NODE_ENV=development
PORT=9000

# Database
DEV_DB_USERNAME=postgres
DEV_DB_PASSWORD=postgres
DEV_DB_NAME=pokedex
DEV_DB_HOSTNAME=localhost
DEV_DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CACHE_TTL=3600

# Weather API
WEATHER_API_KEY=votre_clé_api_ici
WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
DEFAULT_LATITUDE=48.8566
DEFAULT_LONGITUDE=2.3522
```

4. **Créer la base de données PostgreSQL**
```bash
createdb pokedex
```

5. **Lancer les migrations et seeders**
```bash
npm run db:migrate
npm run db:seed
```

6. **Démarrer l'application**
```bash
npm start
# ou en mode développement avec nodemon
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NODE_ENV` | Environnement (development/production) | `development` |
| `PORT` | Port du serveur | `9000` |
| `DEV_DB_USERNAME` | Utilisateur PostgreSQL | `postgres` |
| `DEV_DB_PASSWORD` | Mot de passe PostgreSQL | `postgres` |
| `DEV_DB_NAME` | Nom de la base de données | `pokedex` |
| `DEV_DB_HOSTNAME` | Hôte PostgreSQL | `localhost` |
| `DEV_DB_PORT` | Port PostgreSQL | `5432` |
| `REDIS_HOST` | Hôte Redis | `localhost` |
| `REDIS_PORT` | Port Redis | `6379` |
| `REDIS_CACHE_TTL` | Durée du cache (secondes) | `3600` |
| `WEATHER_API_KEY` | Clé API OpenWeatherMap | - |
| `WEATHER_API_URL` | URL de l'API météo | OpenWeatherMap URL |
| `DEFAULT_LATITUDE` | Latitude par défaut (Paris) | `48.8566` |
| `DEFAULT_LONGITUDE` | Longitude par défaut (Paris) | `2.3522` |

### Obtenir une clé API OpenWeatherMap

1. Créer un compte sur [OpenWeatherMap](https://openweathermap.org/)
2. Aller dans la section API Keys
3. Copier votre clé API
4. L'ajouter dans votre fichier `.env`

## 📖 Utilisation

### Lancer le serveur

```bash
# Production
npm start

# Développement (avec auto-reload)
npm run dev
```

### Tester l'API

Le projet inclut un script de test :
```bash
./test-api.sh
```

Ou utilisez curl/Postman/Insomnia pour tester les endpoints.

## 🌐 API Endpoints

### Base URL
```
http://localhost:9000/api/v1
```

### Pokémons

#### 📋 Récupérer tous les Pokémons
```http
GET /api/v1/pokemons
```

**Paramètres de requête** :
- `weather` (boolean) : Inclure les informations météo
- `lat` (float) : Latitude pour la météo
- `lon` (float) : Longitude pour la météo

**Exemple** :
```bash
curl http://localhost:9000/api/v1/pokemons
curl http://localhost:9000/api/v1/pokemons?weather=true&lat=48.8566&lon=2.3522
```

**Réponse** :
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "Bulbizarre",
      "type": "grass",
      "secondaryType": "poison",
      "baseAttack": 49,
      "baseDefense": 49,
      "baseHP": 45,
      "height": 0.7,
      "weight": 6.9,
      "description": "Il a une étrange graine plantée sur son dos...",
      "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      "createdAt": "2024-10-20T10:00:00.000Z",
      "updatedAt": "2024-10-20T10:00:00.000Z"
    }
  ]
}
```

#### 🔍 Récupérer un Pokémon par ID
```http
GET /api/v1/pokemons/:id
```

**Exemple** :
```bash
curl http://localhost:9000/api/v1/pokemons/1
```

#### 🔎 Rechercher par type
```http
GET /api/v1/pokemons/type/:type
```

**Types disponibles** : `fire`, `water`, `grass`, `electric`, `ice`, `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`, `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`, `normal`

**Exemple** :
```bash
curl http://localhost:9000/api/v1/pokemons/type/fire
```

#### ➕ Créer un Pokémon
```http
POST /api/v1/pokemons
```

**Corps de la requête** :
```json
{
  "name": "Pikachu",
  "type": "electric",
  "baseAttack": 55,
  "baseDefense": 40,
  "baseHP": 35,
  "height": 0.4,
  "weight": 6.0,
  "description": "Ce Pokémon électrique est très populaire",
  "imageUrl": "https://example.com/pikachu.png"
}
```

**Champs obligatoires** : `name`, `type`

**Exemple** :
```bash
curl -X POST http://localhost:9000/api/v1/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name":"Pikachu","type":"electric","baseAttack":55}'
```

#### ✏️ Mettre à jour un Pokémon
```http
PUT /api/v1/pokemons/:id
```

**Exemple** :
```bash
curl -X PUT http://localhost:9000/api/v1/pokemons/1 \
  -H "Content-Type: application/json" \
  -d '{"baseAttack":60}'
```

#### ❌ Supprimer un Pokémon
```http
DELETE /api/v1/pokemons/:id
```

**Exemple** :
```bash
curl -X DELETE http://localhost:9000/api/v1/pokemons/1
```

### Météo

#### 🌤️ Récupérer les informations météo
```http
GET /api/v1/weather
```

**Paramètres de requête** :
- `lat` (float) : Latitude (optionnel, utilise Paris par défaut)
- `lon` (float) : Longitude (optionnel, utilise Paris par défaut)

**Exemple** :
```bash
curl http://localhost:9000/api/v1/weather
curl "http://localhost:9000/api/v1/weather?lat=45.5017&lon=-73.5673"
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "location": "Paris",
    "temperature": 15.5,
    "description": "Partly cloudy",
    "humidity": 65,
    "windSpeed": 12.5
  }
}
```

## 🏗️ Architecture

```
pokedex/
├── __tests__/              # Tests unitaires et d'intégration
│   ├── pokemon.test.js
│   ├── redis.test.js
│   ├── weather.test.js
│   └── setup.js
├── app/                    # Configuration Express
│   └── index.js
├── config/                 # Configuration de la base de données
│   └── database/
│       └── config.js
├── controllers/            # Contrôleurs de l'API
│   └── pokemon.controller.js
├── models/                 # Modèles Sequelize
│   ├── index.js
│   └── Pokemon.js
├── routes/                 # Routes de l'API
│   └── v1/
│       ├── index.js
│       ├── pokemon.routes.js
│       └── weather.routes.js
├── services/               # Logique métier
│   ├── pokemon.service.js
│   ├── redis.service.js
│   └── weather.service.js
├── migrations/             # Migrations de base de données
│   └── 20251020100212-create-pokemon.js
├── seeders/                # Données de test
│   └── 20251020000001-demo-pokemon.js
├── docker-compose.yml      # Configuration Docker Compose
├── Dockerfile              # Image Docker de l'application
├── main.js                 # Point d'entrée de l'application
├── package.json
└── README.md
```

### Modèle Pokemon

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | Oui (auto) | Identifiant unique |
| `name` | STRING | Oui | Nom du Pokémon (unique) |
| `type` | ENUM | Oui | Type principal |
| `secondaryType` | ENUM | Non | Type secondaire |
| `baseAttack` | INTEGER | Oui | Attaque de base (1-200) |
| `baseDefense` | INTEGER | Oui | Défense de base (1-200) |
| `baseHP` | INTEGER | Oui | Points de vie de base (1-300) |
| `height` | FLOAT | Non | Taille en mètres |
| `weight` | FLOAT | Non | Poids en kilogrammes |
| `description` | TEXT | Non | Description du Pokémon |
| `imageUrl` | STRING | Non | URL de l'image |
| `createdAt` | TIMESTAMP | Oui (auto) | Date de création |
| `updatedAt` | TIMESTAMP | Oui (auto) | Date de modification |

### Services

- **pokemon.service.js** : Logique métier pour les opérations CRUD des Pokémons, intégration du cache Redis
- **redis.service.js** : Gestion de la connexion Redis et des opérations de cache
- **weather.service.js** : Intégration avec l'API OpenWeatherMap

### Middleware

- **Helmet** : Sécurité des en-têtes HTTP
- **CORS** : Gestion des requêtes cross-origin
- **Rate Limit** : Limitation à 100 requêtes par 15 minutes
- **Morgan** : Logs des requêtes HTTP (en développement)

## 🧪 Tests

Le projet utilise Jest pour les tests unitaires et d'intégration.

### Lancer tous les tests
```bash
npm test
```

### Lancer les tests en mode watch
```bash
npm run test:watch
```

### Coverage des tests
```bash
npm test
# Le rapport de couverture sera généré automatiquement
```

### Tests disponibles

- **pokemon.test.js** : Tests des endpoints Pokémon
- **redis.test.js** : Tests du service Redis
- **weather.test.js** : Tests du service météo

## 🐳 Docker

### Architecture Docker

Le projet utilise Docker Compose avec 3 services :

1. **postgres** : Base de données PostgreSQL 15
2. **redis** : Cache Redis 7
3. **app** : Application Node.js

### Commandes Docker

**Démarrer les services** :
```bash
docker-compose up
```

**Démarrer en arrière-plan** :
```bash
docker-compose up -d
```

**Reconstruire les images** :
```bash
docker-compose up --build
```

**Voir les logs** :
```bash
docker-compose logs -f app
```

**Arrêter les services** :
```bash
docker-compose down
```

**Arrêter et supprimer les volumes** :
```bash
docker-compose down -v
```

**Accéder au conteneur de l'application** :
```bash
docker exec -it pokedex_app sh
```

**Accéder à PostgreSQL** :
```bash
docker exec -it pokedex_postgres psql -U postgres -d pokedex
```

**Accéder à Redis CLI** :
```bash
docker exec -it pokedex_redis redis-cli
```

### Consulter les données Redis

Redis est utilisé comme cache pour améliorer les performances de l'API. Voici comment visualiser les données en cache :

**1. Accéder au CLI Redis** :
```bash
# Avec Docker
docker exec -it pokedex_redis redis-cli

# Ou en local
redis-cli
```

**2. Commandes Redis utiles** :

```bash
# Voir toutes les clés en cache
KEYS *

# Voir une clé spécifique (par exemple pour un Pokémon avec ID 1)
GET pokemon:1

# Voir tous les Pokémons en cache
GET pokemons:all

# Voir les données météo en cache
KEYS weather:*
GET "weather:48.8566:2.3522"

# Voir le TTL (Time To Live) d'une clé en secondes
TTL pokemon:1

# Voir le type de données d'une clé
TYPE pokemon:1

# Compter le nombre total de clés
DBSIZE

# Voir des informations sur Redis
INFO

# Supprimer une clé spécifique
DEL pokemon:1

# Supprimer toutes les clés (attention !)
FLUSHALL

# Quitter le CLI Redis
EXIT
```

**3. Exemple de session Redis** :
```bash
$ docker exec -it pokedex_redis redis-cli
127.0.0.1:6379> KEYS *
1) "pokemons:all"
2) "pokemon:1"
3) "weather:48.8566:2.3522"
4) "pokemons:type:fire"

127.0.0.1:6379> GET pokemon:1
"{\"id\":1,\"name\":\"Bulbizarre\",\"type\":\"grass\",...}"

127.0.0.1:6379> TTL pokemon:1
(integer) 3456

127.0.0.1:6379> DBSIZE
(integer) 4

127.0.0.1:6379> EXIT
```

**4. Surveiller les opérations en temps réel** :
```bash
# Voir toutes les commandes exécutées sur Redis
docker exec -it pokedex_redis redis-cli MONITOR
```

**5. Vider le cache** :

Si vous voulez forcer le rafraîchissement du cache :
```bash
# Via le CLI Redis
docker exec -it pokedex_redis redis-cli FLUSHALL

# Ou redémarrer Redis
docker-compose restart redis
```

**Structure des clés en cache** :

L'application utilise les clés suivantes :
- `pokemons:all` : Liste de tous les Pokémons
- `pokemon:{id}` : Détails d'un Pokémon spécifique
- `pokemons:type:{type}` : Liste des Pokémons par type
- `weather:{lat}:{lon}` : Données météo pour une position

Le TTL par défaut est de 3600 secondes (1 heure), configurable via `REDIS_CACHE_TTL`.

### Health Checks

Les services incluent des health checks :
- **PostgreSQL** : Vérifie la disponibilité avec `pg_isready`
- **Redis** : Vérifie la disponibilité avec `redis-cli ping`

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre l'application en mode production |
| `npm run dev` | Démarre l'application en mode développement avec nodemon |
| `npm test` | Lance les tests avec coverage |
| `npm run test:watch` | Lance les tests en mode watch |
| `npm run db:migrate` | Applique les migrations de base de données |
| `npm run db:seed` | Remplit la base avec des données de test |
| `npm run db:reset` | Réinitialise complètement la base de données |

## 🔐 Sécurité

- **Helmet** : Protection contre les vulnérabilités web communes
- **Rate Limiting** : Protection contre les abus et DDoS
- **CORS** : Contrôle des origines autorisées
- **Validation des données** : Validation avec Sequelize
- **Variables d'environnement** : Gestion sécurisée des secrets

## 📝 Bonnes pratiques

- ✅ Architecture MVC (Modèle-Vue-Contrôleur)
- ✅ Séparation des préoccupations (services, contrôleurs, routes)
- ✅ Gestion des erreurs centralisée
- ✅ Cache Redis pour les performances
- ✅ Tests automatisés
- ✅ Migrations de base de données versionnées
- ✅ Configuration par variables d'environnement
- ✅ Logs structurés
- ✅ Docker pour la portabilité

## 🐛 Dépannage

### Problème de connexion à PostgreSQL

Si vous obtenez une erreur de connexion :
```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker-compose ps

# Redémarrer les services
docker-compose restart postgres app
```

### Problème de connexion à Redis

```bash
# Vérifier que Redis est en cours d'exécution
docker exec -it pokedex_redis redis-cli ping
# Devrait retourner "PONG"
```

### Problème avec les migrations

```bash
# Réinitialiser la base de données
npm run db:reset
```

### Port déjà utilisé

Si le port 9000 est déjà utilisé :
```bash
# Modifier le port dans docker-compose.yml et .env
# Ou arrêter le processus utilisant le port
lsof -ti:9000 | xargs kill -9  # macOS/Linux
```

## 📄 Licence

ISC

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur le repository.

---

**Fait avec ❤️ et Node.js**

