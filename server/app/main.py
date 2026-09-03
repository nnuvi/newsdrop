from fastapi import FastAPI
from loguru import logger

from api.router import api_router
from middleware.error_handler import register_exception_handlers
from infra.db.session import lifespan


app = FastAPI(
    title="NewsDrop",
    lifespan=lifespan,
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