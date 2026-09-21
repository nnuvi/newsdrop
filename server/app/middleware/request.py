from time import perf_counter
from uuid import uuid4

from fastapi import Request
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid4())

        request.state.request_id = request_id

        start = perf_counter()

        with logger.contextualize(request_id=request_id):
            try:
                response = await call_next(request)

                duration_ms = (perf_counter() - start) * 1000

                logger.info(
                    "Request completed | method={} path={} status={} duration_ms={:.2f}",
                    request.method,
                    request.url.path,
                    response.status_code,
                    duration_ms,
                )

                response.headers["X-Request-ID"] = request_id

                return response

            except Exception:
                duration_ms = (perf_counter() - start) * 1000

                logger.exception(
                    "Request failed | method={} path={} duration_ms={:.2f}",
                    request.method,
                    request.url.path,
                    duration_ms,
                )

                raise
