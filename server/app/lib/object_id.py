from app.core.exceptions import BadRequestError
from bson import ObjectId


def to_object_id(value: str | ObjectId) -> ObjectId:
    if isinstance(value, ObjectId):
        return value

    if not ObjectId.is_valid(value):
        raise BadRequestError("Invalid ID")

    return ObjectId(value)