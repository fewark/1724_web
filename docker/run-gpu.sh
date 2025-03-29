#!/bin/bash

# Force rebuild the containers
echo "Stopping any existing containers..."
docker-compose -f docker-compose.gpu.yml down

echo "Rebuilding the Ollama GPU image and starting services..."
docker-compose -f docker-compose.gpu.yml up --build -d

echo "Waiting for services to initialize (30 seconds)..."
sleep 30

echo "Checking service status..."
echo "MinIO logs:"
docker-compose -f docker-compose.gpu.yml logs --tail=10 minio

echo "Ollama logs:"
docker-compose -f docker-compose.gpu.yml logs --tail=10 ollama

echo "You can now access:"
echo "- MinIO at http://localhost:9001 (login: minioadmin/minioadmin)"
echo "- Ollama at http://localhost:11434"
echo
echo "To verify GPU support, run:"
echo "curl -X POST http://localhost:11434/api/info"
echo
echo "To pull a model, run:"
echo "curl -X POST http://localhost:11434/api/pull -d '{\"model\": \"deepseek-r1:7b\"}'" 