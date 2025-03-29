#!/bin/bash

# Force rebuild the containers
echo "Stopping any existing containers..."
docker-compose -f docker-compose.official.yml down

echo "Starting the services with official images..."
docker-compose -f docker-compose.official.yml up -d

echo "Waiting for services to initialize (15 seconds)..."
sleep 15

echo "Checking service status..."
echo "MinIO logs:"
docker-compose -f docker-compose.official.yml logs --tail=10 minio

echo "Ollama logs:"
docker-compose -f docker-compose.official.yml logs --tail=10 ollama

echo "You can now access:"
echo "- MinIO at http://localhost:9001 (login: minioadmin/minioadmin)"
echo "- Ollama at http://localhost:11434"
echo
echo "To pull a model, run:"
echo "curl -X POST http://localhost:11434/api/pull -d '{\"model\": \"deepseek-r1:7b\"}'" 