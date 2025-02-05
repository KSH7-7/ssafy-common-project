# DB 세션 관리
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 데이터베이스 연결 URL (PostgreSQL에 연결)
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost/example"

# SQLAlchemy 기본 설정
Base = declarative_base()

# 세션 만들기
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()