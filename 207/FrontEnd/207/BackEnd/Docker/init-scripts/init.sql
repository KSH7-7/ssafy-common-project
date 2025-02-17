-- 1. Users table (참조되지 않는 테이블)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL UNIQUE
);

-- 2. Locker Status table (참조되지 않는 테이블)
CREATE TABLE locker_status (
    locker_status_id SERIAL PRIMARY KEY,
    locker_status TEXT NOT NULL
);

-- 3. Locker Locations table (참조되지 않는 테이블)
CREATE TABLE locker_locations (
    location_id SERIAL PRIMARY KEY,
    location_name TEXT NOT NULL
);

-- 4. Access Tokens table (참조되지 않는 테이블)
CREATE TABLE access_tokens (
    token_id SERIAL PRIMARY KEY,
    token_value INTEGER NOT NULL
);

-- 5. Lockers table (users, locker_status, locker_locations, access_tokens 참조)
CREATE TABLE lockers (
    locker_id SERIAL PRIMARY KEY,
    locker_status_id INTEGER NOT NULL,
    locker_location_id INTEGER NOT NULL,
    token_id INTEGER,
    FOREIGN KEY (locker_status_id) REFERENCES locker_status(locker_status_id),
    FOREIGN KEY (locker_location_id) REFERENCES locker_locations(location_id),
    FOREIGN KEY (token_id) REFERENCES access_tokens(token_id)
);

-- 6. Robot Status table (참조되지 않는 테이블)
CREATE TABLE robot_status (
    robot_status_id SERIAL PRIMARY KEY,
    robot_status TEXT NOT NULL
);

-- 7. Robots table (robot_status 참조)
CREATE TABLE robots (
    robot_id SERIAL PRIMARY KEY,
    robot_name TEXT NOT NULL,
    completed_tasks INTEGER DEFAULT 0,
    last_maintenance TIMESTAMP NOT NULL,
    robot_status_id INTEGER NOT NULL,
    FOREIGN KEY (robot_status_id) REFERENCES robot_status(robot_status_id)
);

-- 8. Locker Usage Logs table (lockers, users, robots 참조)
CREATE TABLE locker_usage_logs (
    log_id SERIAL PRIMARY KEY,
    locker_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    store_time TIMESTAMP NOT NULL,
    store_robot_id INTEGER,
    retrieve_time TIMESTAMP,
    retrieve_robot_id INTEGER,
    FOREIGN KEY (locker_id) REFERENCES lockers(locker_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (store_robot_id) REFERENCES robots(robot_id),
    FOREIGN KEY (retrieve_robot_id) REFERENCES robots(robot_id)
);

-- 9. locker queue table (lockers 참조)
CREATE TABLE locker_queue (
    queue_id SERIAL PRIMARY KEY,
    locker_id INTEGER REFERENCES lockers(locker_id),
    request_type VARCHAR(10) NOT NULL
);

-- 10. locker status 테이블 초기화
INSERT INTO locker_status (locker_status) VALUES 
    ('사용가능'),
    ('사용중'),
    ('수리중');
    
-- 11. Insert initial values for locker_locations
INSERT INTO locker_locations (location_name) VALUES 
    ('A'),
    ('B'),
    ('C');
    
-- 12. lockers 테이블 초기화
INSERT INTO lockers (locker_id, locker_status_id, locker_location_id, token_id)
SELECT 
 CASE 
   WHEN s.id <= 60 THEN s.id + 100
   WHEN s.id <= 120 THEN (s.id - 60) + 200 
   ELSE (s.id - 120) + 300
 END,
  CASE 
   WHEN s.id <= 60 THEN 1
   WHEN s.id <= 120 THEN 2
   ELSE 3
 END, -- status_id
 CASE 
   WHEN s.id <= 60 THEN 1
   WHEN s.id <= 120 THEN 2
   ELSE 3
 END, -- location_id
 NULL -- token_id
FROM generate_series(1, 180) s(id);

-- 13. robot status 테이블 초기화
INSERT INTO robot_status (robot_status) VALUES 
    ('대기중'),
    ('사용중'),
    ('수리중');
    
-- 14. robots 테이블 초기화
INSERT INTO robots (robot_name, completed_tasks, last_maintenance, robot_status_id) VALUES 
	('Worker001', 0, '2025-01-01', 1),
	('Worker002', 0, '2025-01-01', 3),
	('Worker003', 0, '2025-01-01', 3),
	('Worker004', 0, '2025-01-01', 3),
	('Worker005', 0, '2025-01-01', 3);

-- 15. 인덱스 생성
-- locker_usage_logs 인덱스(locker_id가 일치하면서 retrieve_time가 NULL)
CREATE INDEX idx_usage_logs_locker_retrieve ON locker_usage_logs(locker_id) WHERE retrieve_time IS NULL;

-- users 인덱스(phone_number)
CREATE INDEX idx_users_phone ON users(phone_number);

-- lockers 인덱스(locker_location_id)
CREATE INDEX idx_lockers_location ON lockers(locker_location_id);

-- locker locations 인덱스(location_name)
CREATE INDEX idx_lockers_location_name ON locker_locations(location_name);

-- access tokens 인덱스(token_id)
CREATE INDEX idx_access_tokens_token_id ON access_tokens(token_id);

-- robots 인덱스(robot_status_id)
CREATE INDEX idx_robots_status ON robots(robot_status_id);

-- 16. 주석 추가
COMMENT ON TABLE locker_usage_logs IS '보관 정보 누적 관리';
COMMENT ON TABLE users IS '유저 전화번호 누적 관리';
COMMENT ON TABLE lockers IS '보관함 정보 관리';
COMMENT ON TABLE locker_status IS '보관함 상태 정보 명시';
COMMENT ON TABLE locker_locations IS '보관함 위치 정보 명시';
COMMENT ON TABLE access_tokens IS '보관 시 토큰 생시';
COMMENT ON TABLE robots IS '로봇 정보 관리';
COMMENT ON TABLE robot_status IS '로봇 상태 정보 명시';
