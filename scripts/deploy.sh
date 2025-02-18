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

# 7️⃣ Check and restart React with correct Node.js version
cd ~/S12P11A207/207/FrontEnd || { echo "Error: Failed to change directory to React." | tee -a "$DEPLOY_LOG"; exit 1; }

# 실행 중인 React 서버 확인
REACT_PID=$(pgrep -f "next dev")
if [ -z "$REACT_PID" ]; then
  echo "React server is not running. Starting it now..." | tee -a "$DEPLOY_LOG"
  
  # nvm과 Node.js 20 설정을 쉘 스크립트로 만들어 실행
  cat > ~/start_react.sh << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd ~/S12P11A207/207/FrontEnd
nvm use 20
exec pnpm dev
EOF

  chmod +x ~/start_react.sh
  
  # 스크립트를 nohup으로 실행
  nohup ~/start_react.sh > "$LOG_DIR/react.log" 2>&1 &
  NEW_PID=$!
  echo "React server started with PID: $NEW_PID" | tee -a "$DEPLOY_LOG"
  
  # PID 파일 저장
  echo $NEW_PID > "$LOG_DIR/react.pid"

else
  echo "React server is already running with PID: $REACT_PID" | tee -a "$DEPLOY_LOG"
fi

echo "Deployment complete!" | tee -a "$DEPLOY_LOG"
