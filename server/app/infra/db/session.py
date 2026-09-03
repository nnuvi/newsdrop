from contextlib import asynccontextmanager

from fastapi import FastAPI
from loguru import logger

from infra.db.mongodb import client, create_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting NewsDrop API")

    try:
        logger.info("Checking MongoDB connection")

        await client.admin.command("ping")

        logger.info("MongoDB connection successful")

        await create_indexes()

        logger.info("MongoDB indexes ready")

        yield

    except Exception:
        logger.exception("Application startup failed")
        raise

    finally:
        logger.info("Closing MongoDB connection")

        await client.close()

        logger.info("MongoDB connection closed")
