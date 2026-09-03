class AppException(Exception):
    """Base exception for application-level errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
    ):
        self.message = message
        self.status_code = status_code

        super().__init__(message)


class BadRequestError(AppException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(
            message=message,
            status_code=400,
        )


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
        )


class UnauthorizedError(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            message=message,
            status_code=401,
        )


class ForbiddenError(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(
            message=message,
            status_code=403,
        )


class ConflictError(AppException):
    def __init__(self, message: str = "Conflict"):
        super().__init__(
            message=message,
            status_code=409,
        )