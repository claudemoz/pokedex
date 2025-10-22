# 🔧 Résolution : Pas de données dans les dashboards Grafana

## ❓ Problème

Vous ne voyez pas les données dans les dashboards Grafana car l'API n'expose pas encore les métriques Prometheus.

## ✅ Solution (Développement)

### Étape 1 : Reconstruire l'API avec la nouvelle dépendance

```bash
# Arrêter les services
docker compose down

# Reconstruire l'API (installe prom-client)
docker compose build --no-cache api

# Redémarrer tous les services
docker compose up -d
```

### Étape 2 : Vérifier que les métriques sont exposées

```bash
# Attendre 30 secondes que l'API démarre

# Tester l'endpoint /metrics
curl http://localhost:9000/metrics

# Vous devriez voir des métriques comme :
# pokedex_http_requests_total{...}
# pokedex_process_cpu_user_seconds_total
# etc.
```

### Étape 3 : Vérifier Prometheus

1. Ouvrez http://localhost:9090
2. Allez dans **Status** → **Targets**
3. Vérifiez que le target `pokedex-api` est **UP** (vert)
4. Si rouge, regardez l'erreur affichée

### Étape 4 : Générer du trafic

```bash
# Faire quelques requêtes pour générer des métriques
curl http://localhost:9000/api/v1/pokemon
curl http://localhost:9000/api/v1/pokemon/1
curl http://localhost:9000/api/v1/weather
```

### Étape 5 : Vérifier dans Prometheus

1. Ouvrez http://localhost:9090
2. Dans la barre de recherche, tapez : `pokedex_http_requests_total`
3. Cliquez sur **Execute**
4. Vous devriez voir des données

### Étape 6 : Importer un dashboard dans Grafana

1. Ouvrez http://localhost:3000 (admin/admin)
2. Cliquez sur **+** → **Import**
3. Entrez l'ID : `11159` (Node.js Dashboard)
4. Sélectionnez **Prometheus** comme Data Source
5. Cliquez sur **Import**

### Étape 7 : Créer un dashboard personnalisé

1. Dans Grafana, cliquez sur **+** → **Dashboard** → **Add new panel**
2. Dans le champ **Metric**, entrez :
   ```promql
   rate(pokedex_http_requests_total[1m])
   ```
3. Configurez :
   - **Title** : "Requêtes par seconde"
   - **Visualization** : Graph
4. Cliquez sur **Apply**
5. Sauvegardez le dashboard (icône disquette en haut)

---

## 🚨 Si ça ne fonctionne toujours pas

### Vérifier les logs

```bash
# Logs de l'API
docker compose logs api | tail -50

# Logs de Prometheus
docker compose logs prometheus | tail -50

# Vérifier si l'API a démarré correctement
docker compose ps
```

### Vérifier la connexion réseau

```bash
# Depuis le conteneur Prometheus, tester l'accès à l'API
docker exec prometheus wget -qO- http://api:9000/metrics
```

### Vérifier la configuration Prometheus

```bash
# Afficher la config
docker exec prometheus cat /etc/prometheus/prometheus.yml

# Vérifier qu'il y a bien :
# - job_name: 'pokedex-api'
#   static_configs:
#     - targets: ['api:9000']
#   metrics_path: '/metrics'
```

---

## 📋 Checklist de vérification

- [ ] `package.json` contient `"prom-client": "^15.1.0"`
- [ ] `middlewares/metrics.middleware.js` existe
- [ ] `app/index.js` importe et utilise le middleware
- [ ] Conteneur API reconstruit : `docker compose build api`
- [ ] Services redémarrés : `docker compose up -d`
- [ ] Endpoint metrics accessible : `curl http://localhost:9000/metrics`
- [ ] Prometheus target UP : http://localhost:9090/targets
- [ ] Données visibles dans Prometheus : recherchez `pokedex_http_requests_total`
- [ ] Dashboard importé dans Grafana

---

## 💡 Métriques disponibles après installation

Une fois configuré, vous aurez accès à :

| Métrique | Description |
|----------|-------------|
| `pokedex_http_requests_total` | Nombre total de requêtes HTTP |
| `pokedex_http_request_duration_seconds` | Durée des requêtes |
| `pokedex_pokemon_requests_total` | Requêtes Pokémon |
| `pokedex_redis_cache_hits_total` | Cache hits Redis |
| `pokedex_redis_cache_misses_total` | Cache misses Redis |
| `pokedex_redis_connected` | Statut connexion Redis |
| `pokedex_errors_total` | Total des erreurs |
| `pokedex_process_cpu_user_seconds_total` | CPU utilisé |
| `pokedex_process_resident_memory_bytes` | Mémoire utilisée |

---

**Après ces étapes, vos dashboards devraient afficher les données ! 📊✨**

