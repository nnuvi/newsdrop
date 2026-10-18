import json
import os
import sys
from pathlib import Path

from loguru import logger

LOG_DIR = Path(__file__).resolve().parents[2] / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

APP_ENV = os.getenv("ENVIRONMENT", "development").lower()
LOG_LEVEL = "DEBUG" if APP_ENV == "development" else "INFO"

logger.remove()

logger.configure(
    extra={
        "request_id": "-",
    }
)


def format_record(record):
    message = record["message"]
    data = record["extra"].get("data")

    if data is not None:
        message += "\n" + json.dumps(
            data,
            indent=2,
            default=str,
        )

    return (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>request_id={extra[request_id]}</cyan> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>\n"
    )


logger.add(
    sys.stdout,
    level=LOG_LEVEL,
    colorize=True,
    format=format_record,
)

logger.add(
    LOG_DIR / "app.log",
    level=LOG_LEVEL,
    rotation="10 MB",
    retention="7 days",
    compression="zip",
    encoding="utf-8",
    format=format_record,
)

__all__ = ["logger"]
