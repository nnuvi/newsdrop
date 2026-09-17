import asyncio

from app.core.config import settings
from app.core.exceptions import GeminiAPIError
from google import genai
from google.genai import errors
from loguru import logger


class GeminiAI:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key
        )

    async def summarize(
        self,
        text: str,
    ) -> str:

        max_retries = 3

        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=f"""
                        Summarize the following news article clearly.

                        Focus on:
                        - What happened
                        - Important facts
                        - People/organizations involved
                        - Important numbers
                        - Why it matters

                        Article:
                        {text}
                    """,
                )

                logger.debug(
                    "Gemini summarization successful | "
                    "attempt={} model={} finish_reason={}",
                    attempt + 1,
                    response.model_version,
                    response.candidates[0].finish_reason
                    if response.candidates
                    else None,
                )

                return response.text

            except errors.APIError as exc:
                logger.warning(
                    "Gemini API error | attempt={}/{} status={} message={}",
                    attempt + 1,
                    max_retries,
                    exc.code,
                    exc.message,
                )

                if exc.code != 503 or attempt == max_retries - 1:
                    raise GeminiAPIError(
                        message=exc.message,
                        status_code=exc.code,
                    ) from exc

                delay = 2**attempt

                logger.debug(
                    "Retrying Gemini request | delay={}s",
                    delay,
                )

                await asyncio.sleep(delay)

        raise GeminiAPIError(
            message="Gemini summarization failed",
            status_code=503,
        )