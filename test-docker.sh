#!/bin/bash

# Script pour initialiser et lancer les tests

echo "🗄️  Création de la base de données de test..."

# Créer la base de données de test si elle n'existe pas
docker exec -e PGPASSWORD=postgres db psql -U postgres -c "DROP DATABASE IF EXISTS pokedex_test;" 2>/dev/null || true
docker exec -e PGPASSWORD=postgres db psql -U postgres -c "CREATE DATABASE pokedex_test;"

echo "✅ Base de données de test créée"

echo "🔄 Lancement des migrations..."
docker exec -e NODE_ENV=test -e DEV_DB_NAME=pokedex_test api npx sequelize-cli db:migrate

echo "🧪 Lancement des tests..."
docker exec -e DOCKER_ENV=true -e NODE_ENV=test -e DEV_DB_NAME=pokedex_test api npm test
