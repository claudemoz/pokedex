# 🚀 Guide des Profiles Docker Compose - Dev vs Prod

## 📋 Vue d'ensemble

Le `docker-compose.yml` utilise des **profiles** pour séparer les environnements :

| Profile | Services inclus | Utilisation |
|---------|----------------|-------------|
| **dev** | postgres, redis, api, **prometheus**, **grafana** | Développement local avec monitoring |
| **prod** | postgres, redis, api | Production (monitoring externe) |

---

## 🛠️ Utilisation en Développement

### Démarrer avec monitoring complet (Prometheus + Grafana)

```bash
# Démarrer tous les services de développement
docker compose --profile dev up -d

# Ou avec build
docker compose --profile dev up -d --build
```

**Services démarrés** :
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ API Pokedex (port 9000)
- ✅ Prometheus (port 9090)
- ✅ Grafana (port 3000)

### Accès aux services en dev

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | http://localhost:9000 | - |
| **API Docs** | http://localhost:9000/api-docs | - |
| **API Metrics** | http://localhost:9000/metrics | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin / admin |

### Commandes utiles en dev

```bash
# Voir les logs
docker compose --profile dev logs -f

# Voir les logs d'un service spécifique
docker compose --profile dev logs -f api

# Redémarrer un service
docker compose --profile dev restart api

# Arrêter tous les services
docker compose --profile dev down

# Arrêter et supprimer les volumes
docker compose --profile dev down -v
```

---

## 🏭 Utilisation en Production

### Démarrer sans monitoring local

```bash
# Démarrer uniquement les services de production
docker compose --profile prod up -d

# Ou avec build
docker compose --profile prod up -d --build
```

**Services démarrés** :
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ API Pokedex (port 9000)
- ❌ Prometheus (externe)
- ❌ Grafana (externe)

### Architecture Production

```
┌─────────────────────────────────────────┐
│  Serveur Application                     │
│  docker-compose --profile prod           │
│                                          │
│  ┌──────────┐  ┌───────┐  ┌──────────┐ │
│  │PostgreSQL│  │ Redis │  │   API    │ │
│  │  :5432   │  │ :6379 │  │  :9000   │ │
│  └──────────┘  └───────┘  └────┬─────┘ │
└──────────────────────────────────┼──────┘
                                   │
                          Expose /metrics
                                   │
┌──────────────────────────────────┼──────┐
│  Serveur Monitoring (externe)    │      │
│                                   │      │
│  ┌───────────────┐                │      │
│  │  Prometheus   │◄───────────────┘      │
│  │    :9090      │  Scraping              │
│  └───────┬───────┘                       │
│          │                               │
│          │                               │
│  ┌───────▼───────┐                       │
│  │   Grafana     │                       │
│  │    :3000      │                       │
│  └───────────────┘                       │
└──────────────────────────────────────────┘
```

### Configuration Prometheus externe

Sur votre serveur de monitoring externe, configurez Prometheus pour scraper l'API :

**prometheus-prod.yml** :
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'pokedex-api-prod'
    static_configs:
      - targets: 
          - 'api-server.example.com:9000'  # Remplacez par votre domaine
    metrics_path: '/metrics'
    
  # Optionnel : Si vous avez plusieurs instances
  - job_name: 'pokedex-api-cluster'
    static_configs:
      - targets:
          - 'api-server-1.example.com:9000'
          - 'api-server-2.example.com:9000'
          - 'api-server-3.example.com:9000'
    metrics_path: '/metrics'
```

### Déployer Prometheus + Grafana externes

**Option 1 : Docker Compose sur serveur dédié**

Créez un `docker-compose-monitoring.yml` sur le serveur de monitoring :

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus-prod.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_SERVER_DOMAIN=monitoring.example.com
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:
```

Démarrez :
```bash
docker compose -f docker-compose-monitoring.yml up -d
```

**Option 2 : Kubernetes / Cloud**

Pour les environnements cloud, utilisez :
- **AWS** : Amazon Managed Service for Prometheus + Amazon Managed Grafana
- **GCP** : Google Cloud Monitoring (anciennement Stackdriver)
- **Azure** : Azure Monitor + Grafana
- **Kubernetes** : Prometheus Operator + Helm Charts

### Commandes utiles en prod

```bash
# Voir l'état
docker compose --profile prod ps

# Voir les logs
docker compose --profile prod logs -f api

# Redémarrer l'API
docker compose --profile prod restart api

# Build et redéployer
docker compose --profile prod up -d --build --no-deps api

# Arrêter
docker compose --profile prod down
```

---

## 🔄 Passage de Dev à Prod

### Étape 1 : Tester en dev
```bash
# Développement avec monitoring local
docker compose --profile dev up -d
```

### Étape 2 : Builder l'image pour prod
```bash
# Build l'image
docker compose --profile prod build

# Tagger l'image
docker tag tsiang/pokedex-api:latest tsiang/pokedex-api:v1.0.0

# Push vers le registry
docker compose push api
```

### Étape 3 : Déployer en prod
```bash
# Sur le serveur de production
docker compose --profile prod pull
docker compose --profile prod up -d
```

---

## 📊 Vérification

### En développement
```bash
# Vérifier que tous les services sont up
docker compose --profile dev ps

# Tester l'API
curl http://localhost:9000/api/v1/pokemons

# Tester les métriques
curl http://localhost:9000/metrics

# Accéder à Prometheus
open http://localhost:9090

# Accéder à Grafana
open http://localhost:3000
```

### En production
```bash
# Vérifier que les services de prod sont up
docker compose --profile prod ps

# Vérifier l'API
curl http://localhost:9000/api/v1/pokemons

# Vérifier que les métriques sont exposées
curl http://localhost:9000/metrics

# Sur le serveur de monitoring, vérifier que Prometheus scrape l'API
# Allez dans Prometheus UI → Status → Targets
```

---

## 🎯 Comparaison des Profiles

| Caractéristique | Profile **dev** | Profile **prod** |
|----------------|-----------------|------------------|
| PostgreSQL | ✅ Local | ✅ Local ou RDS |
| Redis | ✅ Local | ✅ Local ou ElastiCache |
| API | ✅ avec hot-reload | ✅ optimisée |
| Prometheus | ✅ Local (Docker) | ❌ Serveur externe |
| Grafana | ✅ Local (Docker) | ❌ Serveur externe |
| Volumes montés | ✅ Code source | ❌ Seulement volumes |
| Hot reload | ✅ Nodemon | ❌ Node direct |
| Migrations auto | ✅ Oui | ⚠️ Manuel |
| Seed data | ✅ Oui | ❌ Non |

---

## 🔧 Variables d'environnement

### Créer un fichier `.env.dev`
```env
NODE_ENV=development
PORT=9000
DEV_DB_USERNAME=postgres
DEV_DB_PASSWORD=postgres
DEV_DB_NAME=pokedex
DEV_DB_HOSTNAME=postgres
DEV_DB_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_CACHE_TTL=3600
WEATHER_API_KEY=votre_clé_api
```

### Créer un fichier `.env.prod`
```env
NODE_ENV=production
PORT=9000
PROD_DB_USERNAME=postgres
PROD_DB_PASSWORD=mot_de_passe_sécurisé
PROD_DB_NAME=pokedex
PROD_DB_HOSTNAME=db.example.com
PROD_DB_PORT=5432
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_CACHE_TTL=7200
WEATHER_API_KEY=votre_clé_api
```

### Utiliser les fichiers d'environnement
```bash
# Dev
docker compose --profile dev --env-file .env.dev up -d

# Prod
docker compose --profile prod --env-file .env.prod up -d
```

---

## 🚨 Sécurité en Production

### Checklist

- [ ] Changez les mots de passe par défaut (PostgreSQL, Redis)
- [ ] Utilisez des secrets (Docker Secrets, Vault, etc.)
- [ ] N'exposez pas les ports inutiles (PostgreSQL, Redis)
- [ ] Utilisez HTTPS/TLS
- [ ] Configurez un firewall
- [ ] Activez les logs d'audit
- [ ] Mettez en place des sauvegardes automatiques
- [ ] Limitez l'accès au serveur de monitoring

---

## 📚 Ressources

- [Docker Compose Profiles Documentation](https://docs.docker.com/compose/profiles/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [Grafana Configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/)

---

**Bon déploiement ! 🚀**

