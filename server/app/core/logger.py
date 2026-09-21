import sys

from loguru import logger

logger.remove()

logger.configure(
    extra={
        "request_id": "-",
    }
)

log_format = (
    "{time:YYYY-MM-DD HH:mm:ss.SSS} | "
    "{level: <8} | "
    "request_id={extra[request_id]} | "
    "{name}:{function}:{line} | "
    "{message}"
)

logger.add(
    sys.stdout,
    level="INFO",
    colorize=True,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>request_id={extra[request_id]}</cyan> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    ),
)

logger.add(
    "logs/app.log",
    level="INFO",
    rotation="10 MB",
    retention="7 days",
    compression="zip",
    encoding="utf-8",
    format=log_format,
)

__all__ = ["logger"]