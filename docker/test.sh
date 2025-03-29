#!/bin/bash

echo "Testing MinIO..."
curl -s http://localhost:9000/minio/health/live && echo " MinIO is running!"

echo "Testing Ollama..."
curl -s http://localhost:11434/api/tags && echo " Ollama is running!"

echo "Testing Ollama GPU support..."
GPU_INFO=$(curl -s -X POST http://localhost:11434/api/info)
if [[ $GPU_INFO == *"\"cuda\":true"* ]]; then
  echo " GPU support is active! 🎉"
else
  echo " GPU support is NOT active or could not be detected. 🔍"
  echo " GPU info: $GPU_INFO"
fi

echo ""
echo "To pull your first model, run:"
echo "curl -X POST http://localhost:11434/api/pull -d '{\"model\": \"deepseek-r1:7b\"}'"
echo ""
echo "To test the model, run:"
echo "curl -X POST http://localhost:11434/api/generate -d '{\"model\": \"deepseek-r1:7b\", \"prompt\": \"Hello world!\"}'" 