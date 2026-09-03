# from loguru import logger
# from fastapi import FastAPI, Request
# from fastapi.responses import JSONResponse

# from core.exceptions import AppException


# def register_exception_handlers(app: FastAPI) -> None:

#     @app.exception_handler(AppException)
#     async def app_exception_handler(
#         request: Request,
#         exc: AppException,
#     ) -> JSONResponse:

#         if exc.status_code >= 500:
#             logger.error(
#                 "{} {} | {} | {}",
#                 request.method,
#                 request.url.path,
#                 exc.status_code,
#                 exc.message,
#             )
#         else:
#             logger.warning(
#                 "{} {} | {} | {}",
#                 request.method,
#                 request.url.path,
#                 exc.status_code,
#                 exc.message,
#             )
#         return JSONResponse(
#             status_code=exc.status_code,
#             content={
#                 "error": {
#                     "code": exc.__class__.__name__,
#                     "message": exc.message,
#                 }
#             },
#         )

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from loguru import logger

from core.exceptions import AppException


def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request,
        exc: AppException,
    ) -> JSONResponse:

        if exc.status_code >= 500:
            logger.error(
                "{} {} | {} | {}",
                request.method,
                request.url.path,
                exc.status_code,
                exc.message,
            )
        else:
            logger.warning(
                "{} {} | {} | {}",
                request.method,
                request.url.path,
                exc.status_code,
                exc.message,
            )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.__class__.__name__,
                    "message": exc.message,
                }
            },
        )

    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:

        logger.exception(
            "Unhandled exception | {} {}",
            request.method,
            request.url.path,
        )

        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "InternalServerError",
                    "message": "Internal server error",
                }
            },
        )