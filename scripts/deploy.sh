#!/bin/bash

# 로그 파일 경로
LOG_DIR="/home/ubuntu/logs"
DEPLOY_LOG="$LOG_DIR/deploy.log"
MVN_LOG="$LOG_DIR/mvn_build.log"

# 로그 디렉토리 생성 (없으면 생성)
mkdir -p "$LOG_DIR"

# 로그 파일 초기화
echo "🚀 Deploying the application..." | tee -a "$DEPLOY_LOG"

# 1️⃣ Docker 디렉토리 이동
cd /home/ubuntu/S12P11A207/207/BackEnd/Docker || { echo "❌ Docker 디렉토리 이동 실패!" | tee -a "$DEPLOY_LOG"; exit 1; }

# 2️⃣ 기존 컨테이너 중지 및 삭제
echo "🛑 Stopping existing containers..." | tee -a "$DEPLOY_LOG"
docker-compose down | tee -a "$DEPLOY_LOG"

# 3️⃣ 불필요한 Docker 이미지 정리
echo "🧹 Removing unused Docker images..." | tee -a "$DEPLOY_LOG"
docker image prune -f | tee -a "$DEPLOY_LOG"

# 4️⃣ 최신 코드 가져오기
echo "📥 Pulling latest code from Git..." | tee -a "$DEPLOY_LOG"
git pull origin master | tee -a "$DEPLOY_LOG"

# 5️⃣ Maven 빌드 수행
echo "🔨 Building JAR file with Maven..." | tee -a "$DEPLOY_LOG"
cd ../SmartLocker || { echo "❌ SmartLocker 디렉토리 이동 실패!" | tee -a "$DEPLOY_LOG"; exit 1; }

# Maven 빌드 실행 및 로그 저장
mvn clean package -DskipTests > "$MVN_LOG" 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Maven 빌드 실패! 로그를 확인하세요: $MVN_LOG" | tee -a "$DEPLOY_LOG"
    exit 1
fi
echo "✅ Maven 빌드 성공!" | tee -a "$DEPLOY_LOG"

# 6️⃣ Docker 컨테이너 다시 실행
cd ../Docker || { echo "❌ Docker 디렉토리 이동 실패!" | tee -a "$DEPLOY_LOG"; exit 1; }

echo "🚀 Rebuilding and restarting containers..." | tee -a "$DEPLOY_LOG"
docker-compose up -d --build | tee -a "$DEPLOY_LOG"

echo "✅ Deployment complete!" | tee -a "$DEPLOY_LOG"

