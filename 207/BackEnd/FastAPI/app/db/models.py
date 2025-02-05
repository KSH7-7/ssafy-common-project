# DB 모델 정의
from sqlalchemy import Column, Integer, String
from app.db.session import Base

# 테이블 모델 정의
class Item(Base):
    __tablename__ = 'item'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(80), nullable=False)
    description = Column(String(200), nullable=False)