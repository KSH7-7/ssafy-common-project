# Smart Locker System 🔐

> 로봇을 활용한 자동화된 물품 보관/수령 시스템

## 📋 프로젝트 개요
스마트 라커 시스템은 로봇을 활용하여 물품의 보관과 수령을 자동화하는 서비스입니다. 대기열 시스템을 통해 작업을 순차적으로 처리하고, 로봇 제어 시스템과의 연동을 통해 자동화된 물품 관리를 제공합니다.

## ⚙️ 기술 스택
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.1-6DB33F)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-336791)
![Docker](https://img.shields.io/badge/Docker-Latest-2496ED)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Latest-2088FF)

## 🏗️ 시스템 아키텍처

### 주요 컴포넌트
1. **API 서버 (Spring Boot)**
   - REST API 제공
   - 비즈니스 로직 처리
   - 작업 대기열 관리

2. **데이터베이스 (PostgreSQL)**
   - 물품 보관 정보
   - 사용자 정보
   - 로봇 상태 관리
   - 작업 대기열 관리
   
3. **로봇 제어 시스템**
   - HTTP 기반 통신 (URL: http://70.12.245.25:5001/rasp)
   - 실시간 로봇 상태 관리

## 💾 데이터베이스 구조

### 핵심 테이블
1. **locker_usage_logs**
   - 보관/수령 이력 관리
   - 로봇 작업 추적
   - 시간별 사용 현황

2. **lockers**
   - 보관함 상태 관리
   - 위치 정보 연동
   - 토큰 기반 접근 제어

3. **robots**
   - 로봇 상태 관리 (대기중/사용중/수리중)
   - 작업 이력 추적
   - 유지보수 일정 관리

4. **locker_queue**
   - 작업 대기열 관리
   - 요청 유형 구분 (보관/수령)
   - FIFO 방식의 작업 처리

### 보조 테이블
- **locker_status**: 보관함 상태 코드 (사용가능/사용중/수리중)
- **locker_locations**: 위치 정보 (A/B/C)
- **access_tokens**: 인증 토큰 (6자리 난수)
- **robot_status**: 로봇 상태 코드
- **users**: 사용자 정보 (전화번호)

## 📦 작업 처리 프로세스

### 물품 보관 프로세스
1. 사용자가 보관 요청
2. 토큰 생성 및 발급
3. LockerQueue에 보관 작업 등록
4. RobotTaskService가 대기열에서 작업 처리
5. 로봇이 물품 보관 수행

### 물품 수령 프로세스
1. 사용자가 토큰과 함께 수령 요청
2. 토큰 유효성 검증
3. LockerQueue에 수령 작업 등록
4. RobotTaskService가 대기열에서 작업 처리
5. 로봇이 물품 전달 수행

## 🌐 API 명세

### 1. 물품 보관 API
```http
POST /api/locker/store
```
**Request Body:**
```json
{
    "lockerId": "integer",
    "phoneNumber": "string"
}
```
**Response:**
```json
{
    "lockerId": "integer",
    "tokenValue": "integer",
    "message": "string"
}
```

### 2. 물품 수령 API
```http
POST /api/locker/retrieve
```
**Request Body:**
```json
{
    "lockerId": "integer",
    "tokenValue": "integer"
}
```
**Response:**
```json
{
    "lockerId": "integer",
    "message": "string"
}
```

### 3. 로봇 작업 처리 API
```http
POST /api/robot-tasks/process
```
**Response:**
```json
{
    "success": "boolean",
    "message": "string"
}
```

## 🚀 프로젝트 실행

### 로컬 환경
```bash
# PostgreSQL 실행
docker run -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1 postgres:13

# 애플리케이션 실행
./mvnw spring-boot:run -Dspring.profiles.active=default
```

### Docker 환경
```bash
# Docker Compose로 실행
docker-compose up -d
```

## 🔄 CI/CD 파이프라인

### GitHub Actions 워크플로우
1. **PR 검증 (Pull Request)**
   ```yaml
   on: pull_request:
     branches: [ main ]
   ```
   - JDK 17 설정
   - Maven 빌드 및 테스트
   - 코드 품질 검증

2. **배포 자동화 (Push to Main)**
   ```yaml
   on: push:
     branches: [ "main" ]
   ```
   - EC2 자동 배포
   - Docker 컨테이너 관리
   - 롤백 메커니즘

## 💡 주요 기능
- 물품 자동 보관/수령
- 토큰 기반 인증
- 대기열 기반 작업 관리
- 로봇 자동화 제어
- 실시간 상태 모니터링

## ⚠️ 예외 처리
- `NotFoundException`: 리소스 미존재
- `UnauthorizedException`: 인증 실패
- `RobotControlException`: 로봇 제어 실패
- `InvalidTokenException`: 잘못된 토큰
- `NoAvailableRobotException`: 가용 로봇 부재

## 📄 라이선스
Copyright © 2024 SSAFY A207
