from google import genai
from loguru import logger

from core.config import settings


class GeminiAI:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key
        )

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

            return response.text

        except Exception:
            logger.exception("Gemini summarization failed")
            raise