# 📊 Guide des Métriques et Logs - Pokedex API

## 🎯 Vue d'ensemble

Ce guide vous explique comment monitorer votre application Pokedex avec **Prometheus** et **Grafana**, ainsi que comment consulter les logs.

---

## 📊 **Métriques avec Prometheus & Grafana**

### 1. Accès aux services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin / admin |
| **API Metrics** | http://localhost:9000/metrics | - |

### 2. Démarrer les services

```bash
# Démarrer tous les services
docker compose up -d

# Vérifier que tous les conteneurs sont lancés
docker compose ps
```

### 3. Métriques disponibles

L'API expose automatiquement ces métriques sur `/metrics` :

#### **Métriques système**
- `pokedex_process_cpu_user_seconds_total` - CPU utilisé
- `pokedex_process_resident_memory_bytes` - Mémoire utilisée
- `pokedex_nodejs_heap_size_total_bytes` - Taille du heap Node.js

#### **Métriques HTTP**
- `pokedex_http_requests_total` - Total des requêtes HTTP
- `pokedex_http_request_duration_seconds` - Durée des requêtes

#### **Métriques métier**
- `pokedex_pokemon_requests_total` - Requêtes Pokémon
- `pokedex_redis_cache_hits_total` - Hits du cache Redis
- `pokedex_redis_cache_misses_total` - Miss du cache Redis
- `pokedex_redis_connected` - Statut de connexion Redis
- `pokedex_errors_total` - Total des erreurs

### 4. Utiliser Prometheus

1. Ouvrez http://localhost:9090
2. Dans la barre de recherche, tapez le nom d'une métrique (ex: `pokedex_http_requests_total`)
3. Cliquez sur **Execute** pour voir les données
4. Utilisez l'onglet **Graph** pour visualiser

**Exemples de requêtes PromQL** :

```promql
# Taux de requêtes HTTP par seconde
rate(pokedex_http_requests_total[5m])

# Taux d'erreurs HTTP 5xx
sum(rate(pokedex_http_requests_total{status_code=~"5.."}[5m]))

# Taux de cache hit ratio
pokedex_redis_cache_hits_total / (pokedex_redis_cache_hits_total + pokedex_redis_cache_misses_total)

# P95 de la durée des requêtes
histogram_quantile(0.95, rate(pokedex_http_request_duration_seconds_bucket[5m]))

# Nombre de requêtes par route
sum by (route) (pokedex_http_requests_total)
```

### 5. Configurer Grafana

#### **Première connexion**
1. Ouvrez http://localhost:3000
2. Login : `admin` / Mot de passe : `admin`
3. Changez le mot de passe (ou cliquez sur "Skip")

#### **Importer des dashboards**

Grafana est déjà configuré avec Prometheus comme source de données !

**Importer des dashboards pré-configurés** :

1. Cliquez sur **"+"** → **"Import"**
2. Entrez un ID de dashboard :
   - **Node.js Application Dashboard** : `11159`
   - **Docker & System Monitoring** : `893`
   - **PostgreSQL Database** : `9628`
   - **Redis** : `11835`
3. Sélectionnez **"Prometheus"** comme source de données
4. Cliquez sur **"Import"**

#### **Créer un dashboard personnalisé**

1. Cliquez sur **"+"** → **"Dashboard"** → **"Add new panel"**
2. Dans le champ **"Metric"**, entrez une requête PromQL
3. Configurez la visualisation (Graph, Gauge, Table, etc.)
4. Cliquez sur **"Apply"**
5. Sauvegardez le dashboard

**Exemple de panels utiles** :

| Panel | Query |
|-------|-------|
| Requêtes/seconde | `rate(pokedex_http_requests_total[1m])` |
| Taux d'erreurs | `rate(pokedex_errors_total[5m])` |
| Durée moyenne requêtes | `rate(pokedex_http_request_duration_seconds_sum[5m]) / rate(pokedex_http_request_duration_seconds_count[5m])` |
| Cache hit ratio | `pokedex_redis_cache_hits_total / (pokedex_redis_cache_hits_total + pokedex_redis_cache_misses_total) * 100` |

---

## 📝 **Logs avec Docker**

### 1. Voir les logs en temps réel

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f api
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f prometheus
docker compose logs -f grafana
```

### 2. Filtrer les logs

```bash
# Dernières 100 lignes
docker compose logs --tail=100 -f api

# Depuis une date spécifique
docker compose logs --since 2024-01-01T10:00:00 api

# Dernières 30 minutes
docker compose logs --since 30m api

# Sans suivre (pas de -f)
docker compose logs --tail=50 api
```

### 3. Logs d'un conteneur spécifique par ID

```bash
# Trouver l'ID du conteneur
docker ps

# Voir les logs
docker logs --tail=100 -f <CONTAINER_ID>
```

### 4. Exporter les logs

```bash
# Sauvegarder dans un fichier
docker compose logs api > logs_api.txt

# Avec horodatage
docker compose logs --timestamps api > logs_api_with_time.txt
```

### 5. Analyser les logs

```bash
# Filtrer les erreurs
docker compose logs api | grep -i error

# Compter les occurrences
docker compose logs api | grep -c "ERROR"

# Filtrer par code HTTP
docker compose logs api | grep "GET /api"
```

---

## 🚀 **Commandes utiles**

### Gestion des services

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Redémarrer un service
docker compose restart api

# Voir l'état
docker compose ps

# Voir l'utilisation des ressources
docker stats
```

### Nettoyage

```bash
# Supprimer les conteneurs et volumes
docker compose down -v

# Nettoyer les images inutilisées
docker system prune -a
```

---

## 🎯 **Métriques en production**

Pour la production, déployez Prometheus et Grafana sur un hôte séparé :

### Architecture recommandée

```
┌─────────────────┐
│  Serveur App    │
│  (API + DB)     │──┐
└─────────────────┘  │
                      │  Scraping
┌─────────────────┐  │  des métriques
│  Serveur App    │──┤
│  (API + DB)     │  │
└─────────────────┘  │
                      │
┌─────────────────┐  │
│  Monitoring     │◄─┘
│  Prometheus +   │
│  Grafana        │
└─────────────────┘
```

### Configuration Prometheus pour production

Créez un fichier `prometheus-prod.yml` :

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'pokedex-api-prod'
    static_configs:
      - targets: 
        - 'api-server-1.example.com:9000'
        - 'api-server-2.example.com:9000'
    metrics_path: '/metrics'
```

---

## 📈 **Alerting (Bonus)**

Pour configurer des alertes dans Grafana :

1. Allez dans **Alerting** → **Alert rules**
2. Cliquez sur **"New alert rule"**
3. Définissez les conditions (ex: taux d'erreur > 5%)
4. Configurez les notifications (email, Slack, etc.)

**Exemple d'alerte** :

- **Nom** : "Taux d'erreur élevé"
- **Condition** : `rate(pokedex_errors_total[5m]) > 0.05`
- **Notification** : Email aux administrateurs

---

## 🔧 **Dépannage**

### Prometheus ne récupère pas les métriques

```bash
# Vérifier que l'API expose les métriques
curl http://localhost:9000/metrics

# Vérifier les logs de Prometheus
docker compose logs prometheus

# Vérifier la configuration
docker exec prometheus cat /etc/prometheus/prometheus.yml
```

### Grafana ne se connecte pas à Prometheus

1. Allez dans **Configuration** → **Data Sources**
2. Cliquez sur **"Prometheus"**
3. Vérifiez l'URL : `http://prometheus:9090`
4. Cliquez sur **"Save & Test"**

### L'API ne démarre pas

```bash
# Vérifier les logs
docker compose logs api

# Reconstruire l'image
docker compose build --no-cache api
docker compose up -d api
```

---

## 📚 **Ressources**

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)

---

**Bon monitoring ! 🚀**

