from app.core.config import settings
from app.core.exceptions import GeminiAPIError
from google import genai
from google.genai import errors
from loguru import logger


class GeminiAI:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)

    async def summarize(self, text: str) -> str:
        try:
            response = await self.client.aio.models.generate_content(
                model="YOUR_GEMINI_MODEL",
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
            logger.debug("Gemini summarization response | response={} ", response)
            return response.text

        except errors.APIError as exc:
            logger.error(
                "Gemini API error | status={} | message={}",
                exc.code,
                exc.message,
            )
            raise GeminiAPIError(
                message=exc.message,
                status_code=exc.code,
            ) from exc
