#!/bin/bash

# Force rebuild the containers
echo "Stopping any existing containers..."
docker-compose -f docker-compose.official.yml down

echo "Starting the services with official images..."
docker-compose -f docker-compose.official.yml up -d

echo "Waiting for services to initialize (10 seconds)..."
sleep 10

# 生成随机凭据（Access Key 12字节，Secret Key 20字节）
MINIO_ACCESS_KEY=$(openssl rand -hex 12)
MINIO_SECRET_KEY=$(openssl rand -hex 20)

echo "Generated MinIO Credentials:"
echo "ACCESS_KEY: $MINIO_ACCESS_KEY"
echo "SECRET_KEY: $MINIO_SECRET_KEY"

cat <<EOF > .env
# Auto-generated MinIO Credentials
MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
MINIO_SECRET_KEY=$MINIO_SECRET_KEY
EOF

echo "Configuring MinIO container..."
docker-compose -f docker-compose.official.yml exec -T minio bash <<EOF
# set alias
mc alias set local http://localhost:9000 minioadmin minioadmin >/dev/null 2>&1

# create admin
mc admin user add local "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" >/dev/null 2>&1
mc admin policy set local readwrite user="$MINIO_ACCESS_KEY" >/dev/null 2>&1

# setting
echo "MinIO user list:"
mc admin user list local
EOF

echo "Service status:"
docker-compose -f docker-compose.official.yml logs --tail=5 minio
docker-compose -f docker-compose.official.yml logs --tail=5 ollama

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