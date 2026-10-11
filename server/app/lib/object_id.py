from app.core.exceptions import BadRequestError
from bson import ObjectId


def to_object_id(
    value: str | ObjectId,
    message: str = "Invalid ID",
) -> ObjectId:
    if isinstance(value, ObjectId):
        return value

    if not ObjectId.is_valid(value):
        raise BadRequestError(message)

    return ObjectId(value)
