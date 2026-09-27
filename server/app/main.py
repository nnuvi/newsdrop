from app.api.router import api_router
from app.infra.db.session import lifespan
from app.middleware.error_handler import register_exception_handlers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

app = FastAPI(
    title="NewsDrop",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:8082",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "NewsDrop is running"}


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "NewsDrop API",
    }


register_exception_handlers(app)

app.include_router(api_router)

logger.info("NewsDrop Started Successfully")
