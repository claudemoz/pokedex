const promClient = require('prom-client');

// Créer un registre pour les métriques
const register = new promClient.Registry();

// Métriques par défaut (CPU, mémoire, etc.)
promClient.collectDefaultMetrics({ 
  register,
  prefix: 'pokedex_'
});

// Compteur de requêtes HTTP
const httpRequestsTotal = new promClient.Counter({
  name: 'pokedex_http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Durée des requêtes HTTP
const httpRequestDuration = new promClient.Histogram({
  name: 'pokedex_http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Compteur de requêtes à l'API Pokemon
const pokemonRequestsTotal = new promClient.Counter({
  name: 'pokedex_pokemon_requests_total',
  help: 'Total des requêtes pour les Pokémons',
  labelNames: ['operation'],
  registers: [register]
});

// Compteur de cache Redis
const redisCacheHits = new promClient.Counter({
  name: 'pokedex_redis_cache_hits_total',
  help: 'Total des hits du cache Redis',
  registers: [register]
});

const redisCacheMisses = new promClient.Counter({
  name: 'pokedex_redis_cache_misses_total',
  help: 'Total des miss du cache Redis',
  registers: [register]
});

// Gauge pour les connexions Redis
const redisConnections = new promClient.Gauge({
  name: 'pokedex_redis_connected',
  help: 'Statut de connexion Redis (1 = connecté, 0 = déconnecté)',
  registers: [register]
});

// Compteur d'erreurs
const errorsTotal = new promClient.Counter({
  name: 'pokedex_errors_total',
  help: 'Total des erreurs',
  labelNames: ['type'],
  registers: [register]
});

// Middleware pour tracer les requêtes HTTP
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
};

// Endpoint pour exposer les métriques
const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (err) {
    res.status(500).end(err);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  metricsEndpoint,
  metrics: {
    httpRequestsTotal,
    httpRequestDuration,
    pokemonRequestsTotal,
    redisCacheHits,
    redisCacheMisses,
    redisConnections,
    errorsTotal
  }
};

