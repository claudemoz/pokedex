# 📊 Architecture Monitoring : Développement vs Production

## 🏗️ Vue d'ensemble

### 📦 **DÉVELOPPEMENT** (Tout dans Docker Compose)

```bash
# Un seul fichier, un seul hôte
docker compose up -d
```

**Services inclus :**
- ✅ API
- ✅ PostgreSQL
- ✅ Redis
- ✅ **Prometheus** (scrape API locale)
- ✅ **Grafana** (visualisation)

**Accès :**
- API: http://localhost:9000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

---

### 🚀 **PRODUCTION** (Services séparés)

#### **Serveur 1 : Application**

```bash
docker compose -f docker-compose.prod.yml up -d
```

**Services :**
- ✅ API (expose /metrics sur :9000)
- ✅ PostgreSQL
- ✅ Redis
- ❌ Pas de Prometheus
- ❌ Pas de Grafana

#### **Serveur 2 : Monitoring** (hôte séparé)

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

**Services :**
- ✅ Prometheus (scrape API distante)
- ✅ Grafana
- ✅ Alertmanager (alertes email/Slack)
- ❌ Pas d'API

---

## 📁 Fichiers utilisés

| Fichier | Développement | Production |
|---------|---------------|------------|
| `docker-compose.yml` | ✅ Utilisé | ❌ |
| `docker-compose.prod.yml` | ❌ | ✅ Serveur App |
| `docker-compose.monitoring.yml` | ❌ | ✅ Serveur Monitoring |
| `configs/monitoring/prometheus.yml` | ✅ | ❌ |
| `configs/monitoring/prometheus-prod.yml` | ❌ | ✅ |

---

## 🚀 Commandes rapides

### Développement

```bash
# Démarrer
docker compose up -d

# Logs
docker compose logs -f api

# Arrêter
docker compose down
```

### Production

**Sur serveur application :**
```bash
# Démarrer
docker compose -f docker-compose.prod.yml up -d

# Vérifier métriques
curl http://localhost:9000/metrics
```

**Sur serveur monitoring :**
```bash
# Démarrer
docker compose -f docker-compose.monitoring.yml up -d

# Accéder à Grafana
open http://monitoring-server-ip:3000
```

---

## 📖 Documentation complète

Consultez `docs/DEPLOYMENT.md` pour le guide détaillé.

---

## ✅ Résumé

- **Développement** : Tout ensemble, un seul fichier `docker-compose.yml`
- **Production** : Séparé en 2 hôtes pour performances et sécurité
  - Hôte 1 : Application
  - Hôte 2 : Monitoring

