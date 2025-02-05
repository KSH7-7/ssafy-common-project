# 앱 진입점 (FastAPI 인스턴스 실행)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import item, weather

# FastAPI 앱 초기화
app = FastAPI(debug=True)

# CORS 설정 추가
origins = ["*"]  # 모든 도메인 허용

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 오리진 (프론트엔드 주소)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# 라우터 등록
app.include_router(item.router, prefix="/items", tags=["Items"])
app.include_router(weather.router, prefix="/climate", tags=["Climate"])