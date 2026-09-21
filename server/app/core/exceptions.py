class AppException(Exception):
    """Base exception for expected application-level errors."""

    status_code: int = 500
    code: str = "AppError"
    default_message: str = "Application error"

    def __init__(self, message: str | None = None):
        self.message = message or self.default_message
        super().__init__(self.message)


class BadRequestError(AppException):
    status_code = 400
    code = "BadRequest"
    default_message = "Bad request"


class UnauthorizedError(AppException):
    status_code = 401
    code = "Unauthorized"
    default_message = "Unauthorized"


class ForbiddenError(AppException):
    status_code = 403
    code = "Forbidden"
    default_message = "Forbidden"


class NotFoundError(AppException):
    status_code = 404
    code = "NotFound"
    default_message = "Resource not found"


class ConflictError(AppException):
    status_code = 409
    code = "Conflict"
    default_message = "Conflict"


class NewsAPIError(AppException):
    status_code = 502
    code = "NewsAPIError"
    default_message = "News API request failed"


class GeminiAPIError(AppException):
    status_code = 502
    code = "GeminiAPIError"
    default_message = "Gemini API request failed"
