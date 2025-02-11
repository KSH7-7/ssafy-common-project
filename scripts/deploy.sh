#!/bin/bash
echo "Deploying the application..."

cd /home/ubuntu/S12P11A207 || exit

docker-compose down

docker image prune -f

git pull origin master

docker-compose up -d --build

echo "Deployment complete"
