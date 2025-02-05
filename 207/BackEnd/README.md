# Smart Locker System 🔐

> 자동화된 물품 보관/수령 시스템의 백엔드 API

## ⚙️ Tech Stack
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.1-6DB33F)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)
![JPA](https://img.shields.io/badge/JPA/Hibernate-Latest-59666C)

## 📋 Features
- 물품 보관 및 수령 자동화
- 위치별 보관함 상태 실시간 조회
- 로봇을 통한 물품 운반 관리
- 토큰 기반 인증 시스템

## 🗄️ Database Structure
### Core Tables
- `users`: 사용자 정보
- `lockers`: 보관함 정보 
- `locker_status`: 보관함 상태 관리
- `locker_locations`: 위치 정보

### Supporting Tables
- `access_tokens`: 인증 토큰
- `robots`: 로봇 정보
- `robot_status`: 로봇 상태 관리
- `locker_usage_logs`: 사용 이력

## 🔌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/locker/store` | 물품 보관 |
| GET | `/api/locker/{locationName}/status` | 위치별 상태 조회 |
| POST | `/api/locker/retrieve` | 물품 수령 |

## 🚀 Getting Started
1. **Database 설정**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_locker
spring.datasource.username=postgres
spring.datasource.password=your_password
