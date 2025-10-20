#!/bin/bash

echo "🧪 Running API Tests..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:9000/api/v1"

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed (HTTP $RESPONSE)${NC}"
fi
echo ""

# Test 2: Get All Pokemon
echo "Test 2: Get All Pokemon"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/pokemons)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ Get all pokemon passed${NC}"
else
    echo -e "${RED}✗ Get all pokemon failed (HTTP $RESPONSE)${NC}"
fi
echo ""

# Test 3: Get Pokemon with Weather
echo "Test 3: Get Pokemon with Weather Effects"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/pokemons?weather=true")
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ Get pokemon with weather passed${NC}"
else
    echo -e "${RED}✗ Get pokemon with weather failed (HTTP $RESPONSE)${NC}"
fi
echo ""

# Test 4: Get Pokemon by ID
echo "Test 4: Get Pokemon by ID"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/pokemons/1)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ Get pokemon by ID passed${NC}"
else
    echo -e "${RED}✗ Get pokemon by ID failed (HTTP $RESPONSE)${NC}"
fi
echo ""

# Test 5: Create Pokemon
echo "Test 5: Create Pokemon"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE_URL/pokemons \
    -H "Content-Type: application/json" \
    -d '{
        "name": "TestMon",
        "type": "normal",
        "baseAttack": 50,
        "baseDefense": 50,
        "baseHP": 50
    }')
if [ $RESPONSE -eq 201 ]; then
    echo -e "${GREEN}✓ Create pokemon passed${NC}"
else
    echo -e "${RED}✗ Create pokemon failed (HTTP $RESPONSE)${NC}"
fi
echo ""

# Test 6: Get Weather
echo "Test 6: Get Weather"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/weather)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✓ Get weather passed${NC}"
else
    echo -e "${RED}✗ Get weather failed (HTTP $RESPONSE)${NC}"
fi
echo ""

echo "🎉 Tests completed!"

