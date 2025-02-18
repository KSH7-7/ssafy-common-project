#!/bin/bash

# Log file paths
LOG_DIR="/home/ubuntu/logs"
DEPLOY_LOG="$LOG_DIR/deploy.log"
MVN_LOG="$LOG_DIR/mvn_build.log"

# Create log directory if not exists
mkdir -p "$LOG_DIR"

# Initialize log file
echo "Deploying the application..." | tee -a "$DEPLOY_LOG"

# 1️⃣ Navigate to Docker directory
cd /home/ubuntu/S12P11A207/207/BackEnd/Docker || { echo "Error: Failed to change directory to Docker." | tee -a "$DEPLOY_LOG"; exit 1; }

# 2️⃣ Stop and remove existing containers
echo "Stopping existing containers..." | tee -a "$DEPLOY_LOG"
docker-compose down | tee -a "$DEPLOY_LOG"

# 3️⃣ Remove unused Docker images
echo "Removing unused Docker images..." | tee -a "$DEPLOY_LOG"
docker image prune -f | tee -a "$DEPLOY_LOG"

# 4️⃣ Pull the latest code from Git
echo "Pulling latest code from Git..." | tee -a "$DEPLOY_LOG"
git pull origin master | tee -a "$DEPLOY_LOG"

# 5️⃣ Build JAR file with Maven
echo "Building JAR file with Maven..." | tee -a "$DEPLOY_LOG"
cd ../SmartLocker || { echo "Error: Failed to change directory to SmartLocker." | tee -a "$DEPLOY_LOG"; exit 1; }

# Run Maven build and log output
mvn clean package -DskipTests > "$MVN_LOG" 2>&1
if [ $? -ne 0 ]; then
    echo "Error: Maven build failed! Check logs: $MVN_LOG" | tee -a "$DEPLOY_LOG"
    exit 1
fi
echo "Maven build successful!" | tee -a "$DEPLOY_LOG"

# 6️⃣ Restart Docker containers
cd ../Docker || { echo "Error: Failed to change directory to Docker." | tee -a "$DEPLOY_LOG"; exit 1; }

echo "Rebuilding and restarting containers..." | tee -a "$DEPLOY_LOG"
docker-compose up -d --build | tee -a "$DEPLOY_LOG"
echo "Rebuilding and restarting containers complete!" | tee -a "$DEPLOY_LOG"

# 7️⃣ Restart React
cd ~/S12P11A207/207/FrontEnd || { echo "Error: Failed to change directory to React." | tee -a "$DEPLOY_LOG"; exit 1; }

echo "Starting React server in background..." | tee -a "$DEPLOY_LOG"
nohup pnpm dev > "$LOG_DIR/react.log" 2>&1 &
echo "React server started with PID: $!" | tee -a "$DEPLOY_LOG"

echo "Deployment complete!" | tee -a "$DEPLOY_LOG"

