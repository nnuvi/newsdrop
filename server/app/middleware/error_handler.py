from app.core.exceptions import AppException
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from loguru import logger


def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request,
        exc: AppException,
    ) -> JSONResponse:

        request_id = getattr(request.state, "request_id", "-")

        log_message = (
            "Application error | "
            "method={} path={} status={} code={} message={}"
        )

        if exc.status_code >= 500:
            logger.error(
                log_message,
                request.method,
                request.url.path,
                exc.status_code,
                exc.code,
                exc.message,
            )
        else:
            logger.warning(
                log_message,
                request.method,
                request.url.path,
                exc.status_code,
                exc.code,
                exc.message,
            )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": {
                    "code": exc.code,
                    "message": exc.message,
                    "request_id": request_id,
                }
            },
            headers={
                "X-Request-ID": request_id,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:

        request_id = getattr(request.state, "request_id", "-")

        logger.warning(
            "Validation error | method={} path={} errors={}",
            request.method,
            request.url.path,
            exc.errors(),
        )

        return JSONResponse(
            status_code=422,
            content={
                "detail": {
                    "code": "ValidationError",
                    "message": "Request validation failed",
                    "errors": exc.errors(),
                    "request_id": request_id,
                }
            },
            headers={
                "X-Request-ID": request_id,
            },
        )

    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:

        request_id = getattr(request.state, "request_id", "-")

        logger.exception(
            "Unhandled exception | method={} path={} error_type={} error={}",
            request.method,
            request.url.path,
            type(exc).__name__,
            str(exc),
        )

        return JSONResponse(
            status_code=500,
            content={
                "detail": {
                    "code": "InternalServerError",
                    "message": "Internal server error",
                    "request_id": request_id,
                }
            },
            headers={
                "X-Request-ID": request_id,
            },
        )