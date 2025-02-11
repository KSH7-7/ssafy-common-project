#!/bin/bash
echo "Deploying the application..."

cd /home/ubuntu/S12P11A207/207/BackEnd/Docker || exit

echo "🛑 Stopping existing containers..."
docker-compose down

echo "🧹 Removing unused Docker images..."
docker image prune -f

echo "📥 Pulling latest code..."
git pull origin master

echo "🚀 Rebuilding and restarting containers..."
docker-compose up -d --build

echo "✅ Deployment complete!"
