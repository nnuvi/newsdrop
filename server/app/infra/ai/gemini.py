import asyncio

from app.core.config import settings
from app.core.exceptions import GeminiAPIError
from app.modules.summaries.schema import AIResponse, SummaryDetails, SummaryInput
from google import genai
from google.genai import errors, types
from loguru import logger


class GeminiAI:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    async def summarize(
        self,
        data: SummaryInput,
    ) -> AIResponse:
        max_retries = 3

        system_instruction = (
            "Summarize the provided news articles into a single NewsDrop summary. "
            "Return a concise title and a clear overview covering the most important "
            "events, facts, people or organizations involved, important numbers, "
            "and why the news matters. "
            "Extract important numerical facts, metrics, or statistics when they are "
            "explicitly present in the provided articles. "
            "Do not invent, estimate, or infer statistics that are not explicitly "
            "supported by the article content. "
            "For every statistic, use the exact article ID from the provided input."
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=SummaryDetails,
            temperature=0.1,
        )

        contents = data.model_dump_json()

        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=contents,
                    config=config,
                )

                finish_reason = (
                    response.candidates[0].finish_reason
                    if response.candidates
                    else None
                )

                logger.debug(
                    "Gemini summarization successful | "
                    "attempt={} model={} finish_reason={}",
                    attempt + 1,
                    response.model_version,
                    finish_reason,
                )

                summary_data: SummaryDetails | None = response.parsed

                if summary_data is None:
                    raise GeminiAPIError(
                        message="Failed to parse structured summary response",
                        status_code=500,
                    )

                article_ids = {article.id for article in data.articles}

                for statistic in summary_data.statistics:
                    if statistic.article_id not in article_ids:
                        raise GeminiAPIError(
                            message="Gemini returned an invalid article ID",
                            status_code=500,
                        )

                return AIResponse(
                    title=summary_data.title,
                    summary=summary_data.summary,
                    statistics=summary_data.statistics,
                    model=response.model_version,
                )

            except errors.APIError as exc:
                logger.warning(
                    "Gemini API error | attempt={}/{} status={} message={}",
                    attempt + 1,
                    max_retries,
                    exc.code,
                    exc.message,
                )

                if exc.code not in (429, 503) or attempt == max_retries - 1:
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


# import asyncio

# from app.core.config import settings
# from app.core.exceptions import GeminiAPIError
# from google import genai
# from google.genai import errors
# from loguru import logger


# class GeminiAI:
#     def __init__(self):
#         self.client = genai.Client(
#             api_key=settings.gemini_api_key
#         )

#     async def summarize(
#         self,
#         text: str,
#     ) -> str:

#         max_retries = 3

#         for attempt in range(max_retries):
#             try:
#                 response = await self.client.aio.models.generate_content(
#                     model="gemini-3.6-flash",
#                     contents=f"""
#                         Summarize the following news article clearly.

#                         Focus on:
#                         - What happened
#                         - Important facts
#                         - People/organizations involved
#                         - Important numbers
#                         - Why it matters

#                         Article:
#                         {text}
#                     """,
#                 )

#                 logger.debug(
#                     "Gemini summarization successful | "
#                     "attempt={} model={} finish_reason={}",
#                     attempt + 1,
#                     response.model_version,
#                     response.candidates[0].finish_reason
#                     if response.candidates
#                     else None,
#                 )

#                 return response.text

#             except errors.APIError as exc:
#                 logger.warning(
#                     "Gemini API error | attempt={}/{} status={} message={}",
#                     attempt + 1,
#                     max_retries,
#                     exc.code,
#                     exc.message,
#                 )

#                 if exc.code != 503 or attempt == max_retries - 1:
#                     raise GeminiAPIError(
#                         message=exc.message,
#                         status_code=exc.code,
#                     ) from exc

#                 delay = 2**attempt

#                 logger.debug(
#                     "Retrying Gemini request | delay={}s",
#                     delay,
#                 )

#                 await asyncio.sleep(delay)

#         raise GeminiAPIError(
#             message="Gemini summarization failed",
#             status_code=503,
#         )
