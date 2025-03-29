# MinIO and Ollama Docker Setup

This setup provides a Docker environment with both MinIO (object storage) and Ollama (LLM server) running as separate services. The Ollama setup includes GPU support for accelerated inference.

## Prerequisites

For Ollama GPU support, you need:
- NVIDIA GPU with CUDA support
- NVIDIA drivers installed on the host machine
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) (nvidia-docker2)

You can check if your Docker installation supports NVIDIA GPU by running:
```bash
docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi
```

## Contents

- `Dockerfile.minio`: Image configuration for MinIO object storage
- `Dockerfile.ollama`: Image configuration for Ollama with GPU support
- `docker-compose.yml`: Compose file to run both services together
- `run.sh`: Helper script to rebuild and restart containers with proper initialization
- `test.sh`: Script to verify services are running correctly

## Usage

### Option 1: Using the convenience script

The easiest way to deploy the services:

```bash
cd docker
./run.sh
```

This script will:
- Stop any existing containers
- Rebuild and start the services
- Wait for proper initialization
- Show logs for troubleshooting
- Display access information

### Option 2: Manual deployment

If you prefer manual control:

```bash
cd docker
docker-compose up -d
```

You can also run each service individually:

```bash
# Run only MinIO
docker-compose up -d minio

# Run only Ollama
docker-compose up -d ollama
```

### Stopping the services

To stop and remove all containers:

```bash
cd docker
docker-compose down
```

To stop individual services:

```bash
docker-compose stop minio
docker-compose stop ollama
```

## Accessing Services

1. Access MinIO:
   - Console: http://localhost:9001 (login with minioadmin/minioadmin)
   - API: http://localhost:9000

2. Use Ollama:
   - API endpoint: http://localhost:11434
   - Pull a model:
   
   ```bash
   curl -X POST http://localhost:11434/api/pull -d '{"model": "deepseek-r1:7b"}'
   ```
   
   - Run an inference:
   
   ```bash
   curl -X POST http://localhost:11434/api/generate -d '{
     "model": "deepseek-r1:7b",
     "prompt": "Tell me about MinIO and Ollama."
   }'
   ```

3. Verify GPU Support:
   ```bash
   curl -X POST http://localhost:11434/api/info
   ```
   The response should include `"cuda": true` if GPU support is working.

## Volumes

- `minio-data`: Persists MinIO data
- `ollama-models`: Persists Ollama models

## Environment Variables

### MinIO
- `MINIO_ROOT_USER`: Default is minioadmin
- `MINIO_ROOT_PASSWORD`: Default is minioadmin

### Ollama
- `OLLAMA_USE_GPU`: Set to 1 to enable GPU support
- `NVIDIA_VISIBLE_DEVICES`: Set to all to use all GPUs

You can change these in the docker-compose.yml file. 