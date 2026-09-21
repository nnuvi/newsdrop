from pathlib import Path

from loguru import logger
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

environment = __import__("os").getenv(
    "ENVIRONMENT",
    "development",
)

env_file = (
    BASE_DIR / ".env.test"
    if environment == "test"
    else BASE_DIR / ".env"
)

logger.debug(
    f"Loading environment variables from {env_file} "
    f"for {environment} environment"
)


class Settings(BaseSettings):
    # Database
    mongodb_uri: str
    mongodb_database: str = "newsdrop"

    # News APIs
    news_api_key: str | None = None
    gnews_api_key: str | None = None

    # AI
    gemini_api_key: str | None = None

    # Authentication
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=env_file,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()