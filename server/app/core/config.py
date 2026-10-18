from os import getenv
from pathlib import Path

from app.core.logger import logger
from pydantic import HttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

environment = getenv("ENVIRONMENT", "development").lower()
env_file = BASE_DIR / ".env.test" if environment == "test" else BASE_DIR / ".env"

logger.debug(
    f"Loading environment variables from {env_file} for {environment} environment"
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

    # CORS
    cors_origins: list[HttpUrl] = [
        HttpUrl("http://localhost:8081"),
        HttpUrl("https://newsdrop-sigma.vercel.app"),
    ]

    model_config = SettingsConfigDict(
        env_file=env_file,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(
        cls,
        origins: list[HttpUrl],
    ) -> list[HttpUrl]:
        if not origins:
            raise ValueError("CORS_ORIGINS must not be empty")

        for origin in origins:
            if (
                origin.path not in ("", "/")
                or origin.query
                or origin.fragment
                or origin.username
                or origin.password
            ):
                raise ValueError(
                    f"CORS origin must contain only scheme, host, and port: {origin}"
                )

            if origin.scheme not in ("http", "https"):
                raise ValueError("CORS origins must use HTTP or HTTPS")

        return origins

    @property
    def cors_origins_list(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.cors_origins]


settings = Settings()