# 🎯 Guide : Trouver et Importer des Dashboards Grafana

## 📋 Dashboards recommandés pour Pokedex API

### IDs de dashboards pré-configurés

| ID | Nom | Description | URL |
|-----|-----|-------------|-----|
| `11159` | Node.js Application Dashboard | Métriques Node.js (CPU, mémoire, heap) | https://grafana.com/grafana/dashboards/11159 |
| `893` | Docker & System Monitoring | Monitoring des conteneurs Docker | https://grafana.com/grafana/dashboards/893 |
| `9628` | PostgreSQL Database | Métriques PostgreSQL détaillées | https://grafana.com/grafana/dashboards/9628 |
| `11835` | Redis | Monitoring Redis complet | https://grafana.com/grafana/dashboards/11835 |

---

## 🔍 Comment trouver d'autres dashboards ?

### 1. Catalogue officiel Grafana

Visitez : **https://grafana.com/grafana/dashboards/**

Vous pouvez filtrer par :
- **Data Source** : Prometheus, InfluxDB, MySQL, etc.
- **Tags** : node, docker, redis, postgres, etc.
- **Popularité** : Most popular, Most downloaded

### 2. Recherche par mots-clés

Exemples de recherches utiles :
- `node.js prometheus` - Dashboards pour applications Node.js
- `express prometheus` - Dashboards spécifiques Express.js
- `docker prometheus` - Monitoring Docker
- `postgres exporter` - PostgreSQL avec Prometheus
- `redis exporter` - Redis avec Prometheus

### 3. Vérifier la compatibilité

Avant d'importer un dashboard, vérifiez :
- ✅ **Data Source** : Doit être compatible avec Prometheus
- ✅ **Métriques utilisées** : Vérifiez si votre app expose ces métriques
- ✅ **Date de mise à jour** : Préférez les dashboards récents
- ✅ **Nombre de téléchargements** : Indicateur de qualité

---

## 📥 Comment importer un dashboard ?

### Méthode 1 : Par ID (le plus simple)

1. Connectez-vous à Grafana : http://localhost:3000
2. Cliquez sur **"+"** dans la barre latérale → **"Import"**
3. Entrez l'**ID du dashboard** (ex: `11159`)
4. Cliquez sur **"Load"**
5. Sélectionnez **"Prometheus"** comme Data Source
6. Cliquez sur **"Import"**

### Méthode 2 : Par fichier JSON

1. Téléchargez le fichier JSON depuis grafana.com
2. Dans Grafana, cliquez sur **"+"** → **"Import"**
3. Cliquez sur **"Upload JSON file"**
4. Sélectionnez le fichier téléchargé
5. Configurez la Data Source
6. Cliquez sur **"Import"**

### Méthode 3 : Par URL

1. Copiez l'URL du dashboard depuis grafana.com
2. Dans Grafana, cliquez sur **"+"** → **"Import"**
3. Collez l'URL
4. Cliquez sur **"Load"**

---

## 🛠️ Dashboards personnalisés pour Pokedex

Voici des dashboards que vous pouvez créer spécifiquement pour votre API Pokedex :

### Dashboard 1 : Performance de l'API

**Panels à créer :**

| Panel | Query PromQL | Type |
|-------|--------------|------|
| Requêtes/seconde | `rate(pokedex_http_requests_total[1m])` | Graph |
| Durée moyenne | `rate(pokedex_http_request_duration_seconds_sum[5m]) / rate(pokedex_http_request_duration_seconds_count[5m])` | Gauge |
| P95 Latence | `histogram_quantile(0.95, rate(pokedex_http_request_duration_seconds_bucket[5m]))` | Graph |
| Taux d'erreurs | `rate(pokedex_http_requests_total{status_code=~"5.."}[5m])` | Stat |

### Dashboard 2 : Cache Redis

**Panels à créer :**

| Panel | Query PromQL | Type |
|-------|--------------|------|
| Hit Ratio | `(pokedex_redis_cache_hits_total / (pokedex_redis_cache_hits_total + pokedex_redis_cache_misses_total)) * 100` | Gauge |
| Cache Hits | `rate(pokedex_redis_cache_hits_total[5m])` | Graph |
| Cache Misses | `rate(pokedex_redis_cache_misses_total[5m])` | Graph |
| Connexion Redis | `pokedex_redis_connected` | Stat |

### Dashboard 3 : Requêtes Pokémon

**Panels à créer :**

| Panel | Query PromQL | Type |
|-------|--------------|------|
| Requêtes par opération | `sum by (operation) (pokedex_pokemon_requests_total)` | Pie Chart |
| Taux de requêtes | `rate(pokedex_pokemon_requests_total[5m])` | Graph |
| Top routes | `topk(5, sum by (route) (pokedex_http_requests_total))` | Bar Chart |

---

## 🎨 Exemples de dashboards populaires

### Pour Node.js

| ID | Nom | Stars | Téléchargements |
|-----|-----|-------|-----------------|
| `11159` | Node.js Application Dashboard | ⭐⭐⭐⭐⭐ | 500k+ |
| `14058` | Node.js Metrics | ⭐⭐⭐⭐ | 200k+ |
| `11956` | Node Exporter Full | ⭐⭐⭐⭐⭐ | 1M+ |

### Pour Docker

| ID | Nom | Stars | Téléchargements |
|-----|-----|-------|-----------------|
| `893` | Docker & System Monitoring | ⭐⭐⭐⭐⭐ | 800k+ |
| `179` | Docker Containers | ⭐⭐⭐⭐ | 300k+ |
| `13946` | cAdvisor exporter | ⭐⭐⭐⭐ | 150k+ |

### Pour PostgreSQL

| ID | Nom | Stars | Téléchargements |
|-----|-----|-------|-----------------|
| `9628` | PostgreSQL Database | ⭐⭐⭐⭐⭐ | 600k+ |
| `455` | Postgres Overview | ⭐⭐⭐⭐ | 400k+ |
| `12485` | PostgreSQL Exporter Quickstart | ⭐⭐⭐⭐ | 250k+ |

### Pour Redis

| ID | Nom | Stars | Téléchargements |
|-----|-----|-------|-----------------|
| `11835` | Redis Dashboard | ⭐⭐⭐⭐⭐ | 500k+ |
| `763` | Redis Dashboard for Prometheus | ⭐⭐⭐⭐ | 300k+ |
| `14091` | Redis Exporter | ⭐⭐⭐⭐ | 200k+ |

---

## ⚠️ Note importante sur les exporters

**Attention** : Certains dashboards nécessitent des **exporters** spécifiques :

### PostgreSQL

Pour utiliser les dashboards PostgreSQL, vous avez besoin de **postgres_exporter** :

```yaml
# Ajoutez dans docker-compose.yml
postgres-exporter:
  image: prometheuscommunity/postgres-exporter
  container_name: postgres_exporter
  environment:
    DATA_SOURCE_NAME: "postgresql://postgres:postgres@postgres:5432/pokedex?sslmode=disable"
  ports:
    - "9187:9187"
  depends_on:
    - postgres
```

Puis ajoutez dans `configs/monitoring/prometheus.yml` :

```yaml
- job_name: 'postgres-exporter'
  static_configs:
    - targets: ['postgres-exporter:9187']
```

### Redis

Pour Redis, utilisez **redis_exporter** :

```yaml
# Ajoutez dans docker-compose.yml
redis-exporter:
  image: oliver006/redis_exporter
  container_name: redis_exporter
  environment:
    REDIS_ADDR: redis:6379
  ports:
    - "9121:9121"
  depends_on:
    - redis
```

Puis ajoutez dans `configs/monitoring/prometheus.yml` :

```yaml
- job_name: 'redis-exporter'
  static_configs:
    - targets: ['redis-exporter:9121']
```

### Node Exporter (métriques système)

Pour les métriques système de l'hôte :

```yaml
# Ajoutez dans docker-compose.yml
node-exporter:
  image: prom/node-exporter:latest
  container_name: node_exporter
  ports:
    - "9100:9100"
  command:
    - '--path.procfs=/host/proc'
    - '--path.sysfs=/host/sys'
    - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
  volumes:
    - /proc:/host/proc:ro
    - /sys:/host/sys:ro
    - /:/rootfs:ro
```

---

## 🚀 Workflow recommandé

1. **Démarrez simple** : Importez les dashboards de base (11159, 893)
2. **Testez** : Générez du trafic sur votre API et observez les métriques
3. **Ajoutez les exporters** : Si vous voulez des métriques avancées
4. **Personnalisez** : Créez vos propres dashboards pour vos besoins spécifiques
5. **Alertes** : Configurez des alertes sur les métriques critiques

---

## 📚 Ressources

- **Catalogue Grafana** : https://grafana.com/grafana/dashboards/
- **Documentation Prometheus Exporters** : https://prometheus.io/docs/instrumenting/exporters/
- **Tutoriel Grafana** : https://grafana.com/docs/grafana/latest/getting-started/
- **PromQL Cheat Sheet** : https://promlabs.com/promql-cheat-sheet/

---

**Astuce** : Sauvegardez vos dashboards personnalisés en JSON pour pouvoir les réutiliser !

```bash
# Export depuis Grafana UI :
# Dashboard → Settings → JSON Model → Copy to clipboard
```

